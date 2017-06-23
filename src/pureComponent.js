/* eslint-disable no-unused-vars, class-methods-use-this */
import { PureComponent } from 'react';

class ReactPureComponentUpdate extends PureComponent {
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
