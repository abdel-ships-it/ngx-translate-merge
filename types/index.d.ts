export type TSupportedFileTypes = 'json';

export interface IConfiguration {
    i18nFilesPath: string;
    masterFileName: string;
    addMissing: boolean;
    /** Whether to remove redundant translation keys or not */
    removeRedundant: boolean;
    /** What type of translations there are */
    fileType: TSupportedFileTypes;
    /** Whether to overrwrite original files or not */
    overwrite: boolean;
}

export interface ITranslationDifference {
    /** Missing keys from master */
    missing: string[];
    /** Redundant keys in slaves, which are not present in master */
    redundant: string[];
}

export interface ITranslationFile {
    [translationKey: string]: string;
}