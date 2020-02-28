import vscode from "vscode";

/** -------------- FUNCTION LIST for vscfg module --------------------------
 * 		GetVSConfig					---		Gets a VSCode config(string array) and updates it.
 *		AppendToVSConfig			---		Gets a VSCode config (templated)
 */

export namespace vscfg {
	/** Gets a VSCode config(string array) and updates it.
	 * @param namespace namespace as set in package.json
	 * @param key name as set in config.json
	 * @param vals string value to be inserted
	 * @returns 0 if successful, 1 if unsuccessful
	 */
	export function AppendToVSConfig(namespace: string, key: string, vals: string[]): number {
		let config = vscode.workspace.getConfiguration(namespace);
		let retval = config.get<string[]>(key)!;
		if (retval === undefined) {
			return 1;
		}

		// Otherwise add and update
		retval.push(...vals);
		config.update(key, retval, undefined);
		return 0;
	}

	/** Gets a VSCode config (templated)
	 * @param namespace namespace as set in package.json
	 * @param key name as set in config.json
	 * @returns typecasted config data
	 */
	export function GetVSConfig<T>(namespace: string, key: string): T {
		let config = vscode.workspace.getConfiguration(namespace);
		let retval = config.get<T>(key)!;
		return retval;
	}
}
