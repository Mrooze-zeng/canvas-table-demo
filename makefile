tiny_exec_path = $(shell tinygo env TINYGOROOT)/targets/wasm_exec.js
exec_path = $(shell go env GOROOT)/misc/wasm/wasm_exec.js
worker_js=./app/worker.js


.ONESHELL:
build-app:
	@GOOS=js GOARCH=wasm go build -o ./public/app.wasm ./app
	@cp ${exec_path} ./public
	@cp ${worker_js} ./public
	

.ONESHELL:
build-tiny:
	@GOOS=js GOARCH=wasm tinygo build -o ./public/app.wasm -target wasm ./app
	@cp ${tiny_exec_path} ./public
	@cp ${worker_js} ./public
