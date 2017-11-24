/* eslint-disable global-require, import/no-extraneous-dependencies, import/no-unresolved */
const configure = require('enzyme').configure;

let Adapter;

[16, 15, 14, 13].forEach((adapterVersion) => {
	if (Adapter) return;

	try {
		// eslint-disable-next-line import/no-dynamic-require
		Adapter = require(`enzyme-adapter-react-${adapterVersion}`);
		// eslint-disable-next-line no-console
		console.log(`Using enzyme adapter ${adapterVersion}`);
	} catch (ex) {
		// Ignore failure, try the next version
	}
});

configure({ adapter: new Adapter() });
