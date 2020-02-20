import vscode from "vscode";
/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		MatchRegexInFile						-->		match file with regex. start to end.
 */
/** namespace to work with the currently focused file. Checking if any file has focus is on you. */
export declare namespace vsed {
    /** Insert a single string at given line(optionally specify tabstops)
     * @param line the line to be inserted
     * @param at The position at which the string has to be inserted. Default = 0;
     * @param tabs Number of tabs to append. Default: Considers number of tabs in second parameter
     * @param debug Whether to show info message. Defaut: false
     */
    function InsertAt(line: string, at: number, tabs?: number, debug?: boolean): void;
    enum PositionInLine {
        start = 0,
        end = 1,
        neither = 2
    }
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
    function MoveCursorTo(at: number, linepos: PositionInLine, charloc?: number): vscode.Position;
    /** Scans line from start to end for regex match
     * @param ex regex to use
     * @returns 0 based line number OR -1
     * @returns
     */
    function MatchRegexInFile(ex: RegExp): Promise<number>;
    /** Scans line from start to end for regex match
     * @param ex pattern to use
     * @returns 0 based line number OR -1
     */
    function MatchRegexInFileSync(ex: RegExp): number;
    /** Scans active file with regex, returns first and last found indices
     * @param ex pattern to use
     * @returns number array with 2 values [start, end] or [-1,-1]
     */
    function MatchRegexInFile_Bounds(ex: RegExp): number[];
    /** Silently writes at line. Effectively adds lines ABOVE
     * the line without shifting user's cursor.
     * @param line Line number
     * @param lines array of strings */
    function WriteAtLine_Silent(line: number, lines: string[]): void;
    /** Regex checks the currently active file.
     * 	Used to differentiate (.cpp/.h,.code-workspace) files etc.
     */
    function RegexTestActiveFile(ex: RegExp): void;
    /** Writes lines at cursor position. Inserts newlines.
     * Also provides options to retain/yield previous cursor position
     * For a fully uninterrupted document update, use @see WriteSilentAt
     * @param lines an array of lines.
     * @param prevPos previous location of cursor (optional)
     * @param autoShift if true, will automatically shift cursor totransformed location.
     * @returns new transformed location, if prevPos was provided. */
    function WriteAtCursor(lines: string[], prevPos?: vscode.Position, autoShift?: boolean): void;
}
//# sourceMappingURL=vsed.d.ts.map