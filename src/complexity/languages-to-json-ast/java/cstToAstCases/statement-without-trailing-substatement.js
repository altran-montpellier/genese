"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const cstToAst_1 = require("../cstToAst");
// @ts-ignore
function run(cstNode, children) {
    var _a, _b, _c, _d;
    return [
        ...(_b = (_a = children.block) === null || _a === void 0 ? void 0 : _a.map(e => cstToAst_1.cstToAst(e))) !== null && _b !== void 0 ? _b : [],
        ...(_d = (_c = children.returnStatement) === null || _c === void 0 ? void 0 : _c.map(e => cstToAst_1.cstToAst(e))) !== null && _d !== void 0 ? _d : []
    ];
}
exports.run = run;