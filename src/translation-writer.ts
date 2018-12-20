import { FilesManager } from "./files-manager";
import { ITranslationFile, TSupportedFileTypes, IConfiguration } from "../types";

export class TranslationWriter {
    constructor(private filesManager: FilesManager) { }

    async write(filesMap: Map<string, ITranslationFile>, config: IConfiguration, fileType: TSupportedFileTypes) {
        let path = config.i18nFilesPath;

        if ( config.overwrite === false ) {
            path += '/fixed';
        }

        const pathExists = await this.filesManager.pathExists(path);

        if ( !pathExists ) {
            await this.filesManager.createDirectory(path);
        }

        if (fileType === 'json') {
            this.writeJSON(filesMap, path);
        }
    }

    private writeJSON(filesMap: Map<string, ITranslationFile>, path: string) {
        for( const [key, value] of filesMap.entries() ) {
            this.filesManager.writeFile(path + '/' + key, JSON.stringify(value, null, 2) );
        }
    }
}