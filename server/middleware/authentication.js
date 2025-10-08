const { isTokenValid } = require("../utils");
const CustomErrors = require("../errors");

const authenticateUser = async(req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomErrors.UnauthenticatedError("Authentication failed");
    }
    try {
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role };
        next();
    } catch (error) {
        throw new CustomErrors.UnauthenticatedError("Authentication invalid");
    }
};

const authorizePermission = (...rest) => {
    // ...rest takes any number of arguments coming from user routes
    return (req, res, next) => {
        if (!rest.includes(req.user.role)) {
            throw new CustomErrors.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };

    // if (req.user.role != 'admin') {
    //     throw new CustomErrors.UnauthorizedError('Unauthorized to access this route')
    // }
};
module.exports = { authenticateUser, authorizePermission };