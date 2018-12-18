export interface IConfiguration {
    i18nFilesPath: string;
    masterFileName: string;
}

interface ITranslationFile {
    [lang: string]: string;
}
