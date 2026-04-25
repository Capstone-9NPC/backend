import { Router } from 'express';
import {
  createReport,
  getPresignedUrl,
} from '../controllers/report.controller';
import { validate } from '../middlewares/validation.middleware';
import {
  createReportSchema,
  getPresignedUrlSchema,
} from '../utils/validators/report.validator';

const router = Router();

router.post('/create', validate(createReportSchema), createReport);

router.post('/presigned-url', validate(getPresignedUrlSchema), getPresignedUrl);

export default router;
