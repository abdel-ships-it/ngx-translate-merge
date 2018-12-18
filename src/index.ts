#! /usr/bin/env node

import { IConfiguration } from "./types";
import { File } from "./file";
import * as http from 'http';
import { Analyzer } from "./analyzer";

if (process.env.NODE_ENV === 'development') {
    require('dotenv').load();
}

export class Main {
    public files = new File();

    public analyzer = new Analyzer();

    public configuration!: IConfiguration;

    constructor() {
        this.init();
    }

    async init() {
        this.configuration = await this.files.loadConfiguration();

        const translationsMap = await this.files.getTranslationFilesValues(this.configuration.i18nFilesPath);

        console.log(translationsMap);

        this.analyzer.getDifferences(this.configuration.masterFileName, translationsMap);
        
    }
}

new Main();
