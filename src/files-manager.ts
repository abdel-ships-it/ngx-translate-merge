import { IConfiguration, TSupportedFileTypes } from "../types/index";
import * as fs from 'async-file';

export class FilesManager {
    async loadConfiguration(configPath: string): Promise<IConfiguration> {
        const configPromise = fs.readFile(configPath, {
            encoding: 'utf8'
        });

        const config = await configPromise;

        const parsedConfig = JSON.parse(config);

        return parsedConfig;
    }

    async pathExists(i18nFilesPath: string): Promise<boolean> {
        return fs.exists(i18nFilesPath);
    }    
        
    /** 
     * Returns a map of the translation files
     * where the key is the language name and the value is the files value **unparsed**
     */
    async getTranslationFiles(i18nFilesPath: string, fileType: TSupportedFileTypes): Promise<Map<string, string>> {
        const filePattern = new RegExp(`.*.${fileType}`);

        const path = './' + i18nFilesPath;

        const dir = await fs.readdir(path);

        const matchingFiles = dir.filter( fileName => filePattern.test(fileName) );

        const readPromises: Array<Promise<string>> = matchingFiles.map(fileName => {
            const readPromise: Promise<string> = fs.readFile(path + '/' + fileName, {
                encoding: 'utf8'
            });

            return readPromise;
        });

        const translationFiles: Map<string, string> = new Map<string, string>();

        for ( const [index, readPromise] of readPromises.entries() ) {

            try {
                const translationFileValue = await readPromise;

                const fileName = matchingFiles[index];

                translationFiles.set(fileName, translationFileValue);
            } catch ( e ) {
                console.error('Error reading file', e);
            }
        }

        return translationFiles;
    }

    writeFile(filePath: string, data: string) {
        return fs.writeFile(filePath, data, { encoding: 'utf8' });
    }

    createDirectory(path: string) {
        return fs.createDirectory(path);
    }
}