import { shallow } from 'enzyme';
import React from 'react';

let counter = 0;
const uniqueId = (prefix) => prefix + counter++;

function getUniqueState() {
	return { [uniqueId('stateVarName')]: uniqueId('stateVarValue') };
}

function getUniqueProps() {
	return { [uniqueId('propName')]: uniqueId('propValue') };
}

// In React <16, context is an undocumented parameter that React passes to
// componentWillReceiveProps() and componentDidUpdate()
const hasContextParameter = React.version.split('.')[0] < 16;

// Skip these tests if the current version of React does not define PureComponent.
const descriptor = React.PureComponent ? describe : describe.skip;

descriptor('PureComponent extension', () => {
	const { PureComponent } = require('.'); // eslint-disable-line global-require
	let component;

	class TestComponent extends PureComponent {
		constructor(props) {
			super(props);
			this.state = getUniqueState();
		}
	}

	TestComponent.prototype.componentWillMountOrReceiveProps = jest.fn().mockReturnThis();
	TestComponent.prototype.componentDidMountOrUpdate = jest.fn().mockReturnThis();
	TestComponent.prototype.render = jest.fn().mockReturnValue(null);

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

			const { props } = component.instance();
			const context = {};
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

			const context = hasContextParameter ? {} : undefined;
			expect(componentDidMountOrUpdate)
				.toHaveBeenNthCalledWith(2, initialProps, initialState, context);
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

descriptor('PureComponent extension with overrides calling super()', () => {
	const { PureComponent } = require('.'); // eslint-disable-line global-require
	let component;

	const userComponentWillMountBefore = jest.fn();
	const userComponentWillMountAfter = jest.fn();
	const userComponentDidMountBefore = jest.fn();
	const userComponentDidMountAfter = jest.fn();
	const userComponentWillReceivePropsBefore = jest.fn();
	const userComponentWillReceivePropsAfter = jest.fn();
	const userComponentDidUpdateBefore = jest.fn();
	const userComponentDidUpdateAfter = jest.fn();

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

	TestComponentWithSuper.prototype.componentWillMountOrReceiveProps = jest.fn().mockReturnThis();
	TestComponentWithSuper.prototype.componentDidMountOrUpdate = jest.fn().mockReturnThis();

	beforeEach(() => {
		component = shallow(<TestComponentWithSuper {...getUniqueProps()} />);
	});

	describe('componentWillMountOrReceiveProps()', () => {
		const { componentWillMountOrReceiveProps } = TestComponentWithSuper.prototype;

		it('runs once on mount', () => {
			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});

		it('runs user code in override on mount', () => {
			expect(userComponentWillMountBefore).toHaveBeenCalledBefore(componentWillMountOrReceiveProps);
			expect(componentWillMountOrReceiveProps).toHaveBeenCalledBefore(userComponentWillMountAfter);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on props update', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(userComponentWillReceivePropsBefore)
				.toHaveBeenCalledBefore(componentWillMountOrReceiveProps);
			expect(componentWillMountOrReceiveProps)
				.toHaveBeenCalledBefore(userComponentWillReceivePropsAfter);
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());

			expect(componentWillMountOrReceiveProps).toHaveBeenCalledTimes(1);
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		const { componentDidMountOrUpdate } = TestComponentWithSuper.prototype;

		it('runs once when mounted', () => {
			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(1);
		});

		it('runs user code in override on mount', () => {
			expect(userComponentDidMountBefore).toHaveBeenCalledBefore(componentDidMountOrUpdate);
			expect(componentDidMountOrUpdate).toHaveBeenCalledBefore(userComponentDidMountAfter);
		});

		it('runs on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on props update', () => {
			jest.clearAllMocks();
			component.setProps(getUniqueProps());

			expect(userComponentDidUpdateBefore).toHaveBeenCalledBefore(componentDidMountOrUpdate);
			expect(componentDidMountOrUpdate).toHaveBeenCalledBefore(userComponentDidUpdateAfter);
		});

		it('runs on state update', () => {
			component.setState(getUniqueState());

			expect(componentDidMountOrUpdate).toHaveBeenCalledTimes(2);
		});

		it('runs user code in override on state update', () => {
			jest.clearAllMocks();
			component.setState(getUniqueState());

			expect(userComponentDidUpdateBefore).toHaveBeenCalledBefore(componentDidMountOrUpdate);
			expect(componentDidMountOrUpdate).toHaveBeenCalledBefore(userComponentDidUpdateAfter);
		});
	});
});

descriptor('PureComponent extension with overrides not calling super()', () => {
	const { PureComponent } = require('.'); // eslint-disable-line global-require
	let component;

	class TestComponentWithoutSuper extends PureComponent {
		componentWillMount() { }

		componentDidMount() { }

		componentWillReceiveProps() { }

		componentDidUpdate() { }

		render() {
			return null;
		}
	}

	TestComponentWithoutSuper.prototype.componentWillMountOrReceiveProps = jest.fn().mockReturnThis();
	TestComponentWithoutSuper.prototype.componentDidMountOrUpdate = jest.fn().mockReturnThis();

	beforeEach(() => {
		component = shallow(<TestComponentWithoutSuper {...getUniqueProps()} />);
	});

	describe('componentWillMountOrReceiveProps()', () => {
		const { componentWillMountOrReceiveProps } = TestComponentWithoutSuper.prototype;

		it('does not run on mount', () => {
			expect(componentWillMountOrReceiveProps).not.toHaveBeenCalled();
		});

		it('does not run on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentWillMountOrReceiveProps).not.toHaveBeenCalled();
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());

			expect(componentWillMountOrReceiveProps).not.toHaveBeenCalled();
		});
	});

	describe('componentDidMountOrUpdate()', () => {
		const { componentDidMountOrUpdate } = TestComponentWithoutSuper.prototype;

		it('does not run when mounted', () => {
			expect(componentDidMountOrUpdate).not.toHaveBeenCalled();
		});

		it('does not run on props update', () => {
			component.setProps(getUniqueProps());

			expect(componentDidMountOrUpdate).not.toHaveBeenCalled();
		});

		it('does not run on state update', () => {
			component.setState(getUniqueState());

			expect(componentDidMountOrUpdate).not.toHaveBeenCalled();
		});
	});
});
