import express from 'express';
import { submitAssessment, getTodayStatusHandler, getHistory } from '../controller/assessmentController.js';
import validate  from '../middleware/validate.js';
import { checkInSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/', validate(checkInSchema), submitAssessment);
router.get('/today', getTodayStatusHandler);
router.get('/history', getHistory);

export default router;