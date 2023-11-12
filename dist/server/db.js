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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = exports.DB_NAME = exports.client = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.MONGO_SRV;
if (!mongoUri) {
    throw new Error("Please add the MongoDB connection SRV as 'MONGO_SRV'");
}
exports.client = new mongodb_1.MongoClient(mongoUri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
exports.DB_NAME = "conception-db"; // Feel free to change db name!
/**
 * Attempts to complete the connection to {@link client}.
 * Called in `main.ts`.
 */
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
        }
        catch (e) {
            throw new Error("MongoDB Connection failed: " + e);
        }
        yield exports.client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    });
}
exports.connectDb = connectDb;
const db = exports.client.db(exports.DB_NAME);
exports.default = db;
//# sourceMappingURL=db.js.map