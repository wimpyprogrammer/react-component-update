#!/bin/bash

echo "installing React $REACT_VERSION"

npm install

rimraf node_modules/.bin/npm node_modules/.bin/npm.cmd node_modules/react node_modules/react-dom node_modules/react-addons-test-utils node_modules/react-test-renderer
npm prune

npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION

# Conditionally install dependencies per https://github.com/airbnb/enzyme#installation
if [ ${REACT_VERSION} = "0" ]; then
	npm install --no-save react-addons-test-utils
else
	npm install --no-save react-test-renderer
fi

npm ls --depth=0
