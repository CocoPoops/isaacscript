import { name, version } from "../package.json";
import { configs } from "./configs.js";
import { rules } from "./rules.js";

const plugin = {
  meta: {
    name,
    version,
  },
  configs,
  rules,
};

// https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
for (const configArray of Object.values(configs)) {
  for (const config of configArray) {
    if (config.plugins !== undefined) {
      Object.assign(config.plugins, {
        isaacscript: plugin,
      });
    }
  }
}

export default plugin;
