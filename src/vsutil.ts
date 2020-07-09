import { vsed } from "./vsed";

export namespace vsutil {
	/** Returns number of leading tabs in front of a given line/string.
	 *  **NOTE: Will return tabcounts in currentline, if nothing is provided **
	 *  @param inputstr if provided, returns tabcount for that string, otherwise returns tabs in the current line
	 */
	export function TabCount(inputstr?: string): number {
		if (inputstr) {
			let tabcount = 0;
			while (inputstr.charAt(tabcount) === "\t") {
				tabcount++;
			}
			return tabcount;
		} else {
			let _str = vsed.GetCurrentText();
			let tabcount = 0;
			while (_str.charAt(tabcount) === "\t") {
				tabcount++;
			}
			return tabcount;
		}
	}

	/** Applies tabs appropriately to a list of strings
	 *  **NOTE: This would only work in case of C++/C#, for now. (because complex cases haven't been covered yet)**
	 *
	 *  NOTE: **ApplyTabs([], vsutil.TabCount() + 1)**, if adding to the lines below current line (having bracket-start).
	 *
	 *  NOTE: **ApplyTabs([], vsutil.TabCount())**, if replacing the current line as well (having bracket-start).
	 *  @returns Transformed array of strings
	 */
	export function ApplyTabs(lines: string[], initialTabs: number = 0): string[] {
		// Bracket ckeck regex
		let exBracketBegin = /.*?{ ?\n?$/;
		let exBracketEnd = /.*?} ?\n?$/;

		return lines.map((line, i) => {
			// update tab offset (end scope)
			if (exBracketEnd.test(line)) {
				initialTabs--;
			}

			if (i === lines.length - 1) {
				// Dont add "/n" to last line
				line = SetTabs(line, initialTabs, false);
			} else {
				line = SetTabs(line, initialTabs, true);
			}

			// update tab offset (begin scope)
			if (exBracketBegin.test(line)) {
				initialTabs++;
			}
			return line;
		});
	}

	/** Sets number of leading tabs for a string. Used internally, but feel free... */
	export function SetTabs(inputstr: string, num: number, appendNewline: boolean): string {
		let striped = inputstr.trimLeft(); // Trim whitespaces from front
		if (appendNewline) {
			return "\t".repeat(num) + striped + "\n";
		} else {
			return "\t".repeat(num) + striped;
		}
	}
}
