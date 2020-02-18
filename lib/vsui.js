"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
var vsui;
(function (vsui) {
    /** Request user for a folder
     * 	@returns first folder selected if success
     * 	@returns reject("USER ABORT") if failure
     */
    function GetAFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            let opt = {};
            opt.canSelectFiles = false;
            opt.canSelectFolders = true;
            return new Promise((resolve, reject) => {
                vscode_1.default.window.showOpenDialog(opt).then(success => {
                    resolve(success[0].fsPath);
                }, () => {
                    reject("SELECTION_EMPTY");
                });
            });
        });
    }
    vsui.GetAFolder = GetAFolder;
    /** Request user for a folder (sync)
     * 	@returns first folder selected if success
     * 	@returns empty string if failure
     */
    function GetAFolderSync() {
        let opt = {};
        opt.canSelectFiles = false;
        opt.canSelectFolders = true;
        vscode_1.default.window.showOpenDialog(opt).then(success => {
            return success[0].fsPath;
        }, () => {
            return "";
        });
    }
    vsui.GetAFolderSync = GetAFolderSync;
    /** Request user for string input
     * 	@param match also regex match (optional)
     * 	@returns input string if success
     * 	@returns reject("USER_ABORT") if failure(1)
     * 	@returns reject("NO_MATCH") if failure(2)
     */
    function GetString(match) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const input = vscode_1.default.window.showInputBox(); // request classname as string
                input.then(value => {
                    if (value !== undefined) {
                        if (match !== undefined) {
                            if (match.test(value)) {
                                resolve(value);
                            }
                            else {
                                reject("NO_MATCH");
                            }
                        }
                        else {
                            resolve(value);
                        }
                    }
                    else {
                        reject("USER_ABORT");
                    }
                }, () => {
                    reject("USER_ABORT");
                });
            });
        });
    }
    vsui.GetString = GetString;
    /** Request user for string input
     * 	@param match also regex match (optional)
     * 	@returns input string if success
     * 	@returns "" if failure(any)
     */
    function GetStringSync(match) {
        const input = vscode_1.default.window.showInputBox(); // request classname as string
        input.then(value => {
            if (value !== undefined) {
                if (match !== undefined) {
                    return match.test(value) ? value : "";
                }
            }
        }, () => {
            return "";
        });
        return "";
    }
    vsui.GetStringSync = GetStringSync;
})(vsui = exports.vsui || (exports.vsui = {}));
//# sourceMappingURL=vsui.js.map