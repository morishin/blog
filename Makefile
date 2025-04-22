all: build

build: install
	yarn build

format: install
	yarn prettier --write .

install:
	yarn install

lint: install
	yarn eslint ./src

serve: install
	yarn next dev

typecheck: install
	yarn tsc --noEmit --watch
