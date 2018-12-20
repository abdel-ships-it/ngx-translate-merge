import * as pluralize from 'pluralize';
import { ITranslationDifference, ITranslationFile } from '../types';

export class Analyzer {

    /** Gets the differences between all the translation files and the master file */
    public getDifferences(masterFileName: string, translations: Map<string, any>): Map<string, ITranslationDifference> {
        const masterFileValue = translations.get(masterFileName);

        const differences: Map<string, ITranslationDifference> = new Map();

        translations.forEach((fileValue, fileKey) => {
            if (fileKey != masterFileName) {
                const difference = this.getDifference(
                    Object.keys(masterFileValue!),
                    Object.keys(fileValue),
                );
                
                differences.set(fileKey, difference);
            }
        });

        return differences;
    }

    public logDifferences(
        differences: Map<string, ITranslationDifference>,
        fixFlagOn: boolean
    ) {

        let message: string[] = [];

        /** We want to be positive here! So we will show the good news first */
        const positivelySortedDifferences = Array.from(differences.entries()).sort((a, b) => {
            if ( a[1].missing > b[1].missing ) {
                return -1;
            } else {
                return 1;
            }
        });

        new Map(positivelySortedDifferences).forEach((fileValue, fileKey) => {
            let toAppendMessage = '';

            const missingLength = fileValue.missing.length;
            const redundantLength = fileValue.redundant.length;

            if ( missingLength ) {
                toAppendMessage = `⚠️ '${fileKey}' has ${missingLength} missing ${pluralize('keys', missingLength)}`;
            } 
            if ( redundantLength ) {
                toAppendMessage = `⚠️ '${fileKey}' has ${redundantLength} redundant ${pluralize('keys', redundantLength)}`;
            }
            if ( redundantLength && missingLength ) {
                toAppendMessage = [
                    `⚠️ '${fileKey}' has ${redundantLength} redundant ${pluralize('keys', redundantLength)} `,
                    `and has ${missingLength} missing ${pluralize('keys', missingLength)}`
                ].join('');
            }

            if ( redundantLength == 0 && missingLength == 0 ) {
                toAppendMessage = `🎉 '${fileKey}' matches the master file` 
            }

            message.push(toAppendMessage);
        });
        
        console.log(message.join('\n'));


        if (fixFlagOn === false) {
            console.log('\x1b[32m%s\x1b[0m', `To fix this, run the command with the --autofix flag or add autofix to true in the configuration file`);
        }
    }


    /** Returns an array of strings which represent the keys that are missing in the slave file */
    private getDifference(masterKeys: string[], slaveKeys: string[]): ITranslationDifference {
        const difference: ITranslationDifference = {
            missing: [],
            redundant: []
        }

        const masterSet = new Set(masterKeys);

        const slaveSet = new Set(slaveKeys);

        difference.missing = [...masterSet].filter(x => !slaveSet.has(x));

        difference.redundant = [...slaveSet].filter( x => !masterSet.has(x));

        return difference;
    } 
}