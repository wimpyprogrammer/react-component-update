import createReactClass from 'create-react-class';
import { shallow } from 'enzyme';
import React from 'react';

import withEvents from './withEvents';

let counter = 0;
const uniqueId = (prefix) => prefix + counter++;

function getUniqueState() {
	return { [uniqueId('stateVarName')]: uniqueId('stateVarValue') };
}

function getUniqueProps() {
	return { [uniqueId('propName')]: uniqueId('propValue') };
}

// In React <16, context is an undocumented parameter passed to componentWillReceiveProps()
const hasContextParameter = React.version.split('.')[0] < 16;

describe('withEvents extension', () => {
	let component;

	const TestComponent = createReactClass(withEvents({
		getInitialState: getUniqueState,
		componentWillMountOrReceiveProps: jest.fn().mockReturnThis(),
		componentDidMountOrUpdate: jest.fn().mockReturnThis(),
		render: jest.fn().mockReturnValue(null),
	}));

	beforeEach(() => {
		component = shallow(<TestComponent {...getUniqueProps()} />);
	});

	describe('componentWillMountOrReceiveProps()', () => {
		const { componentWillMountOrReceiveProps, render } = TestComponent.prototype;

		it('runs once on mount', () => {
			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});

		it('runs on mount with first parameter of component props', () => {
			const { props } = component.instance();
			expect(componentWillMountOrReceiveProps).toHaveBeenNthCalledWith(1, props);
		});

		it('runs on mount with "this" context of component', () => {
			expect(componentWillMountOrReceiveProps).toHaveNthReturnedWith(1, component.instance());
		});

		it('runs on mount before render()', () => {
			expect(componentWillMountOrReceiveProps).toHaveBeenCalledBefore(render);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(2);
		});

		it('runs on props update when no props change', () => {
			component.setProps(component.instance().props);

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(2);
		});

		it('runs on props update with first parameter of component props', () => {
			component.setProps(getUniqueProps());

			const context = {};
			const { props } = component.instance();
			expect(componentWillMountOrReceiveProps).toHaveBeenNthCalledWith(2, props, context);
		});

		it('runs on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).toHaveNthReturnedWith(2, component.instance());
		});

		it('runs on props update before render()', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledBefore(render);
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		const { componentDidMountOrUpdate, render } = TestComponent.prototype;

		it('runs once when mounted', () => {
			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(1);
		});

		it('receives component props and component state on mount', () => {
			expect(componentDidMountOrUpdate)
				.toHaveBeenNthCalledWith(1, component.instance().props, component.state());
		});

		it('runs on mount with "this" context of component', () => {
			expect(componentDidMountOrUpdate).toHaveNthReturnedWith(1, component.instance());
		});

		it('runs after render()', () => {
			expect(componentDidMountOrUpdate).toHaveBeenCalledAfter(render);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('receives previous component props and state on props update', () => {
			const initialProps = component.instance().props;
			const initialState = component.state();
			component.setProps(getUniqueProps());

			const context = hasContextParameter ? {} : undefined;
			expect(componentDidMountOrUpdate)
				.toHaveBeenNthCalledWith(2, initialProps, initialState, context);
		});

		it('runs on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).toHaveNthReturnedWith(2, component.instance());
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('receives previous component props and state on state update', () => {
			const initialProps = component.instance().props;
			const initialState = component.state();
			component.setState(getUniqueState());

			if (hasContextParameter) {
				expect(componentDidMountOrUpdate)
					.toHaveBeenNthCalledWith(2, initialProps, initialState, {});
			} else {
				expect(componentDidMountOrUpdate)
					.toHaveBeenNthCalledWith(2, initialProps, initialState);
			}
		});

		it('runs on state update with "this" context of component', () => {
			component.setState(getUniqueState());

			expect(componentDidMountOrUpdate).toHaveNthReturnedWith(2, component.instance());
		});

		it('runs on props update before render()', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).toHaveBeenCalledAfter(render);
		});
	});
});

describe('withEvents extension with overrides', () => {
	let component;
	const userComponentWillMount = jest.fn().mockReturnThis();
	const userComponentWillReceiveProps = jest.fn().mockReturnThis();
	const userComponentDidMount = jest.fn().mockReturnThis();
	const userComponentDidUpdate = jest.fn().mockReturnThis();

	const TestComponentWithOverrides = createReactClass(withEvents({
		getInitialState: getUniqueState,
		componentWillMount: userComponentWillMount,
		componentDidMount: userComponentDidMount,
		componentWillReceiveProps: userComponentWillReceiveProps,
		componentDidUpdate: userComponentDidUpdate,
		componentWillMountOrReceiveProps: jest.fn(),
		componentDidMountOrUpdate: jest.fn(),
		render: () => null,
	}));

	beforeEach(() => {
		component = shallow(<TestComponentWithOverrides {...getUniqueProps()} />);
	});

	describe('componentWillMountOrReceiveProps()', () => {
		const { componentWillMountOrReceiveProps } = TestComponentWithOverrides.prototype;

		it('runs once on mount', () => {
			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});

		it('runs user code in override on mount', () => {
			expect(userComponentWillMount).toHaveBeenCalledBefore(componentWillMountOrReceiveProps);
		});

		it('runs user code in override on mount with "this" context of component', () => {
			expect(userComponentWillMount).toHaveNthReturnedWith(1, component.instance());
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on props update', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(userComponentWillReceiveProps)
				.toHaveBeenCalledBefore(componentWillMountOrReceiveProps);
		});

		it('runs user code in override on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());

			expect(userComponentWillReceiveProps).toHaveNthReturnedWith(1, component.instance());
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		const { componentDidMountOrUpdate } = TestComponentWithOverrides.prototype;

		it('runs once when mounted', () => {
			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(1);
		});

		it('runs user code in override on mount', () => {
			expect(userComponentDidMount).toHaveBeenCalledBefore(componentDidMountOrUpdate);
		});

		it('runs user code in override on mount with "this" context of component', () => {
			expect(userComponentDidMount).toHaveNthReturnedWith(1, component.instance());
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on props update', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(userComponentDidUpdate).toHaveBeenCalledBefore(componentDidMountOrUpdate);
		});

		it('runs user code in override on props update with "this" context of component', () => {
			component.setProps(getUniqueProps());

			expect(userComponentDidUpdate).toHaveNthReturnedWith(1, component.instance());
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on state update', () => {
			jest.clearAllMocks();
			component.setState(getUniqueState());

			expect(userComponentDidUpdate).toHaveBeenCalledBefore(componentDidMountOrUpdate);
		});

		it('runs user code in override on state update with "this" context of component', () => {
			component.setState(getUniqueState());

			expect(userComponentDidUpdate).toHaveNthReturnedWith(1, component.instance());
		});
	});
});
