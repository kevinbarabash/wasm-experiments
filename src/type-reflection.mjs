// NOTE: must be run wiht --experimental-wasm-type_reflection
// The reason why this isn't a test case is that vitest doesn't pass node
// flags through to the worker processes it spins up to actually run the
// tests.
import { compileWat } from "./compile-wat.mjs";

const watPath = new URL("./type-reflection.wat", import.meta.url).pathname;
const { buffer } = await compileWat(watPath);
const wasmModule = await WebAssembly.compile(buffer);
const instance = await WebAssembly.instantiate(wasmModule, {});

const add = instance.exports.add;

const type = WebAssembly.Function.type(add);
console.log(`add's type is ${JSON.stringify(type)}`);
