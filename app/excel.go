package main

import (
	"bytes"
	"reflect"
	"strings"
	"syscall/js"
	"text/template"
	"time"

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

		headerTpl := `
		{
			"border":[{
				"type": "left",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "top",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "right",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "bottom",
        "color": "{{.BorderColor}}",
        "style": 1
			}],
			"font":{
				"size":{{.FontSize}},
				"family":"{{.FontFamily}}",
				"color":"{{.Color}}"
			},
			"fill":{
				"type":"pattern",
				"color":["{{.Header.BackgroundColor}}"],
				"pattern":1
			},
			"alignment":{
				"horizontal": "{{.TextAlign}}",
				"vertical": "{{.TextBaseline}}",
				"wrap_text": true
			},
			"protection":{
				"locked":true
			}
		}
		`
		bodyTpl := `
		{
			"border":[{
				"type": "left",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "top",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "right",
        "color": "{{.BorderColor}}",
        "style": 1
			},{
				"type": "bottom",
        "color": "{{.BorderColor}}",
        "style": 1
			}],
			"font":{
				"size":{{.FontSize}},
				"family":"{{.FontFamily}}",
				"color":"{{.Color}}"
			},
			"fill":{
				"type":"pattern",
				"color":["{{.Body.BackgroundColor}}"],
				"pattern":1
			},
			"alignment":{
				"horizontal": "{{.TextAlign}}",
				"vertical": "{{.TextBaseline}}",
				"wrap_text": true
			}
		}
		`
		headerReader := bytes.Buffer{}
		bodeTplReader := bytes.Buffer{}

		headerT, _ := template.New("header-tpl").Parse(headerTpl)
		headerT.Execute(&headerReader, tableOptions)

		headerStyle, _ := f.NewStyle(headerReader.String())

		bodyT, _ := template.New("body-tpl").Parse(bodyTpl)
		bodyT.Execute(&bodeTplReader, tableOptions)

		bodyStyle, _ := f.NewStyle(bodeTplReader.String())

		index := f.NewSheet(filename)

		f.SetCellStyle(filename, ceilPostion(0, 1), ceilPostion(len(columns)-1, 1), headerStyle)
		for k, col := range columns {
			f.SetCellValue(filename, ceilPostion(k, 1), col.Title)
			f.SetRowHeight(filename, 1, float64(tableOptions.RowHeight))
			f.SetColWidth(filename, indexToRuneString(k), indexToRuneString(k), float64(col.Width/4))

		}
		f.SetCellStyle(filename, ceilPostion(0, 2), ceilPostion(len(columns)-1, len(dataSource)+1), bodyStyle)
		for k, row := range dataSource {
			f.SetRowHeight(filename, k+2, float64(tableOptions.RowHeight))
			for i, col := range columns {
				rowReflect := reflect.ValueOf(row)
				value := reflect.Indirect(rowReflect).FieldByName(strings.Title(col.Key))
				if value.IsValid() {
					f.SetCellValue(filename, ceilPostion(i, k+2), value)
					if col.Type == 0 {
						f.SetCellHyperLink(filename, ceilPostion(i, k+2), value.String(), "External")
					}
				}
			}
		}

		f.SetActiveSheet(index)
		f.DeleteSheet("Sheet1")

		f.SetDocProps(&excelize.DocProperties{
			Created:        time.Now().Format(time.RFC3339),
			Creator:        "Mrooze Zeng",
			Description:    "This file created by Mrooze Zeng",
			Identifier:     "xlsx",
			Keywords:       "Spreadsheet",
			LastModifiedBy: "Mrooze Zeng",
			Modified:       time.Now().Format(time.RFC3339),
			Revision:       "0",
			Subject:        filename,
			Title:          filename,
			Language:       js.Global().Get("navigator").Get("language").String(),
			Version:        "1.0.0",
		})

		buf, err := f.WriteToBuffer()

		if err != nil {
			return nil
		}

		dst := exportDataToJS(buf.Bytes())

		return NewResult("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename, dst)
	})
}
