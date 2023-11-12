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
class DatasetConcept {
    constructor() {
        this.dataset = new doc_1.default("dataset");
    }
    create(image, rating, category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rating) {
                const _id = yield this.dataset.createOne({ image, rating, category });
                return { msg: "Data entry created successfully!", dataset: yield this.dataset.readOne({ _id }) };
            }
            else {
                throw new errors_1.NotFoundError(`Please enter a rating!`);
            }
        });
    }
    getRatingbyID(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readOne({ image });
            if (entry === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return entry === null || entry === void 0 ? void 0 : entry.rating;
            }
        });
    }
    getIDbyfile(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readOne({ image });
            if (entry === null) {
                throw new errors_1.NotFoundError(`User not found!`);
            }
            else {
                return entry === null || entry === void 0 ? void 0 : entry._id;
            }
        });
    }
    getDataset() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataset = yield this.dataset.readMany({});
            return dataset;
        });
    }
    update(_id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (update.rating !== undefined) {
                yield this.dataset.updateOne({ _id }, update);
                return { msg: "Entry updated successfully!" };
            }
        });
    }
}
exports.default = DatasetConcept;
//# sourceMappingURL=dataset.js.map