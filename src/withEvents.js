function noop() {}

/**
 * Intercept calls to nativeFunc and pass the arguments to customWrapperFunc.
 * @param {function=} nativeFunc
 * @param {function} customWrapperFunc
 */
function wrap(nativeFunc = noop, customWrapperFunc) {
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
		componentWillMount: wrap(config.componentWillMount, willMountCustom),
		componentDidMount: wrap(config.componentDidMount, didMountCustom),
		componentWillReceiveProps: wrap(config.componentWillReceiveProps, willReceivePropsCustom),
		componentDidUpdate: wrap(config.componentDidUpdate, didUpdateCustom),
	};
}
