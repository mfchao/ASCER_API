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
    create(image, rating, category, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rating) {
                const alreadyRated = yield this.alreadyRated(image, token);
                if (alreadyRated) {
                    const existingEntry = yield this.dataset.readOne({ image, token });
                    if (existingEntry) {
                        yield this.dataset.updateOne({ _id: existingEntry._id }, { rating });
                        return { msg: "Rating updated successfully!", dataset: yield this.dataset.readOne({ _id: existingEntry._id }) };
                    }
                }
                else {
                    const _id = yield this.dataset.createOne({ image, rating, category, token });
                    return { msg: "Data entry created successfully!", dataset: yield this.dataset.readOne({ _id }) };
                }
            }
            else {
                throw new errors_1.BadValuesError("please submit a rating!");
            }
        });
    }
    alreadyRated(image, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readOne({ image, token });
            return entry !== null;
        });
    }
    getRatingbyID(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readMany({ image });
            if (entry === null) {
                throw new errors_1.NotFoundError(`token not found!`);
            }
            else {
                return entry;
            }
        });
    }
    getIDbyfile(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readOne({ image });
            if (entry === null) {
                throw new errors_1.NotFoundError(`token not found!`);
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
    getDatasetbyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataset = yield this.dataset.readMany({ token });
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
    getRatingNumber(image, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.dataset.readOne({ image, token });
            if (entry !== null) {
                return entry.rating;
            }
            else {
                return;
            }
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataset.deleteMany({});
            return { msg: "dataset deleted!" };
        });
    }
}
exports.default = DatasetConcept;
//# sourceMappingURL=dataset.js.map