#!/bin/bash
set -ev

REACT_VERSION_NORMALIZED=$REACT_VERSION
if [ "${REACT_VERSION:0:2}" = "0." ]; then
	REACT_VERSION_NORMALIZED=${REACT_VERSION:2}
fi

echo "installing React $REACT_VERSION ($REACT_VERSION_NORMALIZED)"
echo "Travis Node Version $TRAVIS_NODE_VERSION"
node --version
npm --version

npm uninstall --no-save react react-dom react-addons-test-utils react-test-renderer enzyme-adapter-react-16
rm -rf node_modules/.bin/npm node_modules/.bin/npm.cmd node_modules/react node_modules/react-dom node_modules/react-addons-test-utils node_modules/react-test-renderer node_modules/enzyme-adapter-react-16
npm prune

# Conditionally install dependencies per https://github.com/airbnb/enzyme#installation
if [ "${REACT_VERSION_NORMALIZED}" = "13" ]; then
	npm install --no-save react@$REACT_VERSION enzyme-adapter-react-$REACT_VERSION_NORMALIZED
elif [ "${REACT_VERSION_NORMALIZED}" = "14" ]; then
	npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION react-addons-test-utils@$REACT_VERSION enzyme-adapter-react-$REACT_VERSION_NORMALIZED
elif [ "${REACT_VERSION_NORMALIZED}" = "15" ]; then
	npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION react-test-renderer@$REACT_VERSION enzyme-adapter-react-$REACT_VERSION_NORMALIZED
else # React 16+
	npm install --no-save react@$REACT_VERSION react-dom@$REACT_VERSION enzyme-adapter-react-$REACT_VERSION_NORMALIZED
fi

npm ls --depth=0
