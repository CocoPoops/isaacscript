import tseslint from "typescript-eslint";

/**
 * This ESLint config only contains rules from `eslint-plugin-deprecation`:
 * https://github.com/gund/eslint-plugin-deprecation
 *
 * TODO: This plugin does not yet support flat config.
 *
 * @see https://github.com/gund/eslint-plugin-deprecation/pulls
 */
export const baseDeprecation = tseslint.config({
  /*
  {
    plugins: {
      deprecation,
    },

    rules: {
      "deprecation/deprecation": "error",
    },
  }
  */
});
