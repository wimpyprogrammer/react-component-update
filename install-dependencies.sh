#!/bin/bash
set -ev

echo "installing React $REACT_VERSION"
echo "Travis Node Version $TRAVIS_NODE_VERSION"
node --version
npm --version

npm uninstall --no-save react react-dom react-addons-test-utils react-test-renderer
rm -rf node_modules/.bin/npm node_modules/.bin/npm.cmd node_modules/react node_modules/react-dom node_modules/react-addons-test-utils node_modules/react-test-renderer
npm prune

npm install

# Conditionally install dependencies per https://github.com/airbnb/enzyme#installation
if [ "${REACT_VERSION:0:2}" = "0." ]; then
	npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION react-addons-test-utils@$REACT_VERSION
else
	npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION react-test-renderer@$REACT_VERSION
fi

npm ls --depth=0
