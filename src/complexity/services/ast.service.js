"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var ts = require("typescript");
var file_service_1 = require("./file.service");
var Ast = /** @class */ (function () {
    function Ast() {
    }
    Ast.getSourceFile = function (path) {
        return ts.createSourceFile(file_service_1.getFilename(path), fs.readFileSync(path, 'utf-8'), ts.ScriptTarget.Latest);
    };
    Ast.getType = function (node) {
        return node ? ts.SyntaxKind[node.kind] : '';
    };
    Ast.getMethodName = function (node) {
        var _a, _b;
        if ((node === null || node === void 0 ? void 0 : node.kind) === ts.SyntaxKind.MethodDeclaration) {
            return (_b = (_a = node === null || node === void 0 ? void 0 : node['name']) === null || _a === void 0 ? void 0 : _a['escapedText']) !== null && _b !== void 0 ? _b : '';
        }
        else {
            return '';
        }
    };
    Ast.getPreviousNode = function (node, parentNode) {
        return node;
    };
    Ast.isBinary = function (node) {
        var _a;
        return (_a = (node === null || node === void 0 ? void 0 : node.kind) === ts.SyntaxKind.BinaryExpression) !== null && _a !== void 0 ? _a : false;
    };
    Ast.isLogicDoor = function (node) {
        var _a, _b, _c;
        return (_c = (((_a = node === null || node === void 0 ? void 0 : node['operatorToken']) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.AmpersandAmpersandToken
            || ((_b = node === null || node === void 0 ? void 0 : node['operatorToken']) === null || _b === void 0 ? void 0 : _b.kind) === ts.SyntaxKind.BarBarToken)) !== null && _c !== void 0 ? _c : false;
    };
    Ast.isOrTokenBetweenBinaries = function (node) {
        var _a, _b, _c, _d;
        return (_d = (((_a = node === null || node === void 0 ? void 0 : node['operatorToken']) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.BarBarToken
            && ((_b = node === null || node === void 0 ? void 0 : node['left']) === null || _b === void 0 ? void 0 : _b.kind) === ts.SyntaxKind.BinaryExpression
            && ((_c = node === null || node === void 0 ? void 0 : node['right']) === null || _c === void 0 ? void 0 : _c.kind) === ts.SyntaxKind.BinaryExpression)) !== null && _d !== void 0 ? _d : false;
    };
    Ast.isSameOperatorToken = function (firstNode, secondNode) {
        var _a, _b, _c;
        return (_c = ((_a = firstNode === null || firstNode === void 0 ? void 0 : firstNode['operatorToken']) === null || _a === void 0 ? void 0 : _a.kind) === ((_b = secondNode === null || secondNode === void 0 ? void 0 : secondNode['operatorToken']) === null || _b === void 0 ? void 0 : _b.kind)) !== null && _c !== void 0 ? _c : false;
    };
    return Ast;
}());
exports.Ast = Ast;