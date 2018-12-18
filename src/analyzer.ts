import { ITranslationFile } from "./types";

interface ITranslationFeedback {

}


export class Analyzer {

    /** Gets the differences between all the translation files and the master file */
    public getDifferences(masterFileName: string, translations: Map<string, ITranslationFile>) {
        const masterFileValue = translations.get(masterFileName);
        translations.forEach((fileValue, fileKey) => {
            if (fileKey != masterFileName) {
                this.getDifference(
                    Object.keys(masterFileValue!),
                    Object.keys(fileValue),
                );
            }
        });
    }

    private getDifference(a: string[], b: string[]) {
        console.log(a);
        console.log(b);
    } 
}