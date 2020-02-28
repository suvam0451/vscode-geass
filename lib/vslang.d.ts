/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		GetString								-->		get string input. optionally regex match
 */
/** namespace for working with VSCode UI */
export declare namespace vslang {
    /** Gets bracket begin and end for the current scope. Works with clike languages { go, c++, rust }
     * NOT IMPLEMENTED YET !!!
     */
    function GetScopeRange(line?: number): number[];
}
//# sourceMappingURL=vslang.d.ts.map