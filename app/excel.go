package main

import (
	"fmt"
	"reflect"
	"strings"
	"syscall/js"
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

		borderLeftStyle := excelize.Border{
			Type:  "left",
			Color: tableOptions.BorderColor,
			Style: 1,
		}
		borderTopStyle := excelize.Border{
			Type:  "top",
			Color: tableOptions.BorderColor,
			Style: 1,
		}
		borderRightStyle := excelize.Border{
			Type:  "right",
			Color: tableOptions.BorderColor,
			Style: 1,
		}
		borderBottomStyle := excelize.Border{
			Type:  "bottom",
			Color: tableOptions.BorderColor,
			Style: 1,
		}
		fontStyle := excelize.Font{
			Size:   tableOptions.FontSize,
			Family: tableOptions.FontFamily,
			Color:  tableOptions.Color,
		}
		headerFillStyle := excelize.Fill{
			Type:    "pattern",
			Color:   []string{tableOptions.Header.BackgroundColor},
			Pattern: 1,
		}
		bodyFillStyle := excelize.Fill{
			Type:    "pattern",
			Color:   []string{tableOptions.Body.BackgroundColor},
			Pattern: 1,
		}
		alignmentStyle := excelize.Alignment{
			Horizontal: tableOptions.TextAlign,
			Vertical:   tableOptions.TextBaseline,
			WrapText:   true,
		}
		protectionStyle := excelize.Protection{
			Locked: true,
		}

		f := excelize.NewFile()

		sheetName := "Sheet1"

		headerStyle, _ := f.NewStyle(&excelize.Style{
			Border: []excelize.Border{
				borderLeftStyle, borderTopStyle, borderRightStyle, borderBottomStyle,
			},
			Font:       &fontStyle,
			Fill:       headerFillStyle,
			Alignment:  &alignmentStyle,
			Protection: &protectionStyle,
		})

		bodyStyle, _ := f.NewStyle(&excelize.Style{
			Border: []excelize.Border{
				borderLeftStyle, borderTopStyle, borderRightStyle, borderBottomStyle,
			},
			Font:       &fontStyle,
			Fill:       bodyFillStyle,
			Alignment:  &alignmentStyle,
			Protection: &protectionStyle,
		})

		fixedLastIndex := 0

		f.SetCellStyle(sheetName, ceilAxis(0, 1), ceilAxis(len(columns)-1, 1), headerStyle)
		f.SetRowHeight(sheetName, 1, float64(tableOptions.RowHeight))
		for k, col := range columns {
			if col.Fixed {
				fixedLastIndex = k
			}
			f.SetCellValue(sheetName, ceilAxis(k, 1), col.Title)
			f.SetColWidth(sheetName, indexToRuneString(k), indexToRuneString(k), float64(col.Width/4))

		}
		f.SetCellStyle(sheetName, ceilAxis(0, 2), ceilAxis(len(columns)-1, len(dataSource)+1), bodyStyle)
		for k, row := range dataSource {
			f.SetRowHeight(sheetName, k+2, float64(tableOptions.RowHeight))
			for i, col := range columns {
				rowReflect := reflect.ValueOf(row)
				value := reflect.Indirect(rowReflect).FieldByName(strings.Title(col.Key))
				if value.IsValid() {
					f.SetCellValue(sheetName, ceilAxis(i, k+2), value)
					if col.Type == 0 {
						f.SetCellHyperLink(sheetName, ceilAxis(i, k+2), value.String(), "External")
					}
				}
			}
		}

		if err := f.SetSheetViewOptions(sheetName, 0, excelize.ShowGridLines(false)); err != nil {
			jsConsole("error", err.Error())
			return nil
		}

		panes := `{
			"freeze": true,
			"split": false,
			"x_split": {{x_split}},
			"y_split": 1,
			"top_left_cell": "{{top_left_cell}}",
			"active_pane": "topRight",
			"panes": [
				{
						"sqref": "{{sqref}}",
						"active_cell": "{{sqref}}",
						"pane": "topRight"
				}
			]}`
		panes = strings.ReplaceAll(panes, "{{x_split}}", fmt.Sprint(fixedLastIndex+1))
		panes = strings.ReplaceAll(panes, "{{top_left_cell}}", ceilAxis(fixedLastIndex+1, 2))
		panes = strings.ReplaceAll(panes, "{{sqref}}", ceilAxis(len(columns)-1, len(dataSource)+1))
		f.SetPanes(sheetName, panes)

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

		f.SetSheetName(sheetName, filename)

		buf, err := f.WriteToBuffer()

		if err != nil {
			jsConsole("error", err.Error())
			return nil
		}

		dst := exportDataToJS(buf.Bytes())

		return NewResult("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename, dst)
	})
}
