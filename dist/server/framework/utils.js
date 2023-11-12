"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamNames = void 0;
function getParamNames(f) {
    return f
        .toString()
        .match(/\((.*?)\)/)[1]
        .split(",") // Simple regex to get "name: type" items in signature
        .map((param) => param.split("=")[0].trim()); // remove whitespaces
}
exports.getParamNames = getParamNames;
//# sourceMappingURL=utils.js.map