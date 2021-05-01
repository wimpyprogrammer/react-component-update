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

	componentWillReceiveProps(nextProps) {
		this.componentWillMountOrReceiveProps(nextProps);
	}

	componentDidUpdate(prevProps, prevState) {
		this.componentDidMountOrUpdate(prevProps, prevState);
	}

	componentWillMountOrReceiveProps(nextProps) {}

	componentDidMountOrUpdate(prevProps, prevState) {}
}

export default ReactPureComponentUpdate;
