import vscode from "vscode";

/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		MatchRegexInFile						-->		match file with regex. start to end.
 */

/** namespace to work with the currently focused file. Checking if any file has focus is on you. */
export namespace vsed {
	/** Insert a single string at given line(optionally specify tabstops)
	 * @param line the line to be inserted
	 * @param at The position at which the string has to be inserted. Default = 0;
	 * @param tabs Number of tabs to append. Default: Considers number of tabs in second parameter
	 * @param debug Whether to show info message. Defaut: false
	 */
	export function InsertAt(
		line: string,
		at: number,
		tabs?: number,
		debug?: boolean
	) {
		at = at ? at : 0;
		debug = debug ? debug : false;
		let editor = vscode.window.activeTextEditor;
		let lineEnd = editor?.document.lineAt(at).range.end;
		editor
			?.edit(editBuilder => {
				editBuilder.insert(lineEnd!, line + "\n");
			})
			.then(
				() => {
					if (debug === true) {
						vscode.window.showInformationMessage("copied to clipboard.");
					}
				},
				err => {
					if (debug === true) {
						vscode.window.showInformationMessage(
							"failed to write to editor : ",
							err
						);
					}
				}
			);
	}

	export enum PositionInLine {
		start,
		end,
		neither
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
	export function MoveCursorTo(
		at: number,
		linepos: PositionInLine,
		charloc?: number
	): vscode.Position {
		const editor = vscode.window.activeTextEditor!;
		const position = editor?.selection.active!;
		let newpos: vscode.Position = editor?.selection.active;
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
		editor.selection = new vscode.Selection(newpos, newpos);
		return position;
	}

	/** DEPRECATED : */
	function InternalWrite(lines: string[], at: vscode.Selection) {
		let editor = vscode.window.activeTextEditor;
		// const position = editor?.selection.active!;
		editor?.edit(editBuilder => {
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
	export async function MatchRegexInFile(ex: RegExp): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			let editor = vscode.window.activeTextEditor!;
			if (editor === undefined) {
				reject("NO_EDITOR");
			} else {
				let LineCount = editor.document.lineCount;
				for (let i = 0; i < LineCount; i++) {
					if (ex.test(editor.document.lineAt(i).text)) {
						resolve(i);
					}
				}
			}
			resolve(-1);
		});
	}

	/** Scans line from start to end for regex match
	 * @param ex pattern to use
	 * @returns 0 based line number OR -1
	 */
	export function MatchRegexInFileSync(ex: RegExp): number {
		let editor = vscode.window.activeTextEditor!;
		if (editor === undefined) {
			return -1;
		} else {
			let LineCount = editor.document.lineCount;
			for (let i = 0; i < LineCount; i++) {
				if (ex.test(editor.document.lineAt(i).text)) {
					return i;
				}
			}
		}
		return -1;
	}

	/** Scans active file with regex, returns first and last found indices
	 * @param ex pattern to use
	 * @returns number array with 2 values [start, end] or [-1,-1]
	 */
	export function MatchRegexInFile_Bounds(ex: RegExp): number[] {
		let editor = vscode.window.activeTextEditor!;
		let startfound = false;
		let startat = -1,
			endat = -1;
		if (editor === undefined) {
			return [-1, -1];
		} else {
			let LineCount = editor.document.lineCount;
			for (let i = 0; i < LineCount; i++) {
				if (ex.test(editor.document.lineAt(i).text)) {
					if (startfound === true) {
						endat = i;
					} else {
						startat = i;
						startfound = true;
					}
				}
			}
		}
		return [startat, endat];
	}

	/** Silently writes at line. Effectively adds lines ABOVE
	 * the line without shifting user's cursor.
	 * @param line Line number
	 * @param lines array of strings */
	export function WriteAtLine_Silent(line: number, lines: string[]) {
		let prevpos = MoveCursorTo(line, PositionInLine.start);
		let newline = prevpos.line;
		let newchar = prevpos.character;
		if (line < prevpos.line) {
			newline += lines.length; // If adding above current line, add number of lines.
		}
		WriteAtCursor(lines);
		MoveCursorTo(newline, PositionInLine.neither, newchar); // back to original
	}
	/** Regex checks the currently active file.
	 * 	Used to differentiate (.cpp/.h,.code-workspace) files etc.
	 */
	export function RegexTestActiveFile(ex: RegExp) {}

	/** Writes lines at cursor position. Inserts newlines.
	 * Also provides options to retain/yield previous cursor position
	 * For a fully uninterrupted document update, use @see WriteSilentAt
	 * @param lines an array of lines.
	 * @param prevPos previous location of cursor (optional)
	 * @param autoShift if true, will automatically shift cursor totransformed location.
	 * @returns new transformed location, if prevPos was provided. */
	export function WriteAtCursor(
		lines: string[],
		prevPos?: vscode.Position,
		autoShift?: boolean
	) {
		let editor = vscode.window.activeTextEditor;
		const position = editor?.selection.active!;
		editor?.edit(editBuilder => {
			lines.forEach(line => {
				editBuilder.insert(position, line + "\n");
			});
		});
	}
}
