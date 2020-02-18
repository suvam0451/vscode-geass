import vscode from "vscode";

export namespace vsed {
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
				}
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
			}
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
				}
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
			}
		);
		return "";
	}
}
