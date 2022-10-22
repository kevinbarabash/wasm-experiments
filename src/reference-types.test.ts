import { beforeAll, expect, test, describe } from "vitest";

import { compileWat } from "./compile-wat";

describe("reference-types", () => {
  let wasmModule: WebAssembly.Module;

  beforeAll(async () => {
    try {
      const watPath = new URL("./reference-types.wat", import.meta.url)
        .pathname;
      const { buffer } = await compileWat(watPath);
      wasmModule = await WebAssembly.compile(buffer);
    } catch (err) {
      console.log(`Error compiling *.wat: ${err}`);
    }
  });

  test("call functions from the table", async () => {
    const tbl = new WebAssembly.Table({ initial: 2, element: "anyfunc" });
    expect(tbl.length).toEqual(2);
    expect(tbl.get(0)).toBeNull();
    expect(tbl.get(1)).toBeNull();

    await WebAssembly.instantiate(wasmModule, { js: { tbl } });

    expect(tbl.length).toEqual(2);
    expect(tbl.get(0)()).toEqual(42);
    expect(tbl.get(1)()).toEqual(83);
  });

  test("call indirect", async () => {
    const tbl = new WebAssembly.Table({ initial: 2, element: "anyfunc" });

    const instance = await WebAssembly.instantiate(wasmModule, { js: { tbl } });

    const callIndirect = instance.exports.callIndirect as Function;

    expect(callIndirect(0)).toEqual(42);
    expect(callIndirect(1)).toEqual(83);
  });

  test("update table", async () => {
    const tbl = new WebAssembly.Table({ initial: 2, element: "anyfunc" });

    const instance = await WebAssembly.instantiate(wasmModule, { js: { tbl } });

    const updateTable = instance.exports.updateTable as Function;

    updateTable();

    // the function that used to return 42 has been replaced with $add
    expect(tbl.get(0)(5, 10)).toEqual(15);
  });

  test("set funcref", async () => {
    const tbl = new WebAssembly.Table({ initial: 2, element: "anyfunc" });

    const instance = await WebAssembly.instantiate(wasmModule, { js: { tbl } });

    const add = instance.exports.add as Function;
    const sub = instance.exports.sub as Function;
    const setFuncref = instance.exports.setFuncref as Function;

    // NOTE: JavaScript functions can't be used a function refs.
    setFuncref(0, add);
    setFuncref(1, sub);

    expect(tbl.get(0)(5, 10)).toEqual(15);
    expect(tbl.get(1)(20, 18)).toEqual(2);
  });

  test("set funcref and then do math inside wasm module", async () => {
    const tbl = new WebAssembly.Table({ initial: 2, element: "anyfunc" });

    const instance = await WebAssembly.instantiate(wasmModule, { js: { tbl } });

    const add = instance.exports.add as Function;
    const sub = instance.exports.sub as Function;
    const doMath = instance.exports.doMath as Function;

    expect(doMath()).toEqual([15, 5]);
  });
});
