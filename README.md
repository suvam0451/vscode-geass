# vscode-geass

A high level abstraction layer for help in file-editing and scripting workflows in vscode.

I made this package because many software APIs _(mostly game engines)_ are macro heavy and default code-completion tools are not adequate. This results in much of dev-time wasted writing boilerplate code. This package is used to develop the following projects. Feel free to integrate to your own projects.

[Sleeping Forest](https://github.com/suvam0451/sleeping-forest-ue4)

The API is provided as a set of self-explanatorily named modules. The goal is to parse lines in editor to contextually

- Make changes to files like (.cpp/.h) pairs
- Auto-fill boiletplate code
- Create directories

### vscfg

Config module.

Contains functions for reading and updating configurations easily.

| FunctionName     | Utility                                            |
| ---------------- | -------------------------------------------------- |
| GetVSConfig      | Gets a VSCode config(string array) and updates it. |
| AppendToVSConfig | Gets a VSCode config (templated)                   |

### vsed

Editor module.

Contains functions to read, make edits and parse lines for the **current file**. Any other file should be manipulated using **vsfs**.

| FunctionName            | Utility                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| InsertAt                | Insert a single string at given line(optionally specify tabstops)    |
| MoveCursorTo            | Positions cursor at line. Used to add line(s) before/after that line |
| MatchRegexInFile        | Scans line from start to end for regex match                         |
| MatchRegexInFileSync    | Scans line from start to end for regex match                         |
| MatchRegexInFile_Bounds | Scans active file with regex, returns first and last found indices   |
| RegexTestActiveFile     | Regex checks the currently active file.                              |
| WriteAtLine_Silent      | Silently writes at line. Effectively adds lines ABOVE                |
| WriteAtCursor           | Writes lines at cursor position. Inserts newlines.                   |

### vsfs

Filesystem module.

Use to read,write files other that the active file. Mostly async functions available. Uses read/write buffers internally.

| FunctionName   | Utility                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| RegexMatchLine | Use a regex pattern and look match for the first line. Only async version available. |

### vsui

User-Interface module.

Shorthands for most of the default library. A few quality-of-improvement in UX handling.

| FunctionName    | Utility                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| Error           | Simple info message. No callbacks.                                          |
| GetAFolder      | Request user for a folder (Sync)                                            |
| GetAFolderAsync | Request user for a folder (Async)                                           |
| GetString       | Request user for string input (Sync)                                        |
| GetStringAsync  | Request user for string input (Async)                                       |
| Info            | Simple info message. No callbacks.                                          |
| InputBoxAsync   | Shows input box to user and recieves SINGLE string input.                   |
| QuickPickAsync  | Show quick pick and return selection. Use doCompare for yes/no prompts etc. |
| Warning         | Simple info message. No callbacks.                                          |

### Note to self

To push an update to github
