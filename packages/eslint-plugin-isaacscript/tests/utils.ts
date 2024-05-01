import { RuleTester } from "@typescript-eslint/rule-tester";
import path from "node:path";

/** @see https://typescript-eslint.io/packages/rule-tester */
export const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: path.join(import.meta.dirname, "fixtures"),
    project: true,
  },
});
