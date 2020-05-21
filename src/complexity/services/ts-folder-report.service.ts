import * as fs from 'fs-extra';
import * as eol from "eol";
import * as Handlebars from "handlebars";
import { TreeFolder } from '../models/tree-folder.model';
import { Options } from '../models/options';
import { RowFolderReport } from '../models/row-folder-report.model';
import { RowFileReport } from '../models/row-file-report.model';
import { createRelativeDir, getFilenameWithoutExtension, getRouteToRoot } from './file.service';
import { TreeFile } from '../models/tree-file.model';
import { MethodReport } from '../models/method-report.model';
import { TreeFolderService } from './tree-folder.service';


export class TsFolderReportService {

    private filesArray: RowFileReport[] = [];
    private foldersArray: RowFolderReport[] = [];
    private isRootFolder = false;
    private methodsArray: RowFileReport[] = [];
    private relativeRootReports = '';
    template: HandlebarsTemplateDelegate;
    treeFolder: TreeFolder = undefined;
    treeFolderService: TreeFolderService;


    constructor(tsFolder: TreeFolder) {
        this.treeFolder = tsFolder;
        this.treeFolderService = new TreeFolderService(this.treeFolder);
    }


    getFoldersArray(tsFolder: TreeFolder): RowFolderReport[] {
        let report: RowFolderReport[] = [];
        if (this.treeFolder.path !== Options.pathFolderToAnalyze) {
            report.push(this.addRowBackToPreviousFolder());
        }
        return report.concat(this.getSubfoldersArray(tsFolder));
    }


    getSubfoldersArray(tsFolder: TreeFolder, isSubfolder = false): RowFolderReport[] {
        let report: RowFolderReport[] = [];
        for (const subfolder of tsFolder.subFolders) {
            const subfolderReport: RowFolderReport = {
                complexitiesByStatus: subfolder.getStats().numberOfMethodsByStatus,
                numberOfFiles: subfolder.getStats().numberOfFiles,
                numberOfMethods: subfolder.getStats().numberOfMethods,
                path: subfolder.relativePath,
                routeFromCurrentFolder: this.treeFolderService.getRouteFromFolderToSubFolder(this.treeFolder, subfolder)
            };
            report.push(subfolderReport);
            if (!isSubfolder) {
                report = report.concat(this.getSubfoldersArray(subfolder, true));
            }
        }
        return report;
    }


    addRowBackToPreviousFolder(): RowFolderReport {
        return {
            complexitiesByStatus: undefined,
            numberOfFiles: undefined,
            numberOfMethods: undefined,
            path: '../',
            routeFromCurrentFolder: '..'

        };
    }


    getFilesArray(tsFolder: TreeFolder): RowFileReport[] {
        let report: RowFileReport[] = [];
        for (const tsFile of tsFolder.treeFiles) {
            for (const treeMethod of tsFile.treeMethods) {
                report.push({
                    cognitiveColor: treeMethod.cognitiveStatus.toLowerCase(),
                    cognitiveValue: treeMethod.cognitiveValue,
                    cyclomaticColor: treeMethod.cyclomaticStatus.toLowerCase(),
                    cyclomaticValue: treeMethod.cyclomaticValue,
                    filename: tsFile.name,
                    linkFile: this.getFileLink(tsFile),
                    methodName: treeMethod.name
                })
            }
        }
        return report;
    }


    getMethodsArraySortedByDecreasingCognitiveCpx(tsFolder: TreeFolder): RowFileReport[] {
        const report = this.getMethodsArray(tsFolder);
        return this.sortByDecreasingCognitiveCpx(report);
    }


    getMethodsArray(tsFolder: TreeFolder): RowFileReport[] {
        let report: RowFileReport[] = [];
        for (const subfolder of tsFolder.subFolders) {
            for (const tsFile of subfolder.treeFiles) {
                for (const treeMethod of tsFile.treeMethods) {
                    report.push({
                        cognitiveColor: treeMethod.cognitiveStatus.toLowerCase(),
                        cognitiveValue: treeMethod.cognitiveValue,
                        cyclomaticColor: treeMethod.cyclomaticStatus.toLowerCase(),
                        cyclomaticValue: treeMethod.cyclomaticValue,
                        filename: tsFile.name,
                        linkFile: this.getFileLink(tsFile),
                        methodName: treeMethod.name
                    })
                }
            }
            report = report.concat(this.getMethodsArray(subfolder));
        }
        return report;
    }


    sortByDecreasingCognitiveCpx(methodsReport: MethodReport[]): MethodReport[] {
        return methodsReport.sort((a, b) => b.cognitiveValue - a.cognitiveValue);
    }


    getFileLink(tsFile: TreeFile): string {
        if (this.treeFolder.relativePath === tsFile.treeFolder?.relativePath) {
            return `./${getFilenameWithoutExtension(tsFile.name)}.html`;
        }
        const route = this.treeFolderService.getRouteFromFolderToFile(this.treeFolder, tsFile);
        return `${route}/${getFilenameWithoutExtension(tsFile.name)}.html`;
    }


    generateReport(): void {
        const parentFolder: TreeFolder = new TreeFolder();
        parentFolder.subFolders.push(this.treeFolder);
        this.relativeRootReports = getRouteToRoot(this.treeFolder.relativePath);
        this.filesArray = this.getFilesArray(this.treeFolder);
        this.foldersArray = this.getFoldersArray(parentFolder);
        this.methodsArray = this.getMethodsArraySortedByDecreasingCognitiveCpx(parentFolder);
        this.registerPartial("cognitiveBarchartScript", 'cognitive-barchart');
        this.registerPartial("cyclomaticBarchartScript", 'cyclomatic-barchart');
        this.registerPartial("cognitiveDoughnutScript", 'cognitive-doughnut');
        this.registerPartial("cyclomaticDoughnutScript", 'cyclomatic-doughnut');
        this.registerPartial("rowFolder", 'row-folders');
        this.registerPartial("rowFile", 'row-files');
        const reportTemplate = eol.auto(fs.readFileSync(`${Options.pathGeneseNodeJs}/src/complexity/templates/handlebars/folder-report.handlebars`, 'utf-8'));
        this.template = Handlebars.compile(reportTemplate);
        this.writeReport();
    }


    private writeReport() {
        const template = this.template({
            colors: Options.colors,
            filesArray: this.filesArray,
            foldersArray: this.foldersArray,
            isRootFolder: this.isRootFolder,
            methodsArray: this.methodsArray,
            relativeRootReports: this.relativeRootReports,
            stats: this.treeFolder.getStats(),
            thresholds: Options.getThresholds()
        });
        if (this.treeFolder.relativePath) {
            createRelativeDir(this.treeFolder.relativePath);
        }
        const pathReport = `${Options.pathOutDir}/${this.treeFolder.relativePath}/folder-report.html`;
        fs.writeFileSync(pathReport, template, {encoding: 'utf-8'});
    }


    private registerPartial(partialName: string, filename: string): void {
        const partial = eol.auto(fs.readFileSync(`${Options.pathGeneseNodeJs}/src/complexity/templates/handlebars/${filename}.handlebars`, 'utf-8'));
        Handlebars.registerPartial(partialName, partial);
    }
}
