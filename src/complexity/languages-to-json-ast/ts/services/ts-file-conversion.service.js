"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsFileConversionService = void 0;
const file_service_1 = require("../../../core/services/file.service");
const ts_service_1 = require("./ts.service");
const language_to_json_ast_1 = require("../../language-to-json-ast");
const syntax_kind_enum_1 = require("../../../core/enum/syntax-kind.enum");
const chalk = require("chalk");
/**
 * - TsFiles generation from their Abstract Syntax Tree (AST)
 */
class TsFileConversionService {
    /**
     * Generates the TsFile corresponding to a given path and a given TsFolder
     * @param path          // The path of the file
     * @param astFolder     // The TsFolder containing the TsFile
     */
    generateTsFile(path, astFolder) {
        if (!path || !astFolder) {
            console.warn('No path or TsFolder : impossible to create TsFile');
            return undefined;
        }
        const sourceFile = language_to_json_ast_1.project.getSourceFileOrThrow(path);
        return {
            name: file_service_1.getFilename(path),
            text: sourceFile.getFullText(),
            astNode: this.createAstNodeChildren(sourceFile)
        };
    }
    /**
     * Returns the Node children of a given Node
     * @param node      // The Node to analyse
     */
    createAstNodeChildren(node) {
        const children = [];
        node.forEachChild((childNode) => {
            children.push(this.createAstNodeChildren(childNode));
        });
        const astNode = {
            end: node.getEnd(),
            kind: ts_service_1.Ts.getKindAlias(node),
            name: ts_service_1.Ts.getName(node),
            pos: node.getPos(),
            start: node.getStart()
        };
        if (ts_service_1.Ts.getType(node)) {
            astNode.type = ts_service_1.Ts.getType(node);
        }
        if (children.length > 0) {
            astNode.children = children;
        }
        if (astNode.type === 'function') {
            const cpxFactors = this.getCpxFactors(node);
            console.log('CPX FACTORSSS', cpxFactors);
        }
        return astNode;
    }
    getCpxFactors(node) {
        var _a;
        if (node.getKindName() !== syntax_kind_enum_1.SyntaxKind.Identifier) {
            return undefined;
        }
        const identifier = node;
        const definition = (_a = identifier.getDefinitions()) === null || _a === void 0 ? void 0 : _a[0];
        if (!definition) {
            return undefined;
        }
        console.log(chalk.yellowBright('IDENTIFIER IMPLEMENTATTTSS'), node.getKindName(), ts_service_1.Ts.getName(node), definition.getSourceFile().getFilePath());
        // const debugFile = project.getSourceFileOrThrow('debug.mock.ts');
        // console.log('DEBUG FILE', debugFile)
        // const classDeclaration = debugFile.getClasses()[0];
        // // console.log('CLASS FILE', classDeclaration)
        // const referencedSymbols = classDeclaration.findReferences();
        //
        // for (const referencedSymbol of referencedSymbols) {
        //     for (const reference of referencedSymbol.getReferences()) {
        //         console.log("---------")
        //         console.log("REFERENCE")
        //         console.log("---------")
        //         console.log("File path: " + reference.getSourceFile().getFilePath());
        //         console.log("Start: " + reference.getTextSpan().getStart());
        //         console.log("Length: " + reference.getTextSpan().getLength());
        //         console.log("Parent kind: " + reference.getNode().getParentOrThrow().getKindName());
        //         console.log("\n");
        //     }
        // }
        // const ref = classDeclaration.getMethodOrThrow('ref');
        // console.log('METHOD  REF ', ref.getName())
        // const desc  = ref.getDescendantsOfKind(SyntaxKind.Identifier);
        // for (const d of desc) {
        //     console.log(chalk.blueBright('IDENTIFIER', d.getText()), d.getType().getText());
        //     const def = d.getImplementations()[0];
        //     console.log(chalk.yellowBright('IDENTIFIER DEFS'), def?.getTextSpan());
        // }
        const cpxFactors = undefined;
        // const references = node.findReferences();
        return cpxFactors;
    }
}
exports.TsFileConversionService = TsFileConversionService;
