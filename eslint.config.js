import js from "@eslint/js";
import reactRecommended from "eslint-plugin-react/configs/recommended";
import hooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  reactRecommended,
  {
    ...hooks.configs.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  }
];
