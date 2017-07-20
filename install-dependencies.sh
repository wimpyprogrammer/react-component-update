#!/bin/bash

echo "installing React $REACT_VERSION"

npm install

# Conditionally install dependencies per https://github.com/airbnb/enzyme#installation
if [ ${REACT_VERSION} = "0" ]; then
	npm install react@$REACT_VERSION react-dom@$REACT_VERSION react-addons-test-utils
else
	npm install react@$REACT_VERSION react-dom@$REACT_VERSION react-test-renderer
fi
