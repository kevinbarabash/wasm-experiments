;; Proposal: https://github.com/WebAssembly/spec/blob/master/proposals/multi-value/Overview.md
(module
  (memory (export "mem") 1)

  ;; Initializes the WebAssembly Linear Memory with a UTF-8 string of 14 characters starting at offset 64
  (data (i32.const 64) "Goodbye, Mars!")
  
  ;; Returns the base offset and length of the greeting
  (func (export "hello") (result i32 i32)
    (i32.const 64) (i32.const 14)
  )
)