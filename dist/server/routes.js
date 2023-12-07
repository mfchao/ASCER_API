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
    let _getCurrentToken_decorators;
    let _startSession_decorators;
    let _endSession_decorators;
    let _getUsers_decorators;
    let _deleteUsers_decorators;
    let _getQuestion_decorators;
    let _getDescriptions_decorators;
    let _createUser_decorators;
    let _getImages_decorators;
    let _createImage_decorators;
    let _deleteImage_decorators;
    let _getFilename_decorators;
    let _getRatingNumber_decorators;
    let _createDataEntry_decorators;
    let _getRating_decorators;
    let _updateData_decorators;
    let _getDataset_decorators;
    let _getDatasetbyToken_decorators;
    let _deleteDataset_decorators;
    return _a = class Routes {
            // @Router.get("/session")
            // async getCurrentSession(session: WebSessionDoc, token?: string) {
            //   const newSession = WebSession.getCurrentSession(session, token);
            //   return newSession;
            // }
            getCurrentToken(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    const currentToken = app_1.WebSession.getToken(session);
                    return currentToken;
                });
            }
            // @Router.get("/session/sessions")
            // async getSessions() {
            //   const Sessions = WebSession.getSessions();
            //   return Sessions;
            // }
            startSession(session, token) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield app_1.User.getUserByToken(token);
                    if (user != null) {
                        app_1.WebSession.start(session, token, user._id);
                    }
                    else {
                        const category = app_1.WebSession.getCategoryFromToken(token);
                        const newUser = yield app_1.User.create(category, token);
                        if (newUser.user != null) {
                            app_1.WebSession.start(session, token, newUser.user._id);
                        }
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
            deleteUsers() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.User.deleteAll();
                });
            }
            getQuestion(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    app_1.WebSession.isActive(session);
                    const category = app_1.WebSession.getCategory(session);
                    if (category) {
                        return yield app_1.User.getQuestion(category);
                    }
                });
            }
            getDescriptions(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    app_1.WebSession.isActive(session);
                    const category = app_1.WebSession.getCategory(session);
                    if (category) {
                        return yield app_1.User.getDescriptions(category);
                    }
                });
            }
            createUser(session, category, token) {
                return __awaiter(this, void 0, void 0, function* () {
                    app_1.WebSession.isActive(session);
                    return yield app_1.User.create(category, token);
                });
            }
            getImages() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.getImages();
                });
            }
            createImage(file, link) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.create(file, link);
                });
            }
            deleteImage(file) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.delete(file);
                });
            }
            getFilename(_id) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Image.getFilename(_id);
                });
            }
            getRatingNumber(session, image) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFilename(image);
                    const token = app_1.WebSession.getToken(session);
                    return yield app_1.Dataset.getRatingNumber(image_id, token);
                });
            }
            createDataEntry(session, image, rating) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFilename(image);
                    const category = app_1.WebSession.getCategory(session);
                    const token = app_1.WebSession.getToken(session);
                    if (category) {
                        return yield app_1.Dataset.create(image_id, rating, category, token);
                    }
                });
            }
            getRating(image) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFilename(image);
                    return yield app_1.Dataset.getRatingbyID(image_id);
                });
            }
            updateData(image, update) {
                return __awaiter(this, void 0, void 0, function* () {
                    const image_id = yield app_1.Image.getImageByFilename(image);
                    const entry_id = yield app_1.Dataset.getIDbyfile(image_id);
                    return yield app_1.Dataset.update(entry_id, update);
                });
            }
            getDataset() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Dataset.getDataset();
                });
            }
            getDatasetbyToken(token) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Dataset.getDatasetbyToken(token);
                });
            }
            deleteDataset() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield app_1.Dataset.deleteAll();
                });
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getCurrentToken_decorators = [router_1.Router.get("/session")];
            _startSession_decorators = [router_1.Router.post("/session/start")];
            _endSession_decorators = [router_1.Router.post("/session/end")];
            _getUsers_decorators = [router_1.Router.get("/users")];
            _deleteUsers_decorators = [router_1.Router.delete("/users")];
            _getQuestion_decorators = [router_1.Router.get("/users/category")];
            _getDescriptions_decorators = [router_1.Router.get("/users/descriptions")];
            _createUser_decorators = [router_1.Router.post("/users")];
            _getImages_decorators = [router_1.Router.get("/images")];
            _createImage_decorators = [router_1.Router.post("/images")];
            _deleteImage_decorators = [router_1.Router.delete("/images")];
            _getFilename_decorators = [router_1.Router.get("/images/:_id")];
            _getRatingNumber_decorators = [router_1.Router.get("/dataset/rating/:image")];
            _createDataEntry_decorators = [router_1.Router.post("/dataset")];
            _getRating_decorators = [router_1.Router.get("/dataset/rating")];
            _updateData_decorators = [router_1.Router.patch("/dataset")];
            _getDataset_decorators = [router_1.Router.get("/dataset")];
            _getDatasetbyToken_decorators = [router_1.Router.get("/dataset/users/:token")];
            _deleteDataset_decorators = [router_1.Router.delete("/dataset")];
            __esDecorate(_a, null, _getCurrentToken_decorators, { kind: "method", name: "getCurrentToken", static: false, private: false, access: { has: obj => "getCurrentToken" in obj, get: obj => obj.getCurrentToken }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startSession_decorators, { kind: "method", name: "startSession", static: false, private: false, access: { has: obj => "startSession" in obj, get: obj => obj.startSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endSession_decorators, { kind: "method", name: "endSession", static: false, private: false, access: { has: obj => "endSession" in obj, get: obj => obj.endSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getUsers_decorators, { kind: "method", name: "getUsers", static: false, private: false, access: { has: obj => "getUsers" in obj, get: obj => obj.getUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteUsers_decorators, { kind: "method", name: "deleteUsers", static: false, private: false, access: { has: obj => "deleteUsers" in obj, get: obj => obj.deleteUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getQuestion_decorators, { kind: "method", name: "getQuestion", static: false, private: false, access: { has: obj => "getQuestion" in obj, get: obj => obj.getQuestion }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDescriptions_decorators, { kind: "method", name: "getDescriptions", static: false, private: false, access: { has: obj => "getDescriptions" in obj, get: obj => obj.getDescriptions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createUser_decorators, { kind: "method", name: "createUser", static: false, private: false, access: { has: obj => "createUser" in obj, get: obj => obj.createUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getImages_decorators, { kind: "method", name: "getImages", static: false, private: false, access: { has: obj => "getImages" in obj, get: obj => obj.getImages }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createImage_decorators, { kind: "method", name: "createImage", static: false, private: false, access: { has: obj => "createImage" in obj, get: obj => obj.createImage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteImage_decorators, { kind: "method", name: "deleteImage", static: false, private: false, access: { has: obj => "deleteImage" in obj, get: obj => obj.deleteImage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getFilename_decorators, { kind: "method", name: "getFilename", static: false, private: false, access: { has: obj => "getFilename" in obj, get: obj => obj.getFilename }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRatingNumber_decorators, { kind: "method", name: "getRatingNumber", static: false, private: false, access: { has: obj => "getRatingNumber" in obj, get: obj => obj.getRatingNumber }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createDataEntry_decorators, { kind: "method", name: "createDataEntry", static: false, private: false, access: { has: obj => "createDataEntry" in obj, get: obj => obj.createDataEntry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRating_decorators, { kind: "method", name: "getRating", static: false, private: false, access: { has: obj => "getRating" in obj, get: obj => obj.getRating }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateData_decorators, { kind: "method", name: "updateData", static: false, private: false, access: { has: obj => "updateData" in obj, get: obj => obj.updateData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDataset_decorators, { kind: "method", name: "getDataset", static: false, private: false, access: { has: obj => "getDataset" in obj, get: obj => obj.getDataset }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDatasetbyToken_decorators, { kind: "method", name: "getDatasetbyToken", static: false, private: false, access: { has: obj => "getDatasetbyToken" in obj, get: obj => obj.getDatasetbyToken }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteDataset_decorators, { kind: "method", name: "deleteDataset", static: false, private: false, access: { has: obj => "deleteDataset" in obj, get: obj => obj.deleteDataset }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = (0, router_1.getExpressRouter)(new Routes());
//# sourceMappingURL=routes.js.map