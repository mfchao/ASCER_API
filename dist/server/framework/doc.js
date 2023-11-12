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
const mongodb_1 = require("mongodb");
const db_1 = __importDefault(require("../db"));
class DocCollection {
    constructor(name) {
        this.name = name;
        if (DocCollection.collectionNames.has(name)) {
            throw new Error(`Collection '${name}' already exists!`);
        }
        this.collection = db_1.default.collection(name);
    }
    /**
     * This method removes "illegal" fields from an item
     * so the client cannot fake them.
     */
    sanitizeItem(item) {
        delete item._id;
        delete item.dateCreated;
        delete item.dateUpdated;
    }
    /**
     * This method fixes the _id field of a filter.
     * In case the _id is a string, it will be converted to an ObjectId.
     */
    sanitizeFilter(filter) {
        if (filter._id && typeof filter._id === "string" && mongodb_1.ObjectId.isValid(filter._id)) {
            filter._id = new mongodb_1.ObjectId(filter._id);
        }
    }
    /**
     * Add `item` to the collection. Returns the _id of the inserted document.
     */
    createOne(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeItem(item);
            item.dateCreated = new Date();
            item.dateUpdated = new Date();
            return (yield this.collection.insertOne(item)).insertedId;
        });
    }
    /**
     * Add `items` to the collection. Returns a record object of the form `{ <index>: <_id> }` for inserted documents.
     */
    createMany(items, options) {
        return __awaiter(this, void 0, void 0, function* () {
            items.forEach((item) => {
                this.sanitizeItem(item);
                item.dateCreated = new Date();
                item.dateUpdated = new Date();
            });
            return (yield this.collection.insertMany(items, options)).insertedIds;
        });
    }
    /**
     * Read the document that matches `filter`. Returns `null` if no document matches.
     */
    readOne(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            return yield this.collection.findOne(filter, options);
        });
    }
    /**
     * Read all documents that match `filter`.
     */
    readMany(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            return yield this.collection.find(filter, options).toArray();
        });
    }
    /**
     * Replace the document that matches `filter` with `item`.
     */
    replaceOne(filter, item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            this.sanitizeItem(item);
            return yield this.collection.replaceOne(filter, item, options);
        });
    }
    /**
     * Update the document that matches `filter` based on existing fields in `update`.
     */
    updateOne(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeItem(update);
            this.sanitizeFilter(filter);
            update.dateUpdated = new Date();
            return yield this.collection.updateOne(filter, { $set: update }, options);
        });
    }
    /**
     * Delete the document that matches `filter`.
     */
    deleteOne(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            return yield this.collection.deleteOne(filter, options);
        });
    }
    /**
     * Delete all documents that match `filter`.
     */
    deleteMany(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            return yield this.collection.deleteMany(filter, options);
        });
    }
    /**
     * Count all documents that match `filter`.
     */
    count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            return yield this.collection.countDocuments(filter, options);
        });
    }
    /**
     * Pop one document that matches `filter`.
     * This method is equivalent to calling `readOne` and `deleteOne`.
     */
    popOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeFilter(filter);
            const one = yield this.readOne(filter);
            if (one === null) {
                return null;
            }
            yield this.deleteOne({ _id: one._id });
            return one;
        });
    }
}
DocCollection.collectionNames = new Set();
exports.default = DocCollection;
//# sourceMappingURL=doc.js.map