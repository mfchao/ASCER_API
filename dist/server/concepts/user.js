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
const doc_1 = __importDefault(require("../framework/doc"));
const errors_1 = require("./errors");
class UserConcept {
    constructor() {
        this.users = new doc_1.default("users");
    }
    create(category, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.canCreate(category, token);
            const _id = yield this.users.createOne({ category, token });
            return { msg: "User created successfully!", user: yield this.users.readOne({ _id }) };
        });
    }
    getUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.users.readOne({ _id });
            if (user === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
        });
    }
    getUserByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.users.readOne({ token });
        });
    }
    getCategory(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.users.readOne({ _id });
            if (user === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return user.category;
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.users.readMany({});
            return users;
        });
    }
    canCreate(category, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!category && !token) {
                throw new errors_1.BadValuesError("Category and token must be non-empty!");
            }
        });
    }
}
exports.default = UserConcept;
//# sourceMappingURL=user.js.map