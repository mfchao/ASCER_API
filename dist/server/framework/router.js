"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpressRouter = exports.Router = exports.FormattableError = void 0;
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const utils_1 = require("./utils");
/**
 * A formattable error. Use `{0}`, `{1}`, etc. in the error message to format it with the arguments passed to the constructor.
 * The `formatWith` method can be used to create a new error with the same format but different arguments.
 *
 * Example:
 * ```
 * let error = new FormattableError("{0} is not the author of post {1}!", author, _id);
 * let errorWithUsername = e.formatWith(username, _id);
 * ```
 */
class FormattableError extends Error {
    constructor(format, ...args) {
        super(format.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== "undefined" ? args[number] : match;
        }));
        this.format = format;
        this.HTTP_CODE = 500;
    }
    formatWith(...args) {
        const e = new FormattableError(this.format, ...args);
        e.HTTP_CODE = this.HTTP_CODE;
        return e;
    }
}
exports.FormattableError = FormattableError;
/**
 * This class an abstraction over the express router, used to decorate methods in your concept classes.
 * It will automatically convert actions into express handlers.
 *
 * For error handling, `message` and `HTTP_CODE` properties of errors are used to send responses.
 */
class Router {
    constructor() {
        this.expressRouter = express_1.default.Router();
    }
    static registerError(etype, handler) {
        this.errorHandlers.set(etype, handler);
    }
    static handleError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const [etype, handler] of this.errorHandlers) {
                    if (err instanceof etype) {
                        return yield handler(err);
                    }
                }
                return err;
            }
            catch (e) {
                return new Error(`While handling below error:\n${err}\n\nAnother error occurred:\n${e}`);
            }
        });
    }
    registerRoute(method, path, action) {
        this.expressRouter[method](path, this.makeRoute(action));
    }
    all(path, action) {
        this.registerRoute("all", path, action);
    }
    get(path, action) {
        this.registerRoute("get", path, action);
    }
    post(path, action) {
        this.registerRoute("post", path, action);
    }
    put(path, action) {
        this.registerRoute("put", path, action);
    }
    delete(path, action) {
        this.registerRoute("delete", path, action);
    }
    patch(path, action) {
        this.registerRoute("patch", path, action);
    }
    options(path, action) {
        this.registerRoute("options", path, action);
    }
    head(path, action) {
        this.registerRoute("head", path, action);
    }
    makeRoute(f) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const reqMap = (name) => {
                if (name === "session" || name == "param" || name == "query" || name == "body") {
                    return req[name];
                }
                const ret = req.params[name] || req.query[name] || req.body[name];
                if (ret === undefined || ret === null) {
                    // TODO: Can we know if this param was required?
                    return undefined;
                }
                return ret;
            };
            const argNames = (0, utils_1.getParamNames)(f);
            const args = argNames.map(reqMap);
            let result;
            try {
                result = f.call(null, ...args);
                if (result instanceof Promise) {
                    result = yield result;
                }
            }
            catch (e) {
                const error = (yield Router.handleError(e));
                res.status((_a = error.HTTP_CODE) !== null && _a !== void 0 ? _a : 500).json({ msg: (_b = error.message) !== null && _b !== void 0 ? _b : "Internal Server Error" });
                return;
            }
            res.json(result);
        });
    }
    static all(route) {
        return this.httpDecorator("get", route);
    }
    static get(route) {
        return this.httpDecorator("get", route);
    }
    static post(route) {
        return this.httpDecorator("post", route);
    }
    static put(route) {
        return this.httpDecorator("put", route);
    }
    static delete(route) {
        return this.httpDecorator("delete", route);
    }
    static patch(route) {
        return this.httpDecorator("patch", route);
    }
    static options(route) {
        return this.httpDecorator("options", route);
    }
    static head(route) {
        return this.httpDecorator("head", route);
    }
    static httpDecorator(method, route) {
        return function (originalMethod, context) {
            context.addInitializer(function () {
                // For each method decorated with this decorator, save the method and path metadata.
                // This metadata can be accessed later to build the express router.
                Reflect.defineMetadata("method", method, this, context.name);
                Reflect.defineMetadata("path", route, this, context.name);
            });
        };
    }
}
exports.Router = Router;
Router.errorHandlers = new Map();
function getExpressRouter(routes) {
    const router = new Router();
    // Get all methods in the Routes class (e.g., getUsers, createUser, etc).
    const endpoints = Object.getOwnPropertyNames(Object.getPrototypeOf(routes));
    // Register the methods as routes in `router`.
    for (const endpoint of endpoints) {
        // Get the method and path metadata from the routes object.
        // These come from decorators in the Routes class.
        const method = Reflect.getMetadata("method", routes, endpoint);
        const path = Reflect.getMetadata("path", routes, endpoint);
        // Skip if the method or path is not defined (e.g., when endpoint is the constructor)
        if (!method || !path) {
            continue;
        }
        // The ugly cast is because TypeScript doesn't know that `routes[endpoint]` is a correct method.
        const action = routes[endpoint];
        router.registerRoute(method, path, action);
    }
    return router.expressRouter;
}
exports.getExpressRouter = getExpressRouter;
//# sourceMappingURL=router.js.map