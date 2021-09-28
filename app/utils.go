package main

import (
	"encoding/json"
	"fmt"
	"runtime"
	"strings"
	"syscall/js"
)

// s := time.Now().UnixNano() / 1e6
// defer func() {
// 	fmt.Println(time.Now().UnixNano()/1e6 - s)
// }()

func jsConsole(logType string, msgs ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	// js.Global().Get("console").Call(logType, strings.Join([]string{msg, "\n", file, string(line)}, ""))
	js.Global().Get("console").Call(logType, fmt.Sprintf("%s \n%s:%d", fmt.Sprint(msgs...), file, line))
}

// func jsToString(v js.Value) string {
// 	return js.Global().Get("Object").Get("prototype").Get("toString").Call("call", v).String()
// }

func jsJSONStringify(v js.Value, defaultText string) string {
	if v.IsUndefined() {
		return defaultText
	}
	return js.Global().Get("JSON").Call("stringify", v).String()
}

func exportDataToJS(buffer []byte) js.Value {
	dst := js.Global().Get("Uint8Array").New(len(buffer))
	js.CopyBytesToJS(dst, buffer)
	return dst
}

// func as below:
// new Blob([message.data.buffer], {
// 	type: message.type,
// }),
func createObjectURL(data js.Value, dataType string) js.Value {
	buffer := js.Global().Get("Array").New()
	buffer.Call("push", data.Get("buffer"))
	bufferType := js.Global().Get("Object").New()
	bufferType.Set("type", dataType)
	blob := js.Global().Get("Blob").New(buffer, bufferType)
	return js.Global().Get("URL").Call("createObjectURL", blob)
}

func NewResult(dataType string, filename string, data js.Value) map[string]interface{} {
	result := make(map[string]interface{})
	result["type"] = dataType
	result["url"] = createObjectURL(data, dataType)
	result["filename"] = filename
	return result
}

func parserArgs(args []js.Value) ReceiveArgs {
	output := NewReceiveArgs()

	if len(args) == 0 {
		return *output
	}

	tableOptions := TableOptions{}
	err := json.Unmarshal([]byte(jsJSONStringify(args[0].Get("tableOptions"), "{}")), &tableOptions)
	if err != nil {
		jsConsole("error", err.Error())
		return *output
	}
	output.TableOptions = tableOptions

	columns := []Columns{}
	err = json.Unmarshal([]byte(jsJSONStringify(args[0].Get("columns"), "[]")), &columns)
	if err != nil {
		jsConsole("error", err.Error())
		return *output
	}
	output.Columns = columns

	output.Filename = args[0].Get("filename").String()

	dataSource := []Info{}
	err = json.Unmarshal([]byte(jsJSONStringify(args[0].Get("dataSource"), "{}")), &dataSource)
	if err != nil {
		jsConsole("error", err.Error())
		return *output
	}
	output.DataSource = dataSource

	return *output
}

func indexToRuneString(index int) string {
	firstRune := rune(65)
	maxIndex := rune(26)
	stringCollection := []string{}
	for i := 0; i < int(rune(index)/maxIndex); i++ {
		stringCollection = append(stringCollection, string(maxIndex-1+firstRune))
	}
	stringCollection = append(stringCollection, string(rune(index)%maxIndex+firstRune))
	return strings.Join(stringCollection, "")
}

func ceilPostion(col int, row int) string {
	return fmt.Sprintf("%s%d", indexToRuneString(col), row)
}
