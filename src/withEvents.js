import wrap from 'lodash.wrap';

function noop() {}

export default function withEvents(config) {
	function willMountCustom(nativeFunc = noop, ...args) {
		const result = nativeFunc(...args);
		this.componentWillMountOrReceiveProps(this.props);
		return result;
	}

	function didMountCustom(nativeFunc = noop, ...args) {
		const result = nativeFunc(...args);
		this.componentDidMountOrUpdate(this.props, this.state);
		return result;
	}

	function willReceivePropsCustom(nativeFunc = noop, ...args) {
		const result = nativeFunc(...args);
		this.componentWillMountOrReceiveProps(...args);
		return result;
	}

	function didUpdateCustom(nativeFunc = noop, ...args) {
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
