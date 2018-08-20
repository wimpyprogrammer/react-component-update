/* eslint-env jest */
import chai, { expect } from 'chai';
import createReactClass from 'create-react-class';
import dirtyChai from 'dirty-chai';
import { shallow } from 'enzyme';
import uniqueId from 'lodash.uniqueid';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import withEvents from './withEvents';

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

describe('withEvents extension', () => {
	const callbackWill = sandbox.spy();
	const callbackDid = sandbox.spy();

	const TestComponent = createReactClass(withEvents({
		getInitialState: getUniqueState,
		componentWillMountOrReceiveProps: callbackWill,
		componentDidMountOrUpdate: callbackDid,
		render: () => null,
	}));

	const callbackRender = sandbox.spy(TestComponent.prototype, 'render');

	beforeEach(() => {
		component = shallow(<TestComponent {...getUniqueProps()} />);
	});

	afterEach(() => sandbox.reset());

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs on mount with first parameter of component props', () => {
			expect(callbackWill.firstCall).to.have.been.calledWith(component.instance().props);
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
			component.setProps(component.instance().props);
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs on props update with first parameter of component props', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall).to.have.been.calledWith(component.instance().props);
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
			expect(callbackDid.firstCall).to.have.been.calledWith(component.instance().props);
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

		it('runs on props update with first parameter of previous component props', () => {
			const initialProps = component.instance().props;
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

		it('runs on state update with first parameter of previous component props', () => {
			const initialProps = component.instance().props;
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

describe('withEvents extension with overrides', () => {
	const userComponentWillMount = sandbox.spy();
	const userComponentDidMount = sandbox.spy();
	const userComponentWillReceiveProps = sandbox.spy();
	const userComponentDidUpdate = sandbox.spy();

	const callbackWill = sandbox.spy();
	const callbackDid = sandbox.spy();

	const TestComponentWithOverrides = createReactClass(withEvents({
		getInitialState: getUniqueState,
		componentWillMount: userComponentWillMount,
		componentDidMount: userComponentDidMount,
		componentWillReceiveProps: userComponentWillReceiveProps,
		componentDidUpdate: userComponentDidUpdate,
		componentWillMountOrReceiveProps: callbackWill,
		componentDidMountOrUpdate: callbackDid,
		render: () => null,
	}));

	beforeEach(() => {
		component = shallow(<TestComponentWithOverrides {...getUniqueProps()} />);
	});

	afterEach(() => sandbox.reset());

	describe('componentWillMountOrReceiveProps()', () => {
		it('runs once on mount', () => {
			expect(callbackWill).to.have.been.calledOnce();
		});

		it('runs user code in override on mount', () => {
			expect(userComponentWillMount).to.have.been.calledBefore(callbackWill);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackWill).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			component.setProps(getUniqueProps());
			expect(userComponentWillReceiveProps).to.have.been.calledBefore(callbackWill.secondCall);
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
			expect(userComponentDidMount).to.have.been.calledBefore(callbackDid);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on props update', () => {
			component.setProps(getUniqueProps());
			expect(userComponentDidUpdate).to.have.been.calledBefore(callbackDid.secondCall);
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());
			expect(callbackDid).to.have.been.calledTwice();
		});

		it('runs user code in override on state update', () => {
			component.setState(getUniqueState());
			expect(userComponentDidUpdate).to.have.been.calledBefore(callbackDid.secondCall);
		});
	});
});
