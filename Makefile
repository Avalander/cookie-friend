DEST_FILE = cookie-friend.zip

clean:
	rm $(DEST_FILE)

.PHONY: build
build:
	rm -rf build
	npm run build

.PHONY: package
package: clean
	@echo "Adding files to $(DEST_FILE)"
	zip $(DEST_FILE) manifest.json
	zip -r $(DEST_FILE) src
	zip -r $(DEST_FILE) icons
