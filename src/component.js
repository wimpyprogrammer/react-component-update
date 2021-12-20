/* eslint-disable no-unused-vars, class-methods-use-this */
import { Component } from 'react';

class ReactComponentUpdate extends Component {
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

export default ReactComponentUpdate;
