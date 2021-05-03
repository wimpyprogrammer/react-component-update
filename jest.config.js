module.exports = {
	clearMocks: true,
	collectCoverageFrom: [
		'src/**/!(*.spec).js',
	],
	collectCoverage: true,
	setupFilesAfterEnv: [
		'<rootDir>/test-shims.js',
		'<rootDir>/test-setup.js',
		'jest-extended',
	],
	testEnvironment: 'node',
	testMatch: [
		'**/src/*.spec.js?(x)',
	],
	verbose: true,
};
