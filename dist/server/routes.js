"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./framework/router");
const app_1 = require("./app");
let Routes = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _getCurrentSession_decorators;
    let _getSessions_decorators;
    let _startSession_decorators;
    let _endSession_decorators;
    let _getUsers_decorators;
    let _createUser_decorators;
    let _getImages_decorators;
    let _createImage_decorators;
    let _deleteImage_decorators;
    let _createDataEntry_decorators;
    let _getRating_decorators;
    let _updateData_decorators;
    return _a = class Routes {
            getCurrentSession(session, token) {
                return __awaiter(this, void 0, void 0, function* () {
                    const newSession = app_1.WebSession.getCurrentSession(session, token);
                    return newSession;
                });
            }
            getSessions() {
                return __awaiter(this, void 0, void 0, function* () {
                    const Sessions = app_1.WebSession.getSessions();
                    return Sessions;
                });
            }
            startSession(session, token) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (token) {
                        const user = app_1.WebSession.getUser(session);
                        app_1.WebSession.start(session, user, token);
                    }
                    else {
                        app_1.WebSession.start(session);
                    }
                    return { msg: "Session started!", session };
                });
            }
            endSession(session, email) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (email) {
                        app_1.WebSession.end(session, email);
                    }
                    else {
                        app_1.WebSession.end(session);
                    }
                    return { msg: "Session ended!", session };
                });
            }
            getUsers() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.User.getUsers();
                });
            }
            createUser(session, category) {
                return __awaiter(this, void 0, void 0, function* () {
                    app_1.WebSession.isActive(session);
                    return yield app_1.User.create(category);
                });
            }
            getImages() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.getImages();
                });
            }
            createImage(file) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.create(file);
                });
            }
            deleteImage(file) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.delete(file);
                });
            }
            createDataEntry(session, image, rating) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFile(image);
                    const user = app_1.WebSession.getUser(session);
                    const category = yield app_1.User.getCategory(user);
                    return yield app_1.Dataset.create(image_id, rating, category);
                });
            }
            getRating(image) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFile(image);
                    return yield app_1.Dataset.getRatingbyID(image_id);
                });
            }
            updateData(image, update) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFile(image);
                    const entry_id = yield app_1.Dataset.getIDbyfile(image_id);
                    return yield app_1.Dataset.update(entry_id, update);
                });
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getCurrentSession_decorators = [router_1.Router.get("/session")];
            _getSessions_decorators = [router_1.Router.get("/session/sessions")];
            _startSession_decorators = [router_1.Router.post("/session/start")];
            _endSession_decorators = [router_1.Router.post("/session/end")];
            _getUsers_decorators = [router_1.Router.get("/users")];
            _createUser_decorators = [router_1.Router.post("/users")];
            _getImages_decorators = [router_1.Router.get("/images")];
            _createImage_decorators = [router_1.Router.post("/images")];
            _deleteImage_decorators = [router_1.Router.delete("/images")];
            _createDataEntry_decorators = [router_1.Router.post("/dataset")];
            _getRating_decorators = [router_1.Router.get("/dataset")];
            _updateData_decorators = [router_1.Router.patch("/dataset")];
            __esDecorate(_a, null, _getCurrentSession_decorators, { kind: "method", name: "getCurrentSession", static: false, private: false, access: { has: obj => "getCurrentSession" in obj, get: obj => obj.getCurrentSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getSessions_decorators, { kind: "method", name: "getSessions", static: false, private: false, access: { has: obj => "getSessions" in obj, get: obj => obj.getSessions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startSession_decorators, { kind: "method", name: "startSession", static: false, private: false, access: { has: obj => "startSession" in obj, get: obj => obj.startSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endSession_decorators, { kind: "method", name: "endSession", static: false, private: false, access: { has: obj => "endSession" in obj, get: obj => obj.endSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getUsers_decorators, { kind: "method", name: "getUsers", static: false, private: false, access: { has: obj => "getUsers" in obj, get: obj => obj.getUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createUser_decorators, { kind: "method", name: "createUser", static: false, private: false, access: { has: obj => "createUser" in obj, get: obj => obj.createUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getImages_decorators, { kind: "method", name: "getImages", static: false, private: false, access: { has: obj => "getImages" in obj, get: obj => obj.getImages }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createImage_decorators, { kind: "method", name: "createImage", static: false, private: false, access: { has: obj => "createImage" in obj, get: obj => obj.createImage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteImage_decorators, { kind: "method", name: "deleteImage", static: false, private: false, access: { has: obj => "deleteImage" in obj, get: obj => obj.deleteImage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createDataEntry_decorators, { kind: "method", name: "createDataEntry", static: false, private: false, access: { has: obj => "createDataEntry" in obj, get: obj => obj.createDataEntry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRating_decorators, { kind: "method", name: "getRating", static: false, private: false, access: { has: obj => "getRating" in obj, get: obj => obj.getRating }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateData_decorators, { kind: "method", name: "updateData", static: false, private: false, access: { has: obj => "updateData" in obj, get: obj => obj.updateData }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = (0, router_1.getExpressRouter)(new Routes());
//# sourceMappingURL=routes.js.map