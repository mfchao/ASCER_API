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
    create(filename, link) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filename && link) {
                const _id = yield this.images.createOne({ filename, link });
                return { msg: "Image created successfully!", user: yield this.images.readOne({ _id }) };
            }
            else {
                throw new errors_1.NotFoundError("Filename and Link are required");
            }
        });
    }
    getImageById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ _id });
            if (image === null) {
                throw new errors_1.NotFoundError(`Image not found!`);
            }
        });
    }
    getImageByFilename(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ filename });
            if (image === null) {
                throw new errors_1.NotFoundError(`Image not found!`);
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
    getFilename(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ _id });
            if (image === null) {
                throw new errors_1.NotFoundError(`Image not found!`);
            }
            else {
                return image.filename;
            }
        });
    }
    delete(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield this.images.readOne({ filename });
            if (!image) {
                throw new errors_1.NotFoundError(`Image not found!`);
            }
            yield this.images.deleteOne({ filename });
            return { msg: "Image deleted!" };
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.images.deleteMany({});
            return { msg: "Images deleted!" };
        });
    }
}
exports.default = ImageConcept;
//# sourceMappingURL=image.js.map