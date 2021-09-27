package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"syscall/js"
)

type Info struct {
	Id          string `json:"id"`
	Avatar      string `json:"avatar"`
	Province    string `json:"province"`
	City        string `json:"city"`
	Name        string `json:"name"`
	Zipcode     string `json:"zipcode"`
	Age         string `json:"age"`
	Description string `json:"description"`
	Address     string `json:"address"`
}

func Csv() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		var buffer bytes.Buffer
		var res Result
		var dataReceiver []Info

		if len(args) < 2 {
			js.Global().Get("console").Get("error").Invoke(errors.New("参数出错! ").Error())
			return nil
		}

		jsonData := js.Global().Get("JSON").Call("stringify", args[0].JSValue()).String()
		filename := args[1].String()

		eror := json.Unmarshal([]byte(jsonData), &dataReceiver)
		if eror != nil {
			fmt.Println(eror)
			return nil
		}

		var data [][]string

		for _, v := range dataReceiver {
			item := []string{v.Id, v.Avatar, v.Province, v.City, v.Name,
				v.Zipcode, v.Age, v.Description, v.Address}
			data = append(data, item)
		}

		w := csv.NewWriter(&buffer)

		defer w.Flush()

		err := w.WriteAll(data)

		if err != nil {
			return nil
		}

		dst := exportDataToJS(buffer.Bytes())

		return res.new("text/csv", filename, dst)
	})
}
