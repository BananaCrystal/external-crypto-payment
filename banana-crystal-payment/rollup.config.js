import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Helper to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default {
  input: "src/PaymentForm.tsx",
  output: [
    {
      dir: "dist", // Use dir instead of file to support multiple entry points
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.browser.js",
      format: "umd",
      name: "BananaCrystalPayment",
      sourcemap: true,
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react/jsx-runtime": "jsxRuntime",
      },
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Ensures it resolves .tsx files
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
    }),
    postcss({
      extensions: [".css"],
      minimize: true,
      inject: {
        insertAt: "top",
      },
    }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
};
