identifier=com.luckymarmot.PawExtensions.JSONSchemaFakerDynamicValue
extensions_dir=$(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/

build:
	npm run build
	cp README.md LICENSE ./build/$(identifier)/

clean:
	rm -Rf ./build/

local-copy:
	mkdir -p "$(extensions_dir)$(identifier)/"
	cp -r ./build/$(identifier)/* "$(extensions_dir)$(identifier)/"

local: local-deploy
local-deploy: clean build local-copy


install:
	npm install

test:
	npm test

lint:
	npm run lint

check: test lint

archive: build
	cd ./build/; zip -r JSONSchemaFakerDynamicValue.zip "$(identifier)/"
