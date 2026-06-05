import { ClientError } from "../exceptions/index.js";

export const handleError = (res, error, context) => {
    if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
 
    // ExternalServiceError bukan ClientError, tangkap via statusCode
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
 
    console.error(`[AssessmentController] ${context}:`, error.message);
    return res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
};