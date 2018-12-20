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
    public filesManager = new FilesManager();

    public translationReader = new TranslationReader();

    public analyzer = new Analyzer();

    public configuration = new Configuration(this.filesManager);

    public translationsDifferenceHandler = new TranslationsDifferenceHandler();

    public translationWriter = new TranslationWriter(this.filesManager);

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

        this.analyzer.logDifferences(differences, configuration!.autoFix);

        if (  configuration!.autoFix ) {
            const fixedFilesMap = this.translationsDifferenceHandler.handle(translationsMap!, differences);

            this.translationWriter.write(
                fixedFilesMap,
                configuration!,
                'json'
            );
        }

        spinner.stop();
    }
}

new Main();
