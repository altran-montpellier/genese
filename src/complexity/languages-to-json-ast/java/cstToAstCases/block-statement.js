"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const cstToAst_1 = require("../cstToAst");
// @ts-ignore
function run(cstNode, children) {
    var _a, _b;
    return (_b = (_a = children.statement) === null || _a === void 0 ? void 0 : _a.map(e => cstToAst_1.cstToAst(e))) !== null && _b !== void 0 ? _b : [];
}
exports.run = run;