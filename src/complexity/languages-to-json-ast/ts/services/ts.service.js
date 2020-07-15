"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ts = void 0;
const kind_aliases_1 = require("../const/kind-aliases");
const ts_morph_1 = require("ts-morph");
const chalk = require("chalk");
/**
 * Service for operations on Node elements (ts-morph nodes)
 */
class Ts {
    /**
     * Returns the SyntaxKind of an AST node or its alias if exists
     * @param node
     */
    static getKindAlias(node) {
        let kind = node.getKindName();
        for (const alias of kind_aliases_1.KindAliases) {
            if (alias.aliases.includes(kind)) {
                kind = alias.name;
                break;
            }
        }
        return kind;
    }
    /**
     * Gets the name of a Node
     * @param node // The AST node
     */
    static getName(node) {
        var _a, _b;
        switch (node.getKind()) {
            case ts_morph_1.SyntaxKind.ClassDeclaration:
            case ts_morph_1.SyntaxKind.FunctionDeclaration:
            case ts_morph_1.SyntaxKind.MethodDeclaration:
            case ts_morph_1.SyntaxKind.Parameter:
                return (_b = (_a = node.compilerNode['name']) === null || _a === void 0 ? void 0 : _a['escapedText']) !== null && _b !== void 0 ? _b : '';
            case ts_morph_1.SyntaxKind.Identifier:
                return node.compilerNode['escapedText'];
            default:
                return undefined;
        }
    }
    static getType(node) {
        var _a, _b, _c, _d, _e;
        if (Ts.getName(node) === 'tail') {
            const id = node;
            console.log(chalk.greenBright('TAILLL'), (_c = (_b = (_a = id.getDefinitions()) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.getSourceFile()) === null || _c === void 0 ? void 0 : _c.getFilePath());
        }
        if (!((_d = node.getSymbol()) === null || _d === void 0 ? void 0 : _d.getFlags())) {
            return undefined;
        }
        switch (node.getKind()) {
            case ts_morph_1.SyntaxKind.Identifier:
            case ts_morph_1.SyntaxKind.Parameter:
                return (_e = Ts.getIdentifierType(node.getType().getApparentType().getText())) !== null && _e !== void 0 ? _e : 'any';
            default:
                return undefined;
        }
    }
    static getIdentifierType(text) {
        switch (text) {
            case 'Any':
            case 'Boolean':
            case 'Number':
            case 'Object':
            case 'String':
                return text.toLowerCase();
            default:
                return text.match(/=>/) ? 'function' : undefined;
        }
    }
}
exports.Ts = Ts;
