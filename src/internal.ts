import vscode from "vscode";

/** namespace used for internal type conversions. You probably do not need this. */
export namespace vsinternal {
	export function GetLineFromPosition(pos: vscode.Position): number {
		let _ed = vscode.window.activeTextEditor;
		if (typeof _ed == "undefined") {
			return -1;
		}

		let _pos = _ed.selection.active.line;
		return _pos;
	}
}
