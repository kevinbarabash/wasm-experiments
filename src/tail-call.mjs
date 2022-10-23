// NOTE: must be run wiht --experimental-wasm-return_call
// The reason why this isn't a test case is that vitest doesn't pass node
// flags through to the worker processes it spins up to actually run the
// tests.
import { readFileSync } from "fs";
import initWabt from "wabt";

const defaultWabtOptions = {
  exceptions: true,
  mutable_globals: true,
  sat_float_to_int: true,
  sign_extension: true,
  simd: true,
  threads: true,
  multi_value: true,
  bulk_memory: true,
  reference_types: true,
  annotations: true,
  gc: true,
  tail_call: true,
};

export async function compileWat(watPath, optionsOverrides = {}) {
  const wabt = await initWabt();
  return wabt
    .parseWat(watPath, readFileSync(watPath, "utf8"), {
      ...defaultWabtOptions,
      ...optionsOverrides,
    })
    .toBinary({ write_debug_names: true });
}

async function main() {
  const watPath = new URL("./tail-call.wat", import.meta.url).pathname;
  const { buffer } = await compileWat(watPath);
  const wasmModule = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(wasmModule, {});

  const factorial = instance.exports.factorial;
  // This demonstrates BigInt/64-bit interop
  console.log(`10! = ${factorial(BigInt(10))}`);
  console.log(`20! = ${factorial(BigInt(20))}`);
  console.log(`30! = ${factorial(BigInt(30))}`); // This result is incorrect
}

main().then(() => console.log("done"));
