import AssessmentRepository from '../repository/assessmentRepository.js';
import { handleError } from '../helper/handleError.js';

// submitAssessment   
// POST /api/checkin
export const submitAssessment = async (req, res) => {
    try {
        const result = await AssessmentRepository.processDailyCheckIn(req.user.id, req.body);
 
        return res.status(201).json({
            success: true,
            message: "Daily check-in processed successfully.",
            data:    result,
        });
 
    } catch (error) {
        return handleError(res, error, "submitAssessment");
    }
};
 
// getTodayStatusHandler   
// GET /api/checkin/today
export const getTodayStatusHandler = async (req, res) => {
    try {
        const status = await AssessmentRepository.getTodayStatus(req.user.id);
 
        return res.status(200).json({
            success: true,
            message: "Today's assessment status retrieved successfully.",
            data:    status,
        });
 
    } catch (error) {
        return handleError(res, error, "getTodayStatus");
    }
};
 
// getHistory   
// GET /api/checkin/history?limit=30
export const getHistory = async (req, res) => {
    try {
        const rawLimit = parseInt(req.query.limit);
        const limit    = (!isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100)
            ? rawLimit
            : 30;
 
        const historyData = await AssessmentRepository.getAssessmentHistory(req.user.id, limit);
 
        return res.status(200).json({
            success: true,
            message: "Assessment history retrieved successfully.",
            data:    historyData,
        });
 
    } catch (error) {
        return handleError(res, error, "getHistory");
    }
};