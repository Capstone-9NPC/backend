import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index';
import { report, evidenceAsset } from '../db/schema';
import { nanoid } from 'nanoid';
import supabase from '../config/supabase';

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    incident,
    date,
    location,
    incidentDesc,
    perpretatorDesc,
    evidencePaths,
  } = req.body;

  try {
    // Menggunakan transaksi untuk memastikan integritas data
    const [newReport] = await db.transaction(async (tx) => {
      // 1. Masukkan data laporan utama
      const [insertedReport] = await tx
        .insert(report)
        .values({
          userId: req.user!.id,
          reportCode: `RPT-${nanoid(10)}`,
          incident: incident,
          date: date,
          location: location,
          incidentDesc: incidentDesc,
          perpretatorDesc: perpretatorDesc,
        })
        .returning();

      // 2. Siapkan array untuk menampung path permanen
      const permanentPathsData: { reportId: string; evidencePath: string }[] =
        [];

      // 3. Proses pemindahan file dari temp ke permanent jika ada bukti
      if (
        evidencePaths &&
        Array.isArray(evidencePaths) &&
        evidencePaths.length > 0
      ) {
        for (const tempPath of evidencePaths) {
          // Ambil nama file dari path temp (contoh: "temp/123/abcd-foto.jpg" -> "abcd-foto.jpg")
          const fileName = tempPath.split('/').pop();

          // Buat path permanen menggunakan ID laporan agar terorganisir
          const permanentPath = `permanent/${insertedReport.id}/${fileName}`;

          // Lakukan pemindahan (move) di Supabase Storage
          const { error: moveError } = await supabase.storage
            .from('evidence_assets')
            .move(tempPath, permanentPath);

          if (moveError) {
            // Jika ada 1 saja file yang gagal dipindah, lemparkan error.
            // Drizzle akan otomatis me-rollback insert laporan di atas.
            throw new Error(
              `Gagal memindahkan file bukti: ${moveError.message}`,
            );
          }

          // Jika berhasil dipindah, catat path permanennya
          permanentPathsData.push({
            reportId: insertedReport.id,
            evidencePath: permanentPath,
          });
        }

        // 4. Masukkan path PERMANENT yang baru ke tabel evidence_asset
        if (permanentPathsData.length > 0) {
          await tx.insert(evidenceAsset).values(permanentPathsData);
        }
      }

      return [insertedReport];
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat',
      data: newReport,
    });
  } catch (error) {
    next(error);
  }
};

export const getPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fileName, fileType, fileSize } = req.body;
  const userId = req.user!.id;
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-]/g, '_');

  // Format: temp/{userId}/{randomId}-{fileNameAsli}
  const path = `temp/${userId}/${nanoid(8)}-${safeFileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('evidence_assets')
      .createSignedUploadUrl(path);

    if (error) {
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: 'Presigned URL berhasil dibuat',
      data: {
        // URL ini yang digunakan klien untuk mengunggah file
        uploadUrl: data.signedUrl,
        // Path ini yang harus disimpan klien dan dikirim saat membuat laporan
        path: data.path,
      },
    });
  } catch (error) {
    next(error);
  }
};
