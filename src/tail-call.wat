(func $fac (export "factorial") (param $x i64) (result i64)
  (return_call $fac-aux (local.get $x) (i64.const 1))
)

(func $fac-aux (param $x i64) (param $r i64) (result i64)
  (if (i64.eqz (local.get $x))
    (then (return (local.get $r)))
    (else 
      (return_call $fac-aux
        (i64.sub (local.get $x) (i64.const 1))
        (i64.mul (local.get $x) (local.get $r))
      )
    )
  )
  ;; This is required for WebAssembly.compile(buffer) to succeed
  ;; even though flow control never gets here.  Hopefully they can
  ;; fix this issue in the future with better analysis of `return`
  ;; and `return_call` opcodes in the if-else branches.
  (i64.const 0)
)

;; This is unrelated to tail calls.  I was experimenting with if-else.
;; Neither branch can leave anything on the stack so you need to get
;; the result some other way.  In this case we use a local variable, but
;; you could store it on the heap was well if you wanted to.
(func $foo (param $cond i32) (result i32)
  (local $result i32)
  (if (local.get $cond)
    (then (local.set $result (i32.const 0)))
    (else (local.set $result (i32.const 1)))
  )
  local.get $result
)
