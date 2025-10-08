const CustomAPIError = require('./customapi');

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

module.exports = NotFoundError;