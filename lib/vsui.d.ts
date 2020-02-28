/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		GetString								-->		get string input. optionally regex match
 */
/** namespace for working with VSCode UI */
export declare namespace vsui {
    /** Simple info message. No callbacks. */
    function Info(msg: string): void;
    /** Simple info message. No callbacks. */
    function Error(msg: string): void;
    /** Simple info message. No callbacks. */
    function Warning(msg: string): void;
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
    /** Shows input box to user and recieves string input */
    function InputBox(): Promise<string>;
    /** Request a single folder */
    function PickFolder(): Promise<string>;
    /** Show quick pick and return selection.
     * Use doCompare for yes/no prompts etc.
     * @param arr array of options(strings)
     * @param doCompare whether to do a string check on result
     * @param compareTo string to match against(Makes regex internally)
     */
    function QuickPick(arr: string[], doCompare: boolean, compareTo?: string): Promise<string>;
}
//# sourceMappingURL=vsui.d.ts.map