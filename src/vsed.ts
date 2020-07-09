import vscode from "vscode";

/** -------------- FUNCTION LIST for vsed module --------------------------
 * 		InsertAt					---		Insert a single string at given line(optionally specify tabstops)
 *		MoveCursorTo				---		Positions cursor at line. Used to add line(s) before/after that line
 *		MatchRegexInFile			---		Scans line from start to end for regex match
 *		MatchRegexInFileSync 		---		Scans line from start to end for regex match
 *		MatchRegexInFile_Bounds		---		Scans active file with regex, returns first and last found indices
 *		RegexTestActiveFile			---		Regex checks the currently active file.
 *		WriteAtLine_Silent			---		Silently writes at line. Effectively adds lines ABOVE
 *		WriteAtCursor				---		Writes lines at cursor position. Inserts newlines.
 *		RegexReplaceEachLine		---		Matches all lines in file with regex and replaces for each match
 *		SeekAboveThisLine			---		Returns matched line index, starting from and incuding current line, else -1
 *		SeekBelowThisLine			---		Returns matched line index, starting from and incuding current line, else -1
 *		GetCurrentLine				---		Gets the current line being highlighted
 *		GetCurrentText				---		Gets the text in the line with the cursor. Empty string in case of error
 */

/** namespace to work with the currently focused file. Checking if any file has focus is on you. */
export namespace vsed {
	/** Gets the current line with curson. -1 in case of ANY error. */
	export function GetCurrentLine(): number {
		let _ed = vscode.window.activeTextEditor;
		if (typeof _ed == "undefined") {
			return -1;
		}
		return _ed.selection.active.line;
	}

	/** Gets the current line with curson. -1 in case of ANY error. */
	export function GetCurrentText(): string {
		let _ed = vscode.window.activeTextEditor;
		if (typeof _ed == "undefined") {
			return "";
		}
		let _line = _ed.selection.active.line;
		let _str = _ed?.document.lineAt(_line!).text;
		return _str;
	}

	/** Returns matched line index, starting from and incuding current line, else -1 */
	export function SeekAboveThisLine(from: number | vscode.Position, ex: RegExp): number {
		let _ed = vscode.window.activeTextEditor;
		let currentLine = -1;

		if (typeof from == "number") {
			// Line given.
			currentLine = from;
		} else if (typeof from == "undefined") {
			// Undefined. Continue with current position
			let _pos = _ed?.selection.active;
			if (typeof _pos == "undefined") {
				currentLine = -1;
			} else {
				currentLine = _pos?.line;
			}
		} else {
			// Position given
			currentLine = from.line;
		}

		if (currentLine == -1) {
			return -1;
		}
		// Loop and search upwards
		while (currentLine!--) {
			let _str = _ed?.document.lineAt(currentLine!).text;
			if (typeof _str == "undefined") {
				return -1;
			}
			if (ex.test(_str!)) {
				return currentLine;
			}
		}
		return -1;
	}

	/** Insert a single string at given line(optionally specify tabstops)
	 * @param line the line to be inserted
	 * @param at The position at which the string has to be inserted. Default = 0;
	 * @param tabs Number of tabs to append. Default: Considers number of tabs in second parameter
	 * @param debug Whether to show info message. Defaut: false
	 */
	export function InsertAt(line: string, at: number, tabs?: number, debug?: boolean) {
		at = at ? at : 0;
		debug = debug ? debug : false;
		let editor = vscode.window.activeTextEditor;
		let lineEnd = editor?.document.lineAt(at).range.end;
		editor
			?.edit((editBuilder) => {
				editBuilder.insert(lineEnd!, line + "\n");
			})
			.then(
				() => {
					if (debug === true) {
						vscode.window.showInformationMessage("copied to clipboard.");
					}
				},
				(err) => {
					if (debug === true) {
						vscode.window.showInformationMessage("failed to write to editor : ", err);
					}
				},
			);
	}

	export enum PositionInLine {
		start,
		end,
		neither,
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
		charloc?: number,
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
		editor?.edit((editBuilder) => {
			lines.forEach((line) => {
				editBuilder.insert(at.active, line + "\n");
			});
		});
	}

	/** Scans lines from start to end of file (using a regular expression)
	 * 	Returns the first match found, or -1
	 * @param ex regex to use
	 * @returns line which matches regex(0 based indexing) | -1
	 */
	export async function MatchRegexInFileAsync(ex: RegExp): Promise<number> {
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

	/** Scans lines from start to end of file (using a regular expression)
	 * 	Returns the first match found, or -1
	 * @param ex pattern to use
	 * @returns line which matches regex(0 based indexing) | -1
	 */
	export function MatchRegexInFile(ex: RegExp): number {
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

	/** Scans the active file (using given regular expression)
	 * 	returns the line with first occurance and last occurance.
	 *
	 * 	USECASE -- C++ #include block
	 *
	 * 	@param ex pattern to use
	 * 	@returns [start, end] || [-1,-1]
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

	export function DeleteLineAtCursor() {
		let editor = vscode.window.activeTextEditor;
		const position = editor?.selection.active!;
		// let rng : vscode.Range = {
		// start : editor?.document.lineAt()
		// }
		// editor?.edit(editBuilder => {
		// editBuilder.replace(vscode.Range(position), line + "\n");
		// });
	}

	/** Check if the currently active file matches a regular expression.
	 * 	USECASE -- file extensions.
	 * 	@returns true || false
	 */
	export function RegexTestActiveFile(ex: string | undefined): boolean {
		let filename = vscode.window.activeTextEditor?.document.fileName;
		if (filename !== undefined && ex !== undefined) {
			if (RegExp(ex).test(filename!)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/** Silently writes at line. Effectively adds lines ABOVE
	 * the line without shifting user's cursor.
	 *
	 * **NOTE: The cursor is shifted back to original position after edit**
	 * USECASE: Replacing comments with snippets in runtime, dynamic imports like golang.
	 *
	 * @param pos Line number(0 based) at which to write output in current line.
	 * @param lines An array of strings.
	 * @param replaceLine Whether the current line at destination should be replaced ? */
	export function WriteAtLine_Silent(
		pos: number,
		lines: string[],
		preserveTabs: boolean = true,
		replaceLine: boolean = false,
	) {
		let prevpos = MoveCursorTo(pos, PositionInLine.start);
		// let { line, character } = prevpos;
		let newline = prevpos.line;
		let newchar = prevpos.character;
		if (pos < prevpos.line) {
			newline += lines.length; // If adding above current line, add number of lines.
		}
		if (replaceLine) {
			DeleteLineAtCursor();
		}
		WriteAtCursor(lines);
		MoveCursorTo(newline, PositionInLine.neither, newchar); // back to original
	}

	/** Writes lines at the current cursor position. Inserts newlines at end of each line entry.
	 * Also provides options to retain/yield previous cursor position
	 * For a fully uninterrupted document update, use @see WriteSilentAt
	 * @param lines an array of lines.
	 * @param prevPos previous location of cursor (optional)
	 * @param autoShift if true, will automatically shift cursor totransformed location.
	 * @returns new transformed location, if prevPos was provided. */
	export function WriteAtCursor(lines: string[], autoShift?: boolean) {
		let editor = vscode.window.activeTextEditor;
		const position = editor?.selection.active!;
		editor?.edit((editBuilder) => {
			lines.forEach((line) => {
				editBuilder.insert(position, line + "\n");
			});
		});
	}
}
