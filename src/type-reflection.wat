;; Proposal: https://github.com/WebAssembly/js-types/blob/main/proposals/js-types/Overview.md
;; 
;; Not much going on in here since the reflection API is actually as JS API.
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    (i32.add (local.get $a) (local.get $b))
  )
)
