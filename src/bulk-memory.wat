;; Proposal: https://github.com/WebAssembly/bulk-memory-operations/blob/master/proposals/bulk-memory-operations/Overview.md
(module
  (memory (export "mem") 1)
  (data (i32.const 0) "hello")   ;; data segment 0, is active so always copied
  (data "goodbye")               ;; data segment 1, is passive

  (func (export "fill") (param $dst i32) (param $value i32) (param $size i32)
    (memory.fill (local.get $dst) (local.get $value) (local.get $size))
  )

  (func (export "copy") (param $dst i32) (param $src i32) (param $size i32)
    (memory.copy (local.get $dst) (local.get $src) (local.get $size))
  )

  ;; copies data from the a data segment into memory
  (func (export "init")
    ;; [dst, src, len]
    (memory.init 1
      (i32.const 16)    ;; target offset
      (i32.const 0)     ;; source offset
      (i32.const 7))    ;; length
  )
)
