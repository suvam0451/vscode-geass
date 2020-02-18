export declare namespace vsed {
    /** Request user for a folder
     * 	@returns first folder selected if success
     * 	@returns reject("USER ABORT") if failure
     */
    function GetAFolder(): Promise<string>;
    /** Request user for a folder (sync)
     * 	@returns first folder selected if success
     * 	@returns empty string if failure
     */
    function GetAFolderSync(): void;
    /** Request user for string input
     * 	@param match also regex match (optional)
     * 	@returns input string if success
     * 	@returns reject("USER_ABORT") if failure(1)
     * 	@returns reject("NO_MATCH") if failure(2)
     */
    function GetString(match?: RegExp): Promise<string>;
    /** Request user for string input
     * 	@param match also regex match (optional)
     * 	@returns input string if success
     * 	@returns "" if failure(any)
     */
    function GetStringSync(match?: RegExp): string;
}
//# sourceMappingURL=vsed.d.ts.map