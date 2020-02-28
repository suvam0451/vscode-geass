export declare namespace vscfg {
    /** Gets vs config
     * @param namespace namespace as set in package.json
     * @param key name as set in config.json
     * @returns typecasted config data
     */
    function GetVSConfig<T>(namespace: string, key: string): T;
    /** Gets vs config and updates it. Key must be a list of strings. Checks for duplicates.
     * @param namespace namespace as set in package.json
     * @param key name as set in config.json
     * @param vals string value to be inserted
     * @returns 0 if successful, 1 if unsuccessful
     */
    function AppendToVSConfig(namespace: string, key: string, vals: string[]): number;
}
//# sourceMappingURL=vscfg.d.ts.map