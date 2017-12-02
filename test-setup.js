/* eslint-disable global-require, import/no-extraneous-dependencies, import/no-unresolved */
const { configure } = require('enzyme');
const reactVersion = require('react').version;

const [majorReactVersion, minorReactVersion] = reactVersion.split('.');
const adapterVersion = (majorReactVersion !== '0') ? majorReactVersion : minorReactVersion;

// eslint-disable-next-line import/no-dynamic-require
const Adapter = require(`enzyme-adapter-react-${adapterVersion}`);

configure({ adapter: new Adapter() });
