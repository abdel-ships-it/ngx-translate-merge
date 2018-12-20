import { TSupportedFileTypes, ITranslationFile } from "../types/index";


/**
 * Will parse files in different ways, useful incase we want to support different formats in the future
 */
export class TranslationReader {
    async parse(translationFiles: Map<string, string>, fileType: TSupportedFileTypes ) {
        if ( fileType === 'json' ) {
            return await this.parseJSON(translationFiles);
        }
    }

    private async parseJSON(translationFiles: Map<string, string>): Promise<Map<string, ITranslationFile>> {
        const translationFileValues: Map<string, ITranslationFile> = new Map();

        for (const [translationFileName, unparsedFileValue] of translationFiles.entries() ) {

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
}