import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const flattened = z.flattenError(error);

        return res.status(400).json({
          success: false,
          message: 'Input tidak valid',
          errors: flattened.fieldErrors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
      });
    }
  };
