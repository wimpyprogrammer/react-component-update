#!/bin/bash

echo "installing React $REACT_VERSION"

npm install

npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION

# Conditionally install dependencies per https://github.com/airbnb/enzyme#installation
if [ ${REACT_VERSION} = "0" ]; then
	npm install --no-save react-addons-test-utils
else
	npm install --no-save react-test-renderer
fi
