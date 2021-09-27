package main

import "syscall/js"

func exportDataToJS(buffer []byte) js.Value {
	dst := js.Global().Get("Uint8Array").New(len(buffer))
	js.CopyBytesToJS(dst, buffer)
	return dst
}
