import vscode from "vscode";
import { vsed, vsui } from "../lib/index";

export { vsui, vsed };
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
			}
		);
		vsui.GetAFolder();
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
			}
		);
	});
}
