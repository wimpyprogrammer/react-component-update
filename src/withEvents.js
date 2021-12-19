function noop() {}

/**
 * Intercept calls to nativeFunc and pass the arguments to customWrapperFunc.
 * @param {function=} nativeFunc
 * @param {function} customWrapperFunc
 */
function wrap(customWrapperFunc, nativeFunc = noop) {
	return function wrappedNativeFunc(...args) {
		customWrapperFunc.call(this, nativeFunc.bind(this), ...args);
	};
}

export default function withEvents(config) {
	function willMountCustom(nativeFunc, ...args) {
		const result = nativeFunc(...args);
		this.componentWillMountOrReceiveProps(this.props);
		return result;
	}

	function didMountCustom(nativeFunc, ...args) {
		const result = nativeFunc(...args);
		this.componentDidMountOrUpdate(this.props, this.state);
		return result;
	}

	function willReceivePropsCustom(nativeFunc, ...args) {
		const result = nativeFunc(...args);
		this.componentWillMountOrReceiveProps(...args);
		return result;
	}

	function didUpdateCustom(nativeFunc, ...args) {
		const result = nativeFunc(...args);
		this.componentDidMountOrUpdate(...args);
		return result;
	}

	return {
		componentWillMountOrReceiveProps: noop,
		componentDidMountOrUpdate: noop,
		...config,
		componentWillMount: wrap(willMountCustom, config.componentWillMount),
		componentDidMount: wrap(didMountCustom, config.componentDidMount),
		componentWillReceiveProps: wrap(willReceivePropsCustom, config.componentWillReceiveProps),
		componentDidUpdate: wrap(didUpdateCustom, config.componentDidUpdate),
	};
}
