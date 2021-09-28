package main

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

type Columns struct {
	Title string `json:"title"`
	Width int    `json:"width"`
	Type  int    `json:"type"`
	Key   string `json:"key"`
	Fixed bool   `json:"fixed"`
}

type RowOptions struct {
	BackgroundColor string `json:"backgroundColor"`
}

type TableOptions struct {
	BorderLineWidth int        `json:"borderLineWidth"`
	BorderColor     string     `json:"borderColor"`
	RowHeight       int        `json:"rowHeight"`
	FontFamily      string     `json:"fontFamily"`
	TextAlign       string     `json:"textAlign"`
	TextBaseline    string     `json:"textBaseline"`
	FontSize        float64    `json:"fontSize"`
	Color           string     `json:"color"`
	Header          RowOptions `json:"header`
	Body            RowOptions `json:"body`
}

type ReceiveArgs struct {
	DataSource []Info
	Columns    []Columns
	Filename   string
	TableOptions
}

func NewReceiveArgs() *ReceiveArgs {
	return &ReceiveArgs{
		DataSource:   nil,
		Columns:      nil,
		Filename:     "",
		TableOptions: TableOptions{},
	}
}
