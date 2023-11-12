"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dataset = exports.Image = exports.User = exports.WebSession = void 0;
const dataset_1 = __importDefault(require("./concepts/dataset"));
const image_1 = __importDefault(require("./concepts/image"));
const user_1 = __importDefault(require("./concepts/user"));
const websession_1 = __importDefault(require("./concepts/websession"));
// App Definition using concepts
exports.WebSession = new websession_1.default();
exports.User = new user_1.default();
exports.Image = new image_1.default();
exports.Dataset = new dataset_1.default();
//# sourceMappingURL=app.js.map