"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readline_1 = __importDefault(require("readline"));
/** namespace for working with unopened files using filestreams. */
var vsfs;
(function (vsfs) {
    /** Use a regex pattern and look match for the first line. Only async version available.
     * @param filepath path to file
     * @param ex regular expression to match
     * @returns number(async)
     */
    function RegexMatchLine(filepath, ex) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            const readInterface = readline_1.default.createInterface({
                input: fs.createReadStream(filepath),
                output: process.stdout,
            });
            return new Promise((resolve, reject) => {
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
        });
    }
    vsfs.RegexMatchLine = RegexMatchLine;
})(vsfs = exports.vsfs || (exports.vsfs = {}));
//# sourceMappingURL=vsfs.js.map