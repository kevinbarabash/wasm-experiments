import { assert, beforeAll, expect, test, describe } from "vitest";

import { compileWat } from "./compile-wat";

describe("bulk-memory", () => {
  let wasmModule: WebAssembly.Module;
  const importObj = {};

  beforeAll(async () => {
    try {
      const watPath = new URL("./bulk-memory.wat", import.meta.url).pathname;
      const { buffer } = await compileWat(watPath);
      wasmModule = await WebAssembly.compile(buffer);
    } catch (err) {
      console.log(`Error compiling *.wat: ${err}`);
    }
  });

  test("init", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const init = instance.exports.init as Function;
    const fill = instance.exports.fill as Function;

    init();

    const mem = instance.exports.mem as WebAssembly.Memory;
    const view = new DataView(mem.buffer);
    expect(view.getUint8(16)).toEqual("g".charCodeAt(0));
    expect(view.getUint8(16 + 7 - 1)).toEqual("e".charCodeAt(0));

    // NOTE: the first (0-index) data segment is automatically copied
    // so "hello" is already there.
    expect(view.getUint8(0)).toEqual("h".charCodeAt(0));
    expect(view.getUint8(0 + 5 - 1)).toEqual("o".charCodeAt(0));
  });

  test("fill", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const fill = instance.exports.fill as Function;

    fill(0, 255, 10);

    const mem = instance.exports.mem as WebAssembly.Memory;
    const view = new DataView(mem.buffer);
    expect(view.getUint8(0)).toEqual(255);
    expect(view.getUint8(9)).toEqual(255);
    expect(view.getUint8(10)).not.toEqual(255);
  });

  test("copy", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const copy = instance.exports.copy as Function;
    const mem = instance.exports.mem as WebAssembly.Memory;
    const view = new DataView(mem.buffer);

    for (let i = 0; i < 10; i++) {
      view.setUint8(i, i);
    }
    copy(20, 0, 10);

    expect(view.getUint8(20)).toEqual(0);
    expect(view.getUint8(29)).toEqual(9);
  });

  test("overlapping copy", async () => {
    const instance = await WebAssembly.instantiate(wasmModule, importObj);
    const copy = instance.exports.copy as Function;
    const mem = instance.exports.mem as WebAssembly.Memory;
    const view = new DataView(mem.buffer);

    for (let i = 0; i < 10; i++) {
      view.setUint8(i, i);
    }
    copy(1, 0, 10);

    expect(view.getUint8(1)).toEqual(0);
    expect(view.getUint8(10)).toEqual(9);
  });
});
