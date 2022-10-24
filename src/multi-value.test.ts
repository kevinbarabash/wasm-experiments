import { assert, beforeAll, expect, test, describe } from "vitest";

import { compileWat } from "./compile-wat";

describe("Multi Value", () => {
  let wasmModule: WebAssembly.Module;
  const importObj = {};

  beforeAll(async () => {
    try {
      const watPath = new URL("./multi-value.wat", import.meta.url).pathname;
      const { buffer } = await compileWat(watPath);
      wasmModule = await WebAssembly.compile(buffer);
    } catch (err) {
      console.log(`Error compiling *.wat: ${err}`);
    }
  });

  test("[offset, length]", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const hello = instance.exports.hello as Function;

    const [offset, length] = hello();

    expect(offset).toEqual(64);
    expect(length).toEqual(14);
  });

  test("[offset, length] again", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const hello = instance.exports.hello as Function;

    const [offset, length] = hello();

    expect(offset).toEqual(64);
    expect(length).toEqual(14);
  });
});
