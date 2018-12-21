import * as flags from "flags";
import { FilesManager } from "./files-manager";

/**
 * This class will be responsible for loading in the configuration for the tool
 * It will also check if the autofix flag was passed or not
 */
export class Configuration {
    private readonly configPath: string = process.cwd() + '/i18n-config.json';

    constructor(private filesManager: FilesManager) {
        
      }

    async getConfiguration() {
        if ( await this.filesManager.pathExists(this.configPath) ) {
            const configuration = await this.filesManager.loadConfiguration(this.configPath);

            flags.defineBoolean('autofix', false, 'Auto fixes translation files');
            flags.defineBoolean('overwrite', false, 'Whether to overrwrite original files or not');
            flags.defineString('fileType', 'json', 'What type of translation files');

            flags.parse();

            if ( flags.isSet('autofix') ) {
                configuration.autoFix = flags.get('autofix');
            }
            if ( flags.isSet('overwrite') ) {
                configuration.autoFix = flags.get('overwrite');
            }
            
            configuration.fileType = flags.get('fileType');
            return configuration;
        } else {
            console.error('Error loading configuration');

            process.exit(1);
        }
    }
}