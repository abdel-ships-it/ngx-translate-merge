import { IConfiguration, ITranslationDifference, ITranslationFile } from "../types";

export class TranslationsDifferenceHandler {

    handle(originalFiles: Map<string, ITranslationFile>, differencesMap: Map<string, ITranslationDifference>, configuration: IConfiguration): Map<string, ITranslationFile> {
        const newFiles = new Map<string, ITranslationFile>(originalFiles);

        const masterFileTranslations = originalFiles.get(configuration.masterFileName)!;

        for (const fileName of differencesMap.keys()) {
            if (differencesMap.get(fileName)!.missing.length || differencesMap.get(fileName)!.redundant.length) {
                const newFileValue = newFiles.get(fileName)!;
                if (differencesMap.get(fileName)!.redundant.length && configuration.removeRedundant) {
                    differencesMap.get(fileName)!.redundant.forEach(redundantKey => {
                        delete newFileValue[redundantKey];
                    });
                }

                if (differencesMap.get(fileName)!.missing.length && configuration.addMissing) {
                    differencesMap.get(fileName)!.missing.forEach(missingKey => { 
                        newFileValue[missingKey] = `${masterFileTranslations![missingKey]}`;
                    });
                }
                newFiles.set(fileName, newFileValue);
            }

        }

        return newFiles;
    }
}