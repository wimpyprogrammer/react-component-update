/* eslint-env jest */
/* eslint-disable react/no-multi-comp */
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { mount } from 'enzyme';
import uniqueId from 'lodash.uniqueid';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(dirtyChai);
chai.use(sinonChai);

function getUniqueState() {
	return { [uniqueId('stateVarName')]: uniqueId('stateVarValue') };
}

function getUniqueProps() {
	return { [uniqueId('propName')]: uniqueId('propValue') };
}

// Skip these tests if the current version of React does not define PureComponent.
const descriptor = React.PureComponent ? describe : describe.skip;

descriptor('PureComponent extension', () => {
	const { default: PureComponent } = require('./pureComponent'); // eslint-disable-line global-require

	class TestComponent extends PureComponent {
		constructor(props) {
			super(props);
			this.state = getUniqueState();
		}

		render() {
			return null;
		}
	}

	const callbackWill = sinon.spy(TestComponent.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sinon.spy(TestComponent.prototype, 'componentDidMountOrUpdate');
	const callbackRender = sinon.spy(TestComponent.prototype, 'render');

	afterEach(() => {
		callbackWill.reset();
		callbackDid.reset();
		callbackRender.reset();
	});

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			mount(<TestComponent />);
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs on mount with first parameter of component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			expect(callbackWill.firstCall).to.have.been.calledWith(component.props());
		});

		it('runs on mount with "this" context of component', () => {
			const component = mount(<TestComponent />);
			expect(callbackWill.firstCall).to.have.been.calledOn(component.getNode());
		});

		it('runs on mount before render()', () => {
			mount(<TestComponent />);
			expect(callbackWill).to.have.been.calledBefore(callbackRender);
		});

		it('runs on props update', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs on props update when no props change', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			component.setProps(component.props());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs on props update with first parameter of component props', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledWith(component.props());
		});

		it('runs on props update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledOn(component.getNode());
		});

		it('runs on props update before render()', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledBefore(callbackRender.secondCall);
		});

		it('does not run on state update', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackWill).to.have.been.calledOnce();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('runs once when mounted', () => {
			mount(<TestComponent />);
			expect(callbackDid).to.have.been.calledOnce();
		});

		it('runs on mount with first parameter of component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			expect(callbackDid.firstCall).to.have.been.calledWith(component.props());
		});

		it('runs on mount with second parameter of component state', () => {
			const component = mount(<TestComponent />);
			expect(callbackDid.firstCall).to.have.been.calledWith(sinon.match.any, component.state());
		});

		it('runs on mount with "this" context of component', () => {
			const component = mount(<TestComponent />);
			expect(callbackDid.firstCall).to.have.been.calledOn(component.getNode());
		});

		it('runs after render()', () => {
			mount(<TestComponent />);
			expect(callbackDid).to.have.been.calledAfter(callbackRender);
		});

		it('runs on props update', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on props update with first parameter of previous component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialProps = component.props();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledWith(initialProps);
		});

		it('runs on props update with second parameter of previous component state', () => {
			const component = mount(<TestComponent />);
			const initialState = component.state();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledWith(sinon.match.any, initialState);
		});

		it('runs on props update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledOn(component.getNode());
		});

		it('runs on state update', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs on state update with first parameter of previous component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialProps = component.props();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledWith(initialProps);
		});

		it('runs on state update with second parameter of previous component state', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialState = component.state();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledWith(sinon.match.any, initialState);
		});

		it('runs on state update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackDid.secondCall).to.have.been.calledOn(component.getNode());
		});

		it('runs on props update before render()', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall).to.have.been.calledAfter(callbackRender.secondCall);
		});
	});
});

descriptor('PureComponent extension with overrides calling super()', () => {
	const { default: PureComponent } = require('./pureComponent'); // eslint-disable-line global-require

	const userComponentWillMountBefore = sinon.spy();
	const userComponentWillMountAfter = sinon.spy();
	const userComponentDidMountBefore = sinon.spy();
	const userComponentDidMountAfter = sinon.spy();
	const userComponentWillReceivePropsBefore = sinon.spy();
	const userComponentWillReceivePropsAfter = sinon.spy();
	const userComponentDidUpdateBefore = sinon.spy();
	const userComponentDidUpdateAfter = sinon.spy();

	class TestComponentWithSuper extends PureComponent {
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

	const callbackWill = sinon.spy(TestComponentWithSuper.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sinon.spy(TestComponentWithSuper.prototype, 'componentDidMountOrUpdate');

	afterEach(() => {
		const allSpies = [
			userComponentWillMountBefore, userComponentWillMountAfter,
			userComponentDidMountBefore, userComponentDidMountAfter,
			userComponentWillReceivePropsBefore, userComponentWillReceivePropsAfter,
			userComponentDidUpdateBefore, userComponentDidUpdateAfter,
			callbackWill, callbackDid,
		];
		allSpies.forEach(spy => spy.reset());
	});

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			mount(<TestComponentWithSuper />);
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs user code in override on mount', () => {
			mount(<TestComponentWithSuper />);
			sinon.assert.callOrder(
				userComponentWillMountBefore, callbackWill, userComponentWillMountAfter,
			);
		});

		it('runs on props update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setProps(getUniqueProps());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setProps(getUniqueProps());
			sinon.assert.callOrder(
				userComponentWillReceivePropsBefore, callbackWill, userComponentWillReceivePropsAfter,
			);
		});

		it('does not run on state update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setState(getUniqueState());
			expect(callbackWill).to.have.been.calledOnce();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('runs once when mounted', () => {
			mount(<TestComponentWithSuper />);
			expect(callbackDid).to.have.been.calledOnce();
		});

		it('runs user code in override on mount', () => {
			mount(<TestComponentWithSuper />);
			sinon.assert.callOrder(
				userComponentDidMountBefore, callbackDid, userComponentDidMountAfter,
			);
		});

		it('runs on props update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setProps(getUniqueProps());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			const component = mount(<TestComponentWithSuper {...getUniqueProps()} />);
			component.setProps(getUniqueProps());
			sinon.assert.callOrder(
				userComponentDidUpdateBefore, callbackDid, userComponentDidUpdateAfter,
			);
		});

		it('runs on state update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setState(getUniqueState());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on state update', () => {
			const component = mount(<TestComponentWithSuper />);
			component.setState(getUniqueState());
			sinon.assert.callOrder(
				userComponentDidUpdateBefore, callbackDid, userComponentDidUpdateAfter,
			);
		});
	});
});

descriptor('Component extension with overrides not calling super()', () => {
	const { default: PureComponent } = require('./pureComponent'); // eslint-disable-line global-require

	class TestComponentWithoutSuper extends PureComponent {
		componentWillMount() {}
		componentDidMount() {}
		componentWillReceiveProps() {}
		componentDidUpdate() {}

		render() {
			return null;
		}
	}

	const callbackWill = sinon.spy(TestComponentWithoutSuper.prototype, 'componentWillMountOrReceiveProps');
	const callbackDid = sinon.spy(TestComponentWithoutSuper.prototype, 'componentDidMountOrUpdate');

	afterEach(() => {
		callbackWill.reset();
		callbackDid.reset();
	});

	describe('componentWillMountOrReceiveProps()', () => {
		it('does not run on mount', () => {
			mount(<TestComponentWithoutSuper />);
			expect(callbackWill).not.to.have.been.called();
		});

		it('does not run on props update', () => {
			const component = mount(<TestComponentWithoutSuper />);
			component.setProps(getUniqueProps());
			expect(callbackWill).not.to.have.been.called();
		});

		it('does not run on state update', () => {
			const component = mount(<TestComponentWithoutSuper />);
			component.setState(getUniqueState());
			expect(callbackWill).not.to.have.been.called();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('does not run when mounted', () => {
			mount(<TestComponentWithoutSuper />);
			expect(callbackDid).not.to.have.been.called();
		});

		it('does not run on props update', () => {
			const component = mount(<TestComponentWithoutSuper />);
			component.setProps(getUniqueProps());
			expect(callbackDid).not.to.have.been.called();
		});

		it('does not run on state update', () => {
			const component = mount(<TestComponentWithoutSuper />);
			component.setState(getUniqueState());
			expect(callbackDid).not.to.have.been.called();
		});
	});
});
