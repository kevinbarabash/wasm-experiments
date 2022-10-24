;; https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/Exceptions.md
(module
  ;; Import tag that will be referred to here as $tagname
  (import "extMod" "extTag" (tag $extTag (param i32)))
  (import "extMod" "throwExtTag" (func $throwExtTag (param i32)))

  ;; Internal tag for throwing an exception
  ;; JavaScript can catch these exceptions, but can't access the
  ;; payload.
  (tag $e1)

  (func (export "tryCatch") (result i32)
    (try (result i32)
      (do (throw $e1))
      (catch $e1 (i32.const 1))
    )
  )

  ;; `justThrow` throws i32 param as a $tagname exception
  (func (export "justThrow") (result i32)
    (throw $extTag (i32.const 5))
  )

  (func (export "catchAndReturn") (result i32)
    (try (result i32)
      (do 
        ;; Call a function that throws
        (call $throwExtTag (i32.const 23))
        ;; 100 is the value we would've return if $throwExtTag
        ;; didn't throw
        i32.const 100
      )
      ;; Since $extTag has a single param, that param gets put
      ;; on the stack when we catch it
      (catch $extTag)
    )
  )  
)
