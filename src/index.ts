#! /usr/bin/env node
import * as ora from "ora";
import { Analyzer } from "./analyzer";
import { FilesManager } from "./files-manager";
import { TranslationReader } from "./translation-reader";
import { Configuration } from "./configuration";
import { TranslationsDifferenceHandler } from "./translation-difference-handler";
import { TranslationWriter } from "./translation-writer";

if (process.env.NODE_ENV === 'development') {
    require('dotenv').load();
}

export class Main {
    filesManager = new FilesManager();

    translationReader = new TranslationReader();

    analyzer = new Analyzer();

    configuration = new Configuration(this.filesManager);

    translationsDifferenceHandler = new TranslationsDifferenceHandler();

    translationWriter = new TranslationWriter(this.filesManager);

    constructor() {
        this.init();
    }

    async init() {
        const spinner = ora().start();

        spinner.text = 'Analyzing differences...';
            
        const configuration = await this.configuration.getConfiguration();

        const translationFiles = await this.filesManager.getTranslationFiles(configuration!.i18nFilesPath, configuration!.fileType);

        const translationsMap = await this.translationReader.parse(translationFiles, configuration!.fileType);

        const differences = this.analyzer.getDifferences(configuration!.masterFileName, translationsMap!);

        const messages = this.analyzer.createFeedback(differences)!;

        this.analyzer.handleFeedback(messages, configuration!);
        
        if (  configuration!.addMissing || configuration!.removeRedundant ) {
            const fixedFilesMap = this.translationsDifferenceHandler.handle(
                translationsMap!,
                differences,
                configuration!
            );

            this.translationWriter.write(
                fixedFilesMap,
                configuration!,
                'json'
            );

            this.filesManager.writeFile(
                configuration!.i18nFilesPath + '/fixed/summary.txt', 
                messages.join('\n') 
            );
        }

        spinner.stop();
    }
}

// tslint:disable-next-line:no-unused-expression
new Main();
