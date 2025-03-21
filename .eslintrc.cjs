module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["react", "react-hooks"],
    rules: {
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "off",
        "no-undef": "off",
    },
    settings: {
        "import/resolver": {
            node: {
                paths: ["src"],
            },
        },
        react: { version: "detect" },
    },
};
