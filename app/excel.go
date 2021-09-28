package main

import (
	"reflect"
	"strings"
	"syscall/js"

	"github.com/xuri/excelize/v2"
)

func Excel() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		jsArgs := parserArgs(args)

		dataSource := jsArgs.DataSource
		filename := jsArgs.Filename
		columns := jsArgs.Columns
		tableOptions := jsArgs.TableOptions

		if dataSource == nil || filename == "" || columns == nil || tableOptions == (TableOptions{}) {
			jsConsole("error", "参数错误!")
			return nil
		}

		f := excelize.NewFile()

		// headerStyle, _ := f.NewStyle(`{
		// 	"border":{
		// 		"type":1,
		// 		"color":"#ffffff"
		// 	},
		// 	"font":{
		// 		"size":"16px",
		// 		"color":"#000000"
		// 	},
		// 	"fill":{
		// 		"color":"orange"
		// 	}
		// }`)

		index := f.NewSheet(filename)

		// f.SetColStyle(filename, fmt.Sprintf("%s:%s", indexToRuneString(0), indexToRuneString(len(columns)-1)), headerStyle)

		for k, col := range columns {
			f.SetCellValue(filename, ceilPostion(k, 1), col.Title)
			f.SetRowHeight(filename, 1, float64(tableOptions.RowHeight/2))
		}
		for k, row := range dataSource {
			for i, col := range columns {
				rowReflect := reflect.ValueOf(row)
				value := reflect.Indirect(rowReflect).FieldByName(strings.Title(col.Key))
				if value.IsValid() {
					f.SetCellValue(filename, ceilPostion(i, k+2), value)
					f.SetColWidth(filename, indexToRuneString(i), indexToRuneString(i), float64(col.Width/10))
					f.SetRowHeight(filename, k+2, float64(tableOptions.RowHeight/2))
				}
			}
		}

		f.SetActiveSheet(index)

		buf, err := f.WriteToBuffer()

		if err != nil {
			return nil
		}

		dst := exportDataToJS(buf.Bytes())

		return NewResult("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename, dst)
	})
}
