declare module 'flags' {
    function defineString(name: string, defaultValue: string, description: string): string;
    function defineStringList(name: string, defaultValue: string[], description: string): string;
    function defineMultiString(name: string, defaultValue: string[], description: string): string;
    function defineInteger(name: string, defaultValue: number, description: string): number;
    function defineNumber(name: string, defaultValue: number, description: string): number;
    function defineBoolean(name: string, defaultValue: boolean, description: string): number;

    /** Parse the passed in flags */
    function parse(): void;

    function get<T = any>(name: string): T;

    function help(): void;

    function isSet(name: string): boolean;

    function reset(): void;

    export let usageInfo: string;

    export let exitOnError: boolean;

    export let FLAGS: any;
}

