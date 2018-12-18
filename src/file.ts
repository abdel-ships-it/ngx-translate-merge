import { IConfiguration, ITranslationFile } from "./types";
import * as fs from 'async-file';
import * as difference from 'lodash.difference';

export class File {
    private filePattern = /.*.json/;

    constructor() {

    }

    public async loadConfiguration(): Promise<IConfiguration> {
        const configPromise = fs.readFile(process.cwd() + '/i18n-config.json', {
            encoding: 'utf8'
        });;

        const config = await configPromise;

        const parsedConfig = JSON.parse(config);

        return parsedConfig;
    }

    public async verifyPath(i18nFilesPath: string): Promise<boolean> {
        return fs.exists(i18nFilesPath);
    }

    public async getTranslationFilesValues(i18nFilesPath: string): Promise<Map<string, ITranslationFile>> {
        const translationFiles = await this.getTranslationFiles(i18nFilesPath);

        const translationFileValues: Map<string, ITranslationFile> = new Map();

        for ( const translationFileName in translationFiles ) {
            const unparsedFileValue = translationFiles[translationFileName];

            try {
                const parsedValue = JSON.parse(unparsedFileValue);
                
                translationFileValues.set(translationFileName, parsedValue);
            } catch (e) {
                console.error(`Error parsing ${translationFileName}: `, e);

                // process.exit(1);
            }
        }

        return translationFileValues;
    }

    
        
    /** 
     * Returns a map of the translation files
     * where the key is the language name and the value is the files value **unparsed**
     */
    private async getTranslationFiles(i18nFilesPath: string): Promise<ITranslationFile> {
        const path = './' + i18nFilesPath;

        const dir = await fs.readdir(path);

        const matchingFiles = dir.filter( fileName => this.filePattern.test(fileName) );

        const readPromises: Promise<string>[] = matchingFiles.map(fileName => {
            const readPromise: Promise<string> = fs.readFile(path + '/' + fileName, {
                encoding: 'utf8'
            });

            return readPromise;
        });

        const translationFiles: ITranslationFile = {}

        for ( const [index, readPromise] of readPromises.entries() ) {

            try {
                const translationFileValue = await readPromise;

                const fileName = matchingFiles[index];

                translationFiles[fileName] = translationFileValue;
            } catch ( e ) {
                console.error('Error reading file', e);
            }
        }

        return translationFiles;
    }
}