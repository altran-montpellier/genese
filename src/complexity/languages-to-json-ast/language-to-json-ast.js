"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageToJsonAst = exports.project = exports.WEIGHTS = exports.DEV_MOCK = exports.LIMIT_CONVERSIONS = void 0;
const init_conversion_service_1 = require("./ts/services/init-conversion.service");
const language_enum_1 = require("../core/enum/language.enum");
const chalk = require("chalk");
const json_service_1 = require("./json.service");
const file_service_1 = require("../core/services/file.service");
const ts_morph_1 = require("ts-morph");
const weights_service_1 = require("./ts/libraries-weights/weights.service");
exports.LIMIT_CONVERSIONS = false;
exports.DEV_MOCK = '/Users/utilisateur/Documents/perso_gilles_fabre/projets/genese/genese/src/complexity/core/mocks/debug.mock.ts';
exports.WEIGHTS = weights_service_1.WeightsService.merge();
exports.project = new ts_morph_1.Project();
/**
 * Main process of the parsing to JsonAst format
 */
class LanguageToJsonAst {
    /**
     * Starts the parsing to Json Ast format
     * @param pathToAnalyze         // The path of the folder to analyse
     * @param language              // The language to parse and convert into JsonAst
     */
    static start(pathToAnalyze, language) {
        console.log(chalk.blueBright('STARTS JSON AST GENERATION'));
        exports.project.addSourceFilesAtPaths(`${pathToAnalyze}/**/*{.d.ts,.ts}`);
        exports.project.addSourceFilesAtPaths(`${pathToAnalyze}/**/*.js`);
        // console.log('PROJECT ADD SRCCC', `${pathToAnalyze}/**/*{.d.ts,.ts}`)
        const zzz = exports.project.getSourceFiles().map(f => f.getFilePath());
        // console.log('PROJECTT FILE', zzz);
        let jsonAst;
        switch (language) {
            case language_enum_1.Language.TS:
                jsonAst = LanguageToJsonAst.generateFromTsFiles(pathToAnalyze);
                break;
            default:
                jsonAst = LanguageToJsonAst.generateFromAllFiles(pathToAnalyze);
                break;
        }
        file_service_1.createFile(`./json-ast.json`, json_service_1.JsonService.prettifyJson(jsonAst));
        console.log(chalk.greenBright('JSON AST GENERATED SUCCESSFULLY'));
    }
    // TODO: implement for all languages
    static generateFromAllFiles(pathToAnalyze) {
        return LanguageToJsonAst.generateFromTsFiles(pathToAnalyze);
    }
    static generateFromTsFiles(pathToAnalyze) {
        const jsonAst = {
            astFolder: undefined
        };
        // const jsonAst = new JsonAst();
        const initService = new init_conversion_service_1.InitConversionService();
        let astFolder = initService.generateAll(pathToAnalyze).astFolder;
        astFolder = json_service_1.JsonService.astPropertyNames(astFolder);
        jsonAst.astFolder = astFolder;
        return jsonAst;
    }
}
exports.LanguageToJsonAst = LanguageToJsonAst;
