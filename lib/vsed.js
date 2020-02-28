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
/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		MatchRegexInFile						-->		match file with regex. start to end.
 */
/** namespace to work with the currently focused file. Checking if any file has focus is on you. */
var vsed;
(function (vsed) {
    /** Insert a single string at given line(optionally specify tabstops)
     * @param line the line to be inserted
     * @param at The position at which the string has to be inserted. Default = 0;
     * @param tabs Number of tabs to append. Default: Considers number of tabs in second parameter
     * @param debug Whether to show info message. Defaut: false
     */
    function InsertAt(line, at, tabs, debug) {
        var _a, _b;
        at = at ? at : 0;
        debug = debug ? debug : false;
        let editor = vscode_1.default.window.activeTextEditor;
        let lineEnd = (_a = editor) === null || _a === void 0 ? void 0 : _a.document.lineAt(at).range.end;
        (_b = editor) === null || _b === void 0 ? void 0 : _b.edit(editBuilder => {
            editBuilder.insert(lineEnd, line + "\n");
        }).then(() => {
            if (debug === true) {
                vscode_1.default.window.showInformationMessage("copied to clipboard.");
            }
        }, err => {
            if (debug === true) {
                vscode_1.default.window.showInformationMessage("failed to write to editor : ", err);
            }
        });
    }
    vsed.InsertAt = InsertAt;
    let PositionInLine;
    (function (PositionInLine) {
        PositionInLine[PositionInLine["start"] = 0] = "start";
        PositionInLine[PositionInLine["end"] = 1] = "end";
        PositionInLine[PositionInLine["neither"] = 2] = "neither";
    })(PositionInLine = vsed.PositionInLine || (vsed.PositionInLine = {}));
    /**	Positions cursor at line. Used to add line(s) before/after that line
     * start 	--> use to add lines before
     * end 		--> use to add lines after
     * manual	--> custom requirements ?
     * @param at line number
     * @param linepos start(0)/end(1) of line.
     * @param charloc manual char location in line. (for third enum value)
     * @returns original location (can be used to reset after adding line(s))
     *
     */
    function MoveCursorTo(at, linepos, charloc) {
        var _a, _b;
        const editor = vscode_1.default.window.activeTextEditor;
        const position = (_a = editor) === null || _a === void 0 ? void 0 : _a.selection.active;
        let newpos = (_b = editor) === null || _b === void 0 ? void 0 : _b.selection.active;
        switch (linepos) {
            case PositionInLine.start: {
                newpos = position.with(at, 0);
                break;
            }
            case PositionInLine.end: {
                const endchar = editor.document.lineAt(at).text.length;
                newpos = position.with(at, endchar);
                break;
            }
            case PositionInLine.neither: {
                charloc === undefined
                    ? (newpos = position.with(at, 0))
                    : (newpos = position.with(at, charloc));
                break;
            }
        }
        // set position and return previous position
        editor.selection = new vscode_1.default.Selection(newpos, newpos);
        return position;
    }
    vsed.MoveCursorTo = MoveCursorTo;
    /** DEPRECATED : */
    function InternalWrite(lines, at) {
        var _a;
        let editor = vscode_1.default.window.activeTextEditor;
        // const position = editor?.selection.active!;
        (_a = editor) === null || _a === void 0 ? void 0 : _a.edit(editBuilder => {
            lines.forEach(line => {
                editBuilder.insert(at.active, line + "\n");
            });
        });
    }
    /** Scans line from start to end for regex match
     * @param ex regex to use
     * @returns 0 based line number OR -1
     * @returns
     */
    function MatchRegexInFile(ex) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let editor = vscode_1.default.window.activeTextEditor;
                if (editor === undefined) {
                    reject("NO_EDITOR");
                }
                else {
                    let LineCount = editor.document.lineCount;
                    for (let i = 0; i < LineCount; i++) {
                        if (ex.test(editor.document.lineAt(i).text)) {
                            resolve(i);
                        }
                    }
                }
                resolve(-1);
            });
        });
    }
    vsed.MatchRegexInFile = MatchRegexInFile;
    /** Scans line from start to end for regex match
     * @param ex pattern to use
     * @returns 0 based line number OR -1
     */
    function MatchRegexInFileSync(ex) {
        let editor = vscode_1.default.window.activeTextEditor;
        if (editor === undefined) {
            return -1;
        }
        else {
            let LineCount = editor.document.lineCount;
            for (let i = 0; i < LineCount; i++) {
                if (ex.test(editor.document.lineAt(i).text)) {
                    return i;
                }
            }
        }
        return -1;
    }
    vsed.MatchRegexInFileSync = MatchRegexInFileSync;
    /** Scans active file with regex, returns first and last found indices
     * @param ex pattern to use
     * @returns number array with 2 values [start, end] or [-1,-1]
     */
    function MatchRegexInFile_Bounds(ex) {
        let editor = vscode_1.default.window.activeTextEditor;
        let startfound = false;
        let startat = -1, endat = -1;
        if (editor === undefined) {
            return [-1, -1];
        }
        else {
            let LineCount = editor.document.lineCount;
            for (let i = 0; i < LineCount; i++) {
                if (ex.test(editor.document.lineAt(i).text)) {
                    if (startfound === true) {
                        endat = i;
                    }
                    else {
                        startat = i;
                        startfound = true;
                    }
                }
            }
        }
        return [startat, endat];
    }
    vsed.MatchRegexInFile_Bounds = MatchRegexInFile_Bounds;
    function DeleteLineAtCursor() {
        var _a;
        let editor = vscode_1.default.window.activeTextEditor;
        const position = (_a = editor) === null || _a === void 0 ? void 0 : _a.selection.active;
        // let rng : vscode.Range = {
        // start : editor?.document.lineAt()
        // }
        // editor?.edit(editBuilder => {
        // editBuilder.replace(vscode.Range(position), line + "\n");
        // });
    }
    vsed.DeleteLineAtCursor = DeleteLineAtCursor;
    /** Silently writes at line. Effectively adds lines ABOVE
     * the line without shifting user's cursor.
     * @param line Line number
     * @param lines array of strings
     * @param replaceLine whether to replace that line */
    function WriteAtLine_Silent(line, lines, replaceLine) {
        let prevpos = MoveCursorTo(line, PositionInLine.start);
        let newline = prevpos.line;
        let newchar = prevpos.character;
        if (line < prevpos.line) {
            newline += lines.length; // If adding above current line, add number of lines.
        }
        if (replaceLine !== undefined && replaceLine === true) {
            DeleteLineAtCursor();
        }
        WriteAtCursor(lines);
        MoveCursorTo(newline, PositionInLine.neither, newchar); // back to original
    }
    vsed.WriteAtLine_Silent = WriteAtLine_Silent;
    /** Regex checks the currently active file.
     * 	Used to differentiate (.cpp/.h,.code-workspace) files etc.
     */
    function RegexTestActiveFile(ex) {
        var _a;
        let filename = (_a = vscode_1.default.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName;
        if (filename !== undefined && ex !== undefined) {
            if (RegExp(ex).test(filename)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    vsed.RegexTestActiveFile = RegexTestActiveFile;
    /** Writes lines at cursor position. Inserts newlines.
     * Also provides options to retain/yield previous cursor position
     * For a fully uninterrupted document update, use @see WriteSilentAt
     * @param lines an array of lines.
     * @param prevPos previous location of cursor (optional)
     * @param autoShift if true, will automatically shift cursor totransformed location.
     * @returns new transformed location, if prevPos was provided. */
    function WriteAtCursor(lines, autoShift) {
        var _a, _b;
        let editor = vscode_1.default.window.activeTextEditor;
        const position = (_a = editor) === null || _a === void 0 ? void 0 : _a.selection.active;
        (_b = editor) === null || _b === void 0 ? void 0 : _b.edit(editBuilder => {
            lines.forEach(line => {
                editBuilder.insert(position, line + "\n");
            });
        });
    }
    vsed.WriteAtCursor = WriteAtCursor;
})(vsed = exports.vsed || (exports.vsed = {}));
//# sourceMappingURL=vsed.js.map