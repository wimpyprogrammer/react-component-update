module.exports = {
	collectCoverageFrom: [
		'src/**/!(*.spec).js',
	],
	collectCoverage: true,
	setupFiles: [
		'<rootDir>/test-shims.js',
		'<rootDir>/test-setup.js',
	],
	testMatch: [
		'**/src/*.spec.js?(x)',
	],
	verbose: true,
};
