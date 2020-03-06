import * as flags from "flags";
import { FilesManager } from "./files-manager";

/**
 * This class will be responsible for loading in the configuration for the tool
 * It will also check if the removeRedundant or addMissing flag was passed or not
 */
export class Configuration {
    private readonly configPath: string = process.cwd() + '/ngx-translate-merge.json';

    constructor(private filesManager: FilesManager) {
        
      }

    async getConfiguration() {
        if ( await this.filesManager.pathExists(this.configPath) ) {
            const configuration = await this.filesManager.loadConfiguration(this.configPath);

            flags.defineBoolean('addMissing', false, 'Adds missing translation keys');
            flags.defineBoolean('removeRedundant', false, 'Removes redundant translation keys');
            flags.defineBoolean('overwrite', false, 'Whether to overrwrite original files or not');
            flags.defineString('fileType', 'json', 'What type of translation files');

            flags.parse();

            if (flags.isSet('addMissing') ) {
                configuration.addMissing = flags.get('addMissing');
            }

            if ( flags.isSet('removeRedundant')) {
                configuration.removeRedundant = flags.get('removeRedundant');
            }

            if ( flags.isSet('overwrite') ) {
                configuration.overwrite = flags.get('overwrite');
            }
            
            configuration.fileType = flags.get('fileType');
            return configuration;
        } else {
            console.error('Error loading configuration');

            process.exit(1);
        }
    }
}