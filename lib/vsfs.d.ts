/** namespace for working with unopened files using filestreams. */
export declare namespace vsfs {
    /** Use a regex pattern and look match for the first line. Only async version available.
     * @param filepath path to file
     * @param ex regular expression to match
     * @returns number(async)
     */
    function RegexMatchLine(filepath: string, ex: RegExp): Promise<number>;
}
//# sourceMappingURL=vsfs.d.ts.map