import vscode from "vscode";

/** FUNCTION LIST (sync/async available for most of them. Defaults to async API)
 * 		GetAFolder 								--> 	get folder
 * 		GetString								-->		get string input. optionally regex match
 */

/** namespace for working with VSCode UI */
export namespace vsui {
	/** Simple info message. No callbacks. */
	export function Info(msg: string) {
		vscode.window.showInformationMessage(msg);
	}

	/** Simple info message. No callbacks. */
	export function Error(msg: string) {
		vscode.window.showErrorMessage(msg);
	}

	/** Simple info message. No callbacks. */
	export function Warning(msg: string) {
		vscode.window.showWarningMessage(msg);
	}

	/** Request user for a folder
	 * 	@returns first folder selected if success
	 * 	@returns reject("USER ABORT") if failure
	 */
	export async function GetAFolder(): Promise<string> {
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

	/** Request user for a folder (sync)
	 * 	@returns first folder selected if success
	 * 	@returns empty string if failure
	 */
	export function GetAFolderSync() {
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

	/** Request user for string input
	 * 	@param match also regex match (optional)
	 * 	@returns input string if success
	 * 	@returns reject("USER_ABORT") if failure(1)
	 * 	@returns reject("NO_MATCH") if failure(2)
	 */
	export async function GetString(match?: RegExp): Promise<string> {
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

	/** Request user for string input
	 * 	@param match also regex match (optional)
	 * 	@returns input string if success
	 * 	@returns "" if failure(any)
	 */
	export function GetStringSync(match?: RegExp): string {
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

	/** Shows input box to user and recieves string input */
	export async function InputBox(): Promise<string> {
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

	/** Request a single folder */
	export async function PickFolder(): Promise<string> {
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

	/** Show quick pick and return selection.
	 * Use doCompare for yes/no prompts etc.
	 * @param arr array of options(strings)
	 * @param doCompare whether to do a string check on result
	 * @param compareTo string to match against(Makes regex internally)
	 */
	export async function QuickPick(
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
}
