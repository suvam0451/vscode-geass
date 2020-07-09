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
				.on("line", (line) => {
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

	/** Writes to a file, starting at given line number.
	 * **NOTE: Use vsed.WriteAtLines if working with the active file.**
	 */
	export async function WriteAtLineAsync(
		filepath: string,
		at: number,
		lines: string[],
	): Promise<void> {
		let content = lines.reduce((prev, curr) => prev + "\n" + curr);
		content = content.slice(0, content.length - 1); // Remove last newline character
		return new Promise<void>((resolve, reject) => {
			try {
				let data: string[] = fs.readFileSync(filepath).toString().split("\n");
				data.splice(at, 0, content); // Adds content at "at", 0 items removed

				// Using filestream
				let stream = fs
					.createWriteStream(filepath)
					.on("error", () => {
						console.log("Some error occured...");
					})
					.on("finish", () => {
						resolve();
					});
				data.forEach((line) => {
					stream.write(line + "\n");
				});
				stream.end();
				resolve();
			} catch {
				reject("404");
			}
		});
	}
}
