/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Overview",
      items: ["main/features", "main/right-for-me", "main/getting-started"],
    },
    {
      type: "category",
      label: "General Info",
      items: [
        "main/discord",
        "main/what-is-isaacscript-doing",
        "main/directory-structure",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "main/javascript-tutorial",
        "main/example-mod",
        "main/refactoring-mod",
        "main/converting-lua-code",
        "main/updating-isaacscript",
      ],
    },
    "main/standard-library",
    {
      type: "category",
      label: "Other",
      items: [
        "main/publishing-to-the-workshop",
        "main/gotchas",
        "main/function-signatures",
        "main/function-signatures-custom",
      ],
    },
  ],

  common: [
    {
      type: "autogenerated",
      dirName: "isaacscript-common",
    },
  ],
};

module.exports = sidebars;
