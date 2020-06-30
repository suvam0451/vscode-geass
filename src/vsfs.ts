import * as fs from "fs";
import readline from "readline";

/** -------------- FUNCTION LIST for vsfs module --------------------------
 * 		RegexMatchLine				---		Use a regex pattern and look match for the first line. Only async version available.
 */

/** namespace for working with unopened files using filestreams. */
export namespace vsfs {
	/** Use a regex pattern and look match for the first line. Only async version available.
	 * @param filepath path to file
	 * @param ex regular expression to match
	 * @returns number(async)
	 */
	export async function RegexMatchLine(filepath: string, ex: RegExp): Promise<number> {
		let index = 0;

		const readInterface = readline.createInterface({
			input: fs.createReadStream(filepath),
			output: process.stdout,
		});
		return new Promise<number>((resolve, reject) => {
			readInterface
				.on("line", line => {
					if (ex.test(line) === true) {
						resolve(index);
						readInterface.close();
					}
					index++;
				})
				.on("close", () => {
					resolve(-1);
				});
		});
	}
}
