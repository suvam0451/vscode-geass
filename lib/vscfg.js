"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
var vscfg;
(function (vscfg) {
    /** Gets vs config
     * @param namespace namespace as set in package.json
     * @param key name as set in config.json
     * @returns typecasted config data
     */
    function GetVSConfig(namespace, key) {
        let config = vscode_1.default.workspace.getConfiguration(namespace);
        let retval = config.get(key);
        return retval;
    }
    vscfg.GetVSConfig = GetVSConfig;
    /** Gets vs config and updates it. Key must be a list of strings. Checks for duplicates.
     * @param namespace namespace as set in package.json
     * @param key name as set in config.json
     * @param vals string value to be inserted
     * @returns 0 if successful, 1 if unsuccessful
     */
    function AppendToVSConfig(namespace, key, vals) {
        let config = vscode_1.default.workspace.getConfiguration(namespace);
        let retval = config.get(key);
        if (retval === undefined) {
            return 1;
        }
        // Otherwise add and update
        retval.push(...vals);
        config.update(key, retval, undefined);
        return 0;
    }
    vscfg.AppendToVSConfig = AppendToVSConfig;
})(vscfg = exports.vscfg || (exports.vscfg = {}));
//# sourceMappingURL=vscfg.js.map