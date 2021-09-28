exec_path = $(shell go env GOROOT)/misc/wasm/wasm_exec.js
worker_js=./app/worker.js


.ONESHELL:
build-app:
	@GOOS=js GOARCH=wasm go build -o ./public/app.wasm ./app
	@cp ${exec_path} ./public
	@cp ${worker_js} ./public
	

