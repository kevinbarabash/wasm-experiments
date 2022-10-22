import { beforeAll, expect, test, describe } from "vitest";

import { compileWat } from "./compile-wat";

// @ts-expect-error: TypeScript doesn't know about WebAssembly.Tag
const extTag = new WebAssembly.Tag({ parameters: ["i32"] });
const importObj = {
  extMod: {
    extTag,
    throwExtTag(num: number): number {
      // @ts-expect-error: TypeScript doesn't know about WebAssmebly.Exception
      const e = new WebAssembly.Exception(extTag, [num + 1]);
      throw e;
    },
  },
};

describe("try-catch", () => {
  let wasmModule: WebAssembly.Module;

  beforeAll(async () => {
    try {
      const watPath = new URL("./try-catch.wat", import.meta.url).pathname;
      const { buffer } = await compileWat(watPath);
      wasmModule = await WebAssembly.compile(buffer);
    } catch (err) {
      console.log(`Error compiling *.wat: ${err}`);
    }
  });

  test("tryCatch", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const tryCatch = instance.exports.tryCatch as Function;

    const result = tryCatch();

    expect(result).toEqual(1);
  });

  test("justThrow", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const justThrow = instance.exports.justThrow as Function;

    expect(justThrow).toThrow();

    try {
      justThrow();
    } catch (e) {
      // @ts-expect-error: TypeScript doesn't know about WebAssembly.Exception
      const arg = e.getArg(extTag, 0);

      expect(arg).toEqual(5);
    }
  });

  test("catch an exception in wasm thrown from javascript", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const catchAndReturn = instance.exports.catchAndReturn as Function;

    const result = catchAndReturn();

    // catchAndReturn calls throwExtTag(23) and throwExtTag(n) throws
    // an exception with a payload of n + 1.
    expect(result).toEqual(24);
  });
});
