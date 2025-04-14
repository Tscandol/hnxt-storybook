import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/components/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  treeshake: true,
  tsconfig: "tsconfig.build.json",
  external: ["react", "react-dom", "next", "next/image"],
});
