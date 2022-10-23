// NOTE: must be run wiht --experimental-wasm-return_call
// The reason why this isn't a test case is that vitest doesn't pass node
// flags through to the worker processes it spins up to actually run the
// tests.
import { compileWat } from "./compile-wat.mjs";

const watPath = new URL("./tail-call.wat", import.meta.url).pathname;
const { buffer } = await compileWat(watPath);
const wasmModule = await WebAssembly.compile(buffer);
const instance = await WebAssembly.instantiate(wasmModule, {});

const factorial = instance.exports.factorial;
// This demonstrates BigInt/64-bit interop
console.log(`10! = ${factorial(BigInt(10))}`);
console.log(`20! = ${factorial(BigInt(20))}`);
console.log(`30! = ${factorial(BigInt(30))}`); // This result is incorrect
