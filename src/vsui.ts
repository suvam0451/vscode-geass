import vscode from "vscode";

/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		GetString								-->		get string input. optionally regex match
 */

/** -------------- FUNCTION LIST for vsui module --------------------------
 * 		Error				---		Simple info message. No callbacks.
 * 		GetAFolder			---		Request user for a folder (Sync)
 * 		GetAFolderAsync		---		Request user for a folder (Async)
 * 		GetString			---		Request user for string input (Sync)
 *  	GetStringAsync		---		Request user for string input (Async)
 * 		Info				---		Simple info message. No callbacks.
 * 		InputBoxAsync		--- 	Shows input box to user and recieves SINGLE string input.
 * 		QuickPickAsync		--- 	Show quick pick and return selection. Use doCompare for yes/no prompts etc.
 * 		Warning				---		Simple info message. No callbacks.
 */

/** namespace for working with VSCode UI */
export namespace vsui {
	/** Simple info message. No callbacks.
	 *	@param msg string message
	 */
	export function Error(msg: string) {
		vscode.window.showErrorMessage(msg);
	}

	/** Request user for a folder (Sync)
	 * 	@returns first folder selected if success
	 * 	@returns empty string if failure
	 */
	export function GetAFolder() {
		let opt: vscode.OpenDialogOptions = {};
		opt.canSelectFiles = false;
		opt.canSelectFolders = true;

		vscode.window.showOpenDialog(opt).then(
			success => {
				return success![0].fsPath;
			},
			() => {
				return "";
			},
		);
	}

	/** Request user for a folder (Async)
	 * 	@returns first folder selected if success
	 * 	@returns reject("USER ABORT") if failure
	 */
	export async function GetAFolderAsync(): Promise<string> {
		let opt: vscode.OpenDialogOptions = {};
		opt.canSelectFiles = false;
		opt.canSelectFolders = true;

		return new Promise<string>((resolve, reject) => {
			vscode.window.showOpenDialog(opt).then(
				success => {
					resolve(success![0].fsPath);
				},
				() => {
					reject("SELECTION_EMPTY");
				},
			);
		});
	}

	/** Request user for string input
	 * 	@param match also regex match (optional)
	 * 	@returns input string if success
	 * 	@returns "" if failure(any)
	 */
	export function GetString(match?: RegExp): string {
		const input = vscode.window.showInputBox(); // request classname as string
		input.then(
			value => {
				if (value !== undefined) {
					if (match !== undefined) {
						return match.test(value) ? value : "";
					}
				}
			},
			() => {
				return "";
			},
		);
		return "";
	}

	/** Request user for string input (Async)
	 * 	@param match also regex match (optional)
	 * 	@returns input string if success
	 * 	@returns reject("USER_ABORT") if failure(1)
	 * 	@returns reject("NO_MATCH") if failure(2)
	 */
	export async function GetStringAsync(match?: RegExp): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const input = vscode.window.showInputBox(); // request classname as string
			input.then(
				value => {
					if (value !== undefined) {
						if (match !== undefined) {
							if (match.test(value)) {
								resolve(value);
							} else {
								reject("NO_MATCH");
							}
						} else {
							resolve(value);
						}
					} else {
						reject("USER_ABORT");
					}
				},
				() => {
					reject("USER_ABORT");
				},
			);
		});
	}

	/** Simple info message. No callbacks.
	 * 	@param msg string message
	 */
	export function Info(msg: string) {
		vscode.window.showInformationMessage(msg);
	}

	/** Shows input box to user and recieves string input */
	export async function InputBoxAsync(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const input = vscode.window.showInputBox(); // request classname as string
			input.then(
				value => {
					typeof value !== "undefined" ? resolve(value) : reject("UNDEF");
				},
				() => {
					resolve("USER_ABORT");
				},
			);
		});
	}

	/** Show quick pick and return selection.
	 * Use doCompare for yes/no prompts etc.
	 * @param arr array of options(strings)
	 * @param doCompare whether to do a string check on result
	 * @param compareTo string to match against(Makes regex internally)
	 */
	export async function QuickPickAsync(
		arr: string[],
		doCompare: boolean,
		compareTo?: string,
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			vscode.window.showQuickPick(arr).then(
				retval => {
					if (doCompare) {
						retval === compareTo && doCompare ? resolve(retval) : reject("MISMATCH");
					} else {
						resolve(retval);
					}
				},
				() => {
					reject("ABORT");
				},
			);
		});
	}

	/** Simple info message. No callbacks.
	 * @param msg string message
	 */
	export function Warning(msg: string) {
		vscode.window.showWarningMessage(msg);
	}
}
