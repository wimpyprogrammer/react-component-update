/* eslint-env jest */
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { mount } from 'enzyme';
import uniqueId from 'lodash.uniqueid';
import React from 'react';
import sinon from 'sinon';

import Component from './component';

chai.use(dirtyChai);

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
			expect(callbackWill.calledOnce).to.be.true();
		});

		it('runs on mount with first parameter of component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			expect(callbackWill.firstCall.args[0]).to.equal(component.props());
		});

		it('runs on mount with "this" context of component', () => {
			const component = mount(<TestComponent />);
			expect(callbackWill.firstCall.thisValue).to.equal(component.getNode());
		});

		it('runs on mount before render()', () => {
			mount(<TestComponent />);
			expect(callbackWill.calledBefore(callbackRender)).to.be.true();
		});

		it('runs on props update', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.calledTwice).to.be.true();
		});

		it('runs on props update when no props change', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			component.setProps(component.props());
			expect(callbackWill.calledTwice).to.be.true();
		});

		it('runs on props update with first parameter of component props', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall.args[0]).to.equal(component.props());
		});

		it('runs on props update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall.thisValue).to.equal(component.getNode());
		});

		it('runs on props update before render()', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackWill.secondCall.calledBefore(callbackRender.secondCall)).to.be.true();
		});

		it('does not run on state update', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackWill.calledOnce).to.be.true();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		it('runs once when mounted', () => {
			mount(<TestComponent />);
			expect(callbackDid.calledOnce).to.be.true();
		});

		it('runs on mount with first parameter of component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			expect(callbackDid.firstCall.args[0]).to.equal(component.props());
		});

		it('runs on mount with second parameter of component state', () => {
			const component = mount(<TestComponent />);
			expect(callbackDid.firstCall.args[1]).to.equal(component.state());
		});

		it('runs on mount with "this" context of component', () => {
			const component = mount(<TestComponent />);
			expect(callbackDid.firstCall.thisValue).to.equal(component.getNode());
		});

		it('runs after render()', () => {
			mount(<TestComponent />);
			expect(callbackDid.calledAfter(callbackRender)).to.be.true();
		});

		it('runs on props update', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid.calledTwice).to.be.true();
		});

		it('runs on props update when no props change', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			component.setProps(component.props());
			expect(callbackDid.calledTwice).to.be.true();
		});

		it('runs on props update with first parameter of previous component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialProps = component.props();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall.args[0]).to.equal(initialProps);
		});

		it('runs on props update with second parameter of previous component state', () => {
			const component = mount(<TestComponent />);
			const initialState = component.state();
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall.args[1]).to.equal(initialState);
		});

		it('runs on props update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall.thisValue).to.equal(component.getNode());
		});

		it('runs on state update', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackDid.calledTwice).to.be.true();
		});

		it('runs on state update when no state changes', () => {
			const component = mount(<TestComponent />);
			component.setState(component.state());
			expect(callbackDid.calledTwice).to.be.true();
		});

		it('runs on state update with first parameter of previous component props', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialProps = component.props();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall.args[0]).to.equal(initialProps);
		});

		it('runs on state update with second parameter of previous component state', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			const initialState = component.state();
			component.setState(getUniqueState());
			expect(callbackDid.secondCall.args[1]).to.equal(initialState);
		});

		it('runs on state update with "this" context of component', () => {
			const component = mount(<TestComponent />);
			component.setState(getUniqueState());
			expect(callbackDid.secondCall.thisValue).to.equal(component.getNode());
		});

		it('runs on props update before render()', () => {
			const component = mount(<TestComponent />);
			component.setProps(getUniqueProps());
			expect(callbackDid.secondCall.calledAfter(callbackRender.secondCall)).to.be.true();
		});
	});
});
