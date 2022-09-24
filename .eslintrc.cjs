module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
  },
};
