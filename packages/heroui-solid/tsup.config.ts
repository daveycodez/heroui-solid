import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const presetOptions: preset.PresetOptions = {
  entries: [{ entry: "src/index.tsx" }],
  cjs: false,
};

export default defineConfig((config) => {
  const parsed = preset.parsePresetOptions(presetOptions, !!config.watch);
  return preset.generateTsupOptions(parsed);
});
