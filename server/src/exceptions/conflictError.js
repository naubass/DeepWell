import ClientError from "./clientError.js";

class ConflictError extends ClientError {
    constructor(message) {
        super(message, 409);
        this.name = "ConflictError";
    }
}

export default ConflictError;
