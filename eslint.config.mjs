import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      boundaries,
    },

    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "app/**" },
        { type: "components", pattern: "components/**" },
        { type: "domain", pattern: "domain/**" },
        { type: "schemas", pattern: "schemas/**" },
        { type: "lib", pattern: "lib/**" },
        { type: "types", pattern: "types/**" },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["domain", "schemas", "lib", "types"] },
            { from: "domain", allow: ["schemas", "types"] },
            { from: "lib", allow: ["types"] },
            { from: "components", allow: ["types"] },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
