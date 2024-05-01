import eslintPluginIsaacScript from "eslint-plugin-isaacscript";
import tseslint from "typescript-eslint";
import { baseDeprecation } from "./configs/base-deprecation.js";

// Activate "eslint-plugin-only-warn" to change all errors to warnings:
// https://github.com/bfanger/eslint-plugin-only-warn
// This allows the end-user to more easily distinguish between errors from the TypeScript compiler
// (which show up in red) and ESLint rule violations (which show up in yellow).
import "eslint-plugin-only-warn"; // https://github.com/bfanger/eslint-plugin-only-warn/issues/13#issuecomment-2041657774

/** @type {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigArray} */
export const base = tseslint.config(
  ...baseDeprecation,
  ...eslintPluginIsaacScript.configs.recommended,
);

/** This ESLint config is meant to be used as a base for all TypeScript projects. */
export const baseConfigOld = {
  extends: [
    /**
     * Rule modifications are split out into different files for better organization (based on the
     * originating plugin) .
     */
    "./configs/base-eslint",
    "./configs/base-no-autofix",
    "./configs/base-typescript-eslint",
    "./configs/base-eslint-comments",
    "./configs/base-import",
    "./configs/base-jsdoc",
    "./configs/base-n", // "n" stands for Node.
    "./configs/base-unicorn",

    /**
     * This provides extra miscellaneous rules to keep code safe:
     * https://github.com/IsaacScript/isaacscript/tree/main/packages/eslint-plugin-isaacscript
     */
    "plugin:isaacscript/recommended",
  ],
};
