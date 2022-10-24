;; Proposal: https://github.com/WebAssembly/reference-types/blob/master/proposals/reference-types/Overview.md
(module
  (import "js" "tbl" (table $tbl 2 funcref))
  (type $retNumSig (func (result i32)))
  (type $binOpSig (func (param i32) (param i32) (result i32)))

  (func $f42 (result i32) i32.const 42)
  (func $f83 (result i32) i32.const 83)

  ;; store these functions the the table
  (elem (i32.const 0) $f42 $f83)

  (func $add (export "add") (param $a i32) (param $b i32) (result i32)
    (i32.add (local.get $a) (local.get $b))
  )
  (func $sub (export "sub") (param $a i32) (param $b i32) (result i32)
    (i32.sub (local.get $a) (local.get $b))
  )

  (func (export "callIndirect") (param i32) (result i32)
    (call_indirect 0 (type $retNumSig) (local.get 0))
  )

  ;; A funcref must be declared before trying to use it
  (global funcref (ref.func $add))
  (func (export "updateTable")
    (table.set $tbl (i32.const 0) (ref.func $add))
  )

  ;; This function can be used to update entries in the $tbl table
  ;; with funcrefs defined within this wasm module.
  ;; NOTE: JavaScript functions can't be used as function refs.
  (func $setFuncref (export "setFuncref") (param $i i32) (param $r funcref)
    (table.set $tbl (local.get $i) (local.get $r))
  )

  (func (export "doMath") (result i32 i32)
    (call $setFuncref (i32.const 0) (ref.func $add))
    (call $setFuncref (i32.const 1) (ref.func $sub))
    
    ;; it's a little weird for the args to be in the middle, but
    ;; $tbl is immediate as is the type sig.  When providing args
    ;; with this syntax they actually end up on the stack in the
    ;; reverse order
    ;; calls $add(5, 10)
    (call_indirect 
      $tbl ;; which table
      (type $binOpSig) ;; type sig
      (i32.const 5)    ;; args
      (i32.const 10)   ;; args
      (i32.const 0)    ;; index of item in table
    )

    ;; this means that you can the same thing in the following way
    ;; calls $sub(10, 5)
    (i32.const 10)   ;; args
    (i32.const 5)    ;; args
    (call_indirect 
      $tbl ;; which table
      (type $binOpSig) ;; type sig
      (i32.const 1)    ;; index of $add
    )
  )
)
