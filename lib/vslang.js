"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		GetString								-->		get string input. optionally regex match
 */
/** namespace for working with VSCode UI */
var vslang;
(function (vslang) {
    /** Gets bracket begin and end for the current scope. Works with clike languages { go, c++, rust }
     * NOT IMPLEMENTED YET !!!
     */
    function GetScopeRange(line) {
        return [];
    }
    vslang.GetScopeRange = GetScopeRange;
})(vslang = exports.vslang || (exports.vslang = {}));
//# sourceMappingURL=vslang.js.map