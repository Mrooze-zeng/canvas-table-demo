package main

import (
	"syscall/js"
)

func main() {
	js.Global().Set("getCsv", Csv())
	js.Global().Set("getExcel", Excel())
	select {}
}
