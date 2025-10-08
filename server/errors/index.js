
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./notfound')
const BadRequestError = require('./badrequest')
const UnauthorizedError = require('./unauthorized')

module.exports = {
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
}