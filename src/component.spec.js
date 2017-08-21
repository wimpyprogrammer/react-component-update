/* eslint-env jest */
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

		it('runs on props update when no props change', () => {
			const component = mount(<TestComponent {...getUniqueProps()} />);
			component.setProps(component.props());
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

		it('runs on state update when no state changes', () => {
			const component = mount(<TestComponent />);
			component.setState(component.state());
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
