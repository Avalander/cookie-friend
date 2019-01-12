DEST_FILE = cookie-friend.zip
SRC_FILE = source-code.zip

clean:
	rm -f $(DEST_FILE)
	rm -f $(SRC_FILE)

.PHONY: build
build:
	rm -rf build
	npm run build

.PHONY: package
package: clean build
	@echo "Adding files to $(DEST_FILE)"
	zip -r $(DEST_FILE) manifest.json src/main.js icons build

.PHONY: package-src
package-src:
	@echo "Adding files to $(SRC_FILE)"
	zip -r $(SRC_FILE) manifest.json package.json package-lock.json webpack.config.js src icons Makefile

.PHONY: package-all
package-all: package package-src
