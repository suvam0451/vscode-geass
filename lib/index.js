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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
const vsui_1 = require("./vsui");
exports.vsui = vsui_1.vsui;
const vsed_1 = require("./vsed");
exports.vsed = vsed_1.vsed;
/** Shows input box to user and recieves string input */
function InputBox() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const input = vscode_1.default.window.showInputBox(); // request classname as string
            input.then(value => {
                typeof value !== "undefined" ? resolve(value) : reject("UNDEF");
            }, () => {
                resolve("USER_ABORT");
            });
            vsui_1.vsui.GetAFolder();
        });
    });
}
exports.InputBox = InputBox;
/** Request a single folder */
function PickFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        let opt = {};
        opt.canSelectFiles = false;
        opt.canSelectFolders = true;
        return new Promise((resolve, reject) => {
            vscode_1.default.window.showOpenDialog(opt).then(success => {
                resolve(success[0].fsPath);
            }, () => {
                reject("SELECTION_EMPTY");
            });
        });
    });
}
exports.PickFolder = PickFolder;
//# sourceMappingURL=index.js.map