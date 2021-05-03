/* eslint-disable no-unused-vars, class-methods-use-this */
import { Component, PureComponent } from 'react';

// Fallback to Component if the current version of React lacks PureComponent
const BaseClass = PureComponent || Component;

class ReactPureComponentUpdate extends BaseClass {
	componentWillMount() {
		this.componentWillMountOrReceiveProps(this.props);
	}

	componentDidMount() {
		this.componentDidMountOrUpdate(this.props, this.state);
	}

	componentWillReceiveProps(nextProps, maybeContext) {
		this.componentWillMountOrReceiveProps(nextProps, maybeContext);
	}

	componentDidUpdate(prevProps, prevState, maybeContext) {
		this.componentDidMountOrUpdate(prevProps, prevState, maybeContext);
	}

	/* istanbul ignore next */
	componentWillMountOrReceiveProps(nextProps, maybeContext) { }

	/* istanbul ignore next */
	componentDidMountOrUpdate(prevProps, prevState, maybeContext) { }
}

export default ReactPureComponentUpdate;
