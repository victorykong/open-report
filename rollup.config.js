import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import cleanOutput from "rollup-plugin-delete";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

// node_modules/rollup/dist/rollup.d.ts:543
const config = {
  input: "./src/index.ts",
  output: {
    format: "iife",
    dir: "dist",
    name: 'VTMEventDOM'
  },
  plugins: [
    cleanOutput({
      targets: "../dist/*",
      runOnce: true,
    }),
    commonjs(),
    nodeResolve(),
    typescript(),
  ],
  context: "window", // browser env
};

const { NODE_ENV: env } = process.env;

// Dev
if (env === "dev") {
  config.watch = {
    buildDelay: 500,
    include: "src/**",
  };
  config.output.sourcemap = true;
}

// Prod
if (env === "prod") {
  config.output.sourcemap = "hidden";
  config.plugins.push(terser());
}

export default config;
