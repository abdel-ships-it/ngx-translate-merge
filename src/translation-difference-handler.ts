import { ITranslationFile, ITranslationDifference } from "../types";

export class TranslationsDifferenceHandler {

    handle(originalFiles: Map<string, ITranslationFile>, differencesMap: Map<string, ITranslationDifference>, masterFileName: string): Map<string, ITranslationFile> {
        const newFiles = new Map<string, ITranslationFile>(originalFiles);

        const masterFileTranslations = originalFiles.get(masterFileName)!;

        for (const [fileName, value] of differencesMap.entries()) {
            if (differencesMap.get(fileName)!.missing.length || differencesMap.get(fileName)!.redundant.length) {
                const newFileValue = newFiles.get(fileName)!;
                if (differencesMap.get(fileName)!.redundant.length) {
                    differencesMap.get(fileName)!.redundant.forEach(redundantKey => {
                        delete newFileValue[redundantKey];
                    });
                }

                if (differencesMap.get(fileName)!.missing.length) {
                    differencesMap.get(fileName)!.missing.forEach(missingKey => { 
                        newFileValue[missingKey] = `⚠️ ${masterFileTranslations![missingKey]}`;
                    });
                }
                newFiles.set(fileName, newFileValue);
            }

        }

        return newFiles;
    }
}