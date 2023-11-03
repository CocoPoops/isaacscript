"use strict";
/** This plugin adds an explanatory header to the top of the generated Lua code. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const cwd = process.cwd();
const packageJSONPath = node_path_1.default.join(cwd, "package.json");
const packageJSONContents = node_fs_1.default.readFileSync(packageJSONPath, "utf8");
const packageJSON = JSON.parse(packageJSONContents);
const { version } = packageJSON;
const INFORMATIONAL_HEADER = `--[[

isaacscript-common ${version}

This is the "isaacscript-common" library, which was created with the IsaacScript tool.

This library contains helper functions and features that abstract away much of the complexity in
working with the Isaac API. For more information on how to use this library, see the manual:
https://isaacscript.github.io/main/isaacscript-in-lua

DO NOT EDIT THIS FILE DIRECTLY!

The Lua code in this file is not actually the source code for the program. Rather, it was
automatically generated from higher-level TypeScript code, and might be hard to read. If you want to
understand how the code in this library works, you should read the actual TypeScript source code
directly, which is located at:
https://github.com/IsaacScript/isaacscript/tree/main/packages/isaacscript-common

Please open bug reports and pull requests on GitHub. You can also ask questions in the Discord
server: https://discord.gg/KapmKQ2gUD

Note that if you are writing your mod in TypeScript, using this file is unnecessary, as every
"isaacscript-common" feature will be automatically bundled with your mod as needed. For more
information about using TypeScript, see the website: https://isaacscript.github.io/main/features

--]]

---@diagnostic disable
-- cspell:disable

`;
const plugin = {
    beforeEmit(_program, _options, _emitHost, result) {
        for (const file of result) {
            file.code = INFORMATIONAL_HEADER + file.code;
        }
    },
};
exports.default = plugin;