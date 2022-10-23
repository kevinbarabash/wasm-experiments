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
