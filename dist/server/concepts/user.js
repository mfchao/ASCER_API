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
            let question;
            let descriptions;
            if (category == "Sales") {
                question = "On a scale of 1 to 5, how likely do you think this tile product is to achieve success in the market, considering both immediate sales volume and long-term market presence?";
                descriptions = ["Very Unlikely", "Very Likely"];
            }
            else if (category == "Customer") {
                question =
                    "How would you rate the overall aesthetics and design of the tile product (on a scale of 1 to 5), considering the potential satisfaction of both traditional and trend-focused customer segments?";
                descriptions = ["Very UnAesthetic", "Very Aesthetic"];
            }
            else if (category == "Designer") {
                question = "On a scale of 1 to 5, how likely do you believe this tile product is to be a trend-setting product, influencing future design preferences in the US market?";
                descriptions = ["Very Unlikely", "Very Likely"];
            }
            else {
                question = "How trendy do you think this tile design is?";
                descriptions = ["Very UnTrendy", "Very Trendy"];
            }
            const _id = yield this.users.createOne({ category, token, question, descriptions });
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
    getQuestion(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.users.readOne({ category });
            if (user === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return user.question;
            }
        });
    }
    getDescriptions(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.users.readOne({ category });
            if (user === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return user.descriptions;
            }
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
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.users.deleteMany({});
            return { msg: "Users deleted!" };
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