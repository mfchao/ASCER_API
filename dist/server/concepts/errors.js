"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.NotAllowedError = exports.UnauthenticatedError = exports.BadValuesError = void 0;
const router_1 = require("../framework/router");
/**
 * Corresponds to an action attempted by a user that contains bad values for parameters.
 * If this action was a HTTP request, status code for this error would be 400 Bad Request.
 */
class BadValuesError extends router_1.FormattableError {
    constructor() {
        super(...arguments);
        this.HTTP_CODE = 400;
    }
}
exports.BadValuesError = BadValuesError;
/**
 * Corresponds to an action attempted by a user that is not authenticated.
 * If this action was a HTTP request, status code for this error would be 401 Unauthorized.
 */
class UnauthenticatedError extends router_1.FormattableError {
    constructor() {
        super(...arguments);
        this.HTTP_CODE = 401;
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
/**
 * Corresponds to a forbidden action attempted by a user.
 * If this action was a HTTP request, status code for this error would be 403 Forbidden.
 */
class NotAllowedError extends router_1.FormattableError {
    constructor() {
        super(...arguments);
        this.HTTP_CODE = 403;
    }
}
exports.NotAllowedError = NotAllowedError;
/**
 * Corresponds to an action that attempts to access a resource that doesn't exist.
 * If this action was a HTTP request, status code for this error would be 404 Not Found.
 */
class NotFoundError extends router_1.FormattableError {
    constructor() {
        super(...arguments);
        this.HTTP_CODE = 404;
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=errors.js.map