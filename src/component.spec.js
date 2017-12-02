/* eslint-env jest */
/* eslint-disable react/no-multi-comp */
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { mount } from 'enzyme';
import uniqueId from 'lodash.uniqueid';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Component from './component';

chai.use(dirtyChai);
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
let component;

function getUniqueState() {
	return { [uniqueId('stateVarName')]: uniqueId('stateVarValue') };
}

function getUniqueProps() {
	return { [uniqueId('propName')]: uniqueId('propValue') };
}

describe('Component extension', () => {
	class TestComponent extends Component {
		constructor(props) {
			super(props);
			this.state = getUniqueState();
		}

		render() {
			return null;
		}
	}

	const callbackWill = sandbox.spy(TestComponent.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sandbox.spy(TestComponent.prototype, 'componentDidMountOrUpdate');
	const callbackRender = sandbox.spy(TestComponent.prototype, 'render');

	beforeEach(() => {
		component = mount(<TestComponent {...getUniqueProps()} />);
	});

	afterEach(() => sandbox.reset());

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs on mount with first parameter of component props', () => {
			expect(callbackWill.firstCall).to.have.been.calledWith(component.props());
		});

		it('runs on mount with "this" context of component', () => {
			expect(callbackWill.firstCall).to.have.been.calledOn(component.instance());
		});

		it('runs on mount before render()', () => {
			expect(callbackWill).to.have.been.calledBefore(callbackRender);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs on props update when no props change', () => {
			component.setProps(component.props());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs on props update with first parameter of component props', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledWith(component.props());
		});

		it('runs on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledOn(component.instance());
		});

		it('runs on props update before render()', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledBefore(callbackRender.secondCall);
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());
			expect(callbackWill).to.have.been.calledOnce();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('runs once when mounted', () => {
			expect(callbackDid).to.have.been.calledOnce();
		});

		it('runs on mount with first parameter of component props', () => {
			expect(callbackDid.firstCall).to.have.been.calledWith(component.props());
		});

		it('runs on mount with second parameter of component state', () => {
			expect(callbackDid.firstCall).to.have.been.calledWith(sinon.match.any, component.state());
		});

		it('runs on mount with "this" context of component', () => {
			expect(callbackDid.firstCall).to.have.been.calledOn(component.instance());
		});

		it('runs after render()', () => {
			expect(callbackDid).to.have.been.calledAfter(callbackRender);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on props update when no props change', () => {
			component.setProps(component.props());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on props update with first parameter of previous component props', () => {
			const initialProps = component.props();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledWith(initialProps);
		});

		it('runs on props update with second parameter of previous component state', () => {
			const initialState = component.state();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledWith(sinon.match.any, initialState);
		});

		it('runs on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledOn(component.instance());
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on state update when no state changes', () => {
			component.setState(component.state());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on state update with first parameter of previous component props', () => {
			const initialProps = component.props();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledWith(initialProps);
		});

		it('runs on state update with second parameter of previous component state', () => {
			const initialState = component.state();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledWith(sinon.match.any, initialState);
		});

		it('runs on state update with "this" context of component', () => {
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledOn(component.instance());
		});

		it('runs on props update before render()', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledAfter(callbackRender.secondCall);
		});
	});
});

describe('Component extension with overrides calling super()', () => {
	const userComponentWillMountBefore = sandbox.spy();
	const userComponentWillMountAfter = sandbox.spy();
	const userComponentDidMountBefore = sandbox.spy();
	const userComponentDidMountAfter = sandbox.spy();
	const userComponentWillReceivePropsBefore = sandbox.spy();
	const userComponentWillReceivePropsAfter = sandbox.spy();
	const userComponentDidUpdateBefore = sandbox.spy();
	const userComponentDidUpdateAfter = sandbox.spy();

	class TestComponentWithSuper extends Component {
		componentWillMount() {
			userComponentWillMountBefore();
			super.componentWillMount();
			userComponentWillMountAfter();
		}

		componentDidMount() {
			userComponentDidMountBefore();
			super.componentDidMount();
			userComponentDidMountAfter();
		}

		componentWillReceiveProps() {
			userComponentWillReceivePropsBefore();
			super.componentWillReceiveProps();
			userComponentWillReceivePropsAfter();
		}

		componentDidUpdate() {
			userComponentDidUpdateBefore();
			super.componentDidUpdate();
			userComponentDidUpdateAfter();
		}

		render() {
			return null;
		}
	}

	const callbackWill = sandbox.spy(TestComponentWithSuper.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sandbox.spy(TestComponentWithSuper.prototype, 'componentDidMountOrUpdate');

	beforeEach(() => {
		component = mount(<TestComponentWithSuper {...getUniqueProps()} />);
	});

	afterEach(() => sandbox.reset());

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs user code in override on mount', () => {
			sinon.assert.callOrder(
				userComponentWillMountBefore,
				callbackWill,
				userComponentWillMountAfter,
			);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			component.setProps(getUniqueProps());
			sinon.assert.callOrder(
				userComponentWillReceivePropsBefore,
				callbackWill,
				userComponentWillReceivePropsAfter,
			);
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());
			expect(callbackWill).to.have.been.calledOnce();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('runs once when mounted', () => {
			expect(callbackDid).to.have.been.calledOnce();
		});

		it('runs user code in override on mount', () => {
			sinon.assert.callOrder(
				userComponentDidMountBefore,
				callbackDid,
				userComponentDidMountAfter,
			);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			component.setProps(getUniqueProps());
			sinon.assert.callOrder(
				userComponentDidUpdateBefore,
				callbackDid,
				userComponentDidUpdateAfter,
			);
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on state update', () => {
			component.setState(getUniqueState());
			sinon.assert.callOrder(
				userComponentDidUpdateBefore,
				callbackDid,
				userComponentDidUpdateAfter,
			);
		});
	});
});

describe('Component extension with overrides not calling super()', () => {
	class TestComponentWithoutSuper extends Component {
		componentWillMount() {}
		componentDidMount() {}
		componentWillReceiveProps() {}
		componentDidUpdate() {}

		render() {
			return null;
		}
	}

	const callbackWill = sandbox.spy(TestComponentWithoutSuper.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sandbox.spy(TestComponentWithoutSuper.prototype, 'componentDidMountOrUpdate');

	beforeEach(() => {
		component = mount(<TestComponentWithoutSuper />);
	});

	afterEach(() => sandbox.reset());

	describe('componentWillMountOrReceiveProps()', () => {
		it('does not run on mount', () => {
			expect(callbackWill).not.to.have.been.called();
		});

		it('does not run on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill).not.to.have.been.called();
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());
			expect(callbackWill).not.to.have.been.called();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('does not run when mounted', () => {
			expect(callbackDid).not.to.have.been.called();
		});

		it('does not run on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid).not.to.have.been.called();
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());
			expect(callbackDid).not.to.have.been.called();
		});
	});
});
