package main

type Result struct {
	Value map[string]interface{}
}

func (r *Result) new(dataType string, filename string, data interface{}) map[string]interface{} {
	r.Value = make(map[string]interface{})
	r.Value["type"] = dataType
	r.Value["data"] = data
	r.Value["filename"] = filename
	return r.Value
}
