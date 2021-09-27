package main

import (
	"syscall/js"
)

func main() {
	js.Global().Set("getExcel", Csv())
	select {}
}
