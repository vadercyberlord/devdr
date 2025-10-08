const CustomAPIError = require('./customapi');

class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 403 // Forbidden
    }
}

module.exports = UnauthorizedError;