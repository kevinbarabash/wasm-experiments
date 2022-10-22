declare interface WasmFeatures {
  // see: https://github.com/WebAssembly/wabt/blob/main/src/feature.def#L25-L35
  /** Experimental exception handling. */
  exceptions?: boolean;
  /** Import/export mutable globals. */
  mutable_globals?: boolean;
  /** Saturating float-to-int operators. */
  sat_float_to_int?: boolean;
  /** Sign-extension operators. */
  sign_extension?: boolean;
  /** SIMD support. */
  simd?: boolean;
  /** Threading support. */
  threads?: boolean;
  /** Multi-value. */
  multi_value?: boolean;
  /** Tail-call support. */
  tail_call?: boolean;
  /** Bulk-memory operations. */
  bulk_memory?: boolean;
  /** Reference types (externref). */
  reference_types?: boolean;
  /** Custom annotation syntax. */
  annotations?: boolean;
  /** Garbage collection. */
  gc?: boolean;
}
