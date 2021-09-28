package main

import (
	"bytes"
	"encoding/csv"
	"syscall/js"
)

func Csv() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		var buffer bytes.Buffer
		var data [][]string

		jsArgs := parserArgs(args)

		dataSource := jsArgs.DataSource
		filename := jsArgs.Filename

		if dataSource == nil || filename == "" {
			jsConsole("error", "参数错误!")
			return nil
		}

		for _, v := range dataSource {
			item := []string{
				v.Id,
				v.Avatar,
				v.Province,
				v.City,
				v.Name,
				v.Zipcode,
				v.Age,
				v.Description,
				v.Address,
			}
			data = append(data, item)
		}

		w := csv.NewWriter(&buffer)

		defer w.Flush()

		if err := w.WriteAll(data); err != nil {
			jsConsole("error", err.Error())
			return nil
		}

		dst := exportDataToJS(buffer.Bytes())
		return NewResult("text/csv", filename, dst)
	})
}
