// ExternalServiceError — 502 Bad Gateway
// Digunakan ketika service pihak ketiga (ML API, dsb) tidak bisa dihubungi
// atau mengembalikan response yang tidak valid.
class ExternalServiceError extends Error {
    constructor(message) {
        super(message);
        this.name       = "ExternalServiceError";
        this.statusCode = 502;
    }
}

export default ExternalServiceError;
