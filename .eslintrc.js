const { settings } = require("eslint-config-expo");

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier", "universe/native"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  ignorePatterns: ["/dist/*"],
  settings: {
    ...settings,
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
  },
};
