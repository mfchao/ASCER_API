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
class ImageConcept {
    constructor() {
        this.images = new doc_1.default("images");
    }
    create(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield this.images.createOne({ file });
            return { msg: "User created successfully!", user: yield this.images.readOne({ _id }) };
        });
    }
    getImageById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ _id });
            if (image === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
        });
    }
    getImageByFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ file });
            if (image === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return image._id;
            }
        });
    }
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.images.readMany({});
            return users;
        });
    }
    delete(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ file });
            if (!image) {
                throw new errors_1.NotFoundError(`Image not found!`);
            }
            yield this.images.deleteOne({ file });
            return { msg: "Image deleted!" };
        });
    }
}
exports.default = ImageConcept;
//# sourceMappingURL=image.js.map