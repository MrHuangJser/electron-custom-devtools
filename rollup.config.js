import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "./src/index.ts",
  output: {
    dir: "dist",
    // preserveModules: true,
    sourcemap: false,
  },
  plugins: [commonjs(), typescript({ tsconfig: "./tsconfig.json" })],
});
