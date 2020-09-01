# react-component-update

[![npm package](https://badge.fury.io/js/react-component-update.svg)](https://badge.fury.io/js/react-component-update)
![node version](https://img.shields.io/node/v/react-component-update.svg)
[![Build Status](https://travis-ci.org/wimpyprogrammer/react-component-update.svg?branch=master)](https://travis-ci.org/wimpyprogrammer/react-component-update)
[![codecov](https://codecov.io/gh/wimpyprogrammer/react-component-update/branch/master/graph/badge.svg)](https://codecov.io/gh/wimpyprogrammer/react-component-update)
[![Known Vulnerabilities](https://snyk.io/test/github/wimpyprogrammer/react-component-update/badge.svg)](https://snyk.io/test/github/wimpyprogrammer/react-component-update)

Adds convenience lifecycle events to your React components.

 - `componentWillMountOrReceiveProps(nextProps)` - Combines the [`componentWillMount()`](https://facebook.github.io/react/docs/react-component.html#componentwillmount) and [`componentWillReceiveProps(nextProps)`](https://facebook.github.io/react/docs/react-component.html#componentwillreceiveprops) events.  This allows you to consolidate all pre-`render()` logic.
 
 - `componentDidMountOrUpdate(prevProps, prevState)` - Combines the [`componentDidMount()`](https://facebook.github.io/react/docs/react-component.html#componentdidmount) and [`componentDidUpdate(prevProps, prevState)`](https://facebook.github.io/react/docs/react-component.html#componentdidupdate) events.  This allows you to consolidate all post-`render()` logic.

## Installation

Published on `npm` as [`react-component-update`](https://www.npmjs.com/package/react-component-update).

npm users:
```
npm install --save react-component-update
```

yarn users:
```
yarn add react-component-update
```

`react-component-update` does not include its own version of React.  It will use whatever version is already installed in your project.

## Usage

To extend React's `Component` class:

```js
import React from 'react';
import { Component } from 'react-component-update';

class MyReactComponent extends Component {
  componentWillMountOrReceiveProps(nextProps) {
    // Code that runs before every render().  For example, check that the data
    // used by this component has already loaded, otherwise trigger an AJAX
    // request for it.  nextProps contains the props that render() will receive.
  }

  componentDidMountOrUpdate(prevProps, prevState) {
    // Code that runs after every render().  For example, inspect the latest DOM
    // to get the height of the rendered elements.  prevProps and prevState
    // contain the props and state that render() will receive.
  }

  render() {
    return <div />;
  }
}
```

Or to extend React's `PureComponent` class (available in React v15.3.0+):
```js
import { PureComponent } from 'react-component-update';
```

For compatibility with [`create-react-class`](https://www.npmjs.com/package/create-react-class), use the `withEvents()` higher-order component.

```js
import createReactClass from 'create-react-class';
import { withEvents } from 'react-component-update';

const MyReactComponent = createReactClass(withEvents({
	componentWillMountOrReceiveProps: function(nextProps) {
		// Code that runs before every render().
	},

	componentDidMountOrUpdate: function(prevProps, prevState) {
		// Code that runs after every render().
	},

	render: function() {
		return <div />;
	}
}));
```

## Mixing with your own lifecycle events

`react-component-update` implements four lifecycle events of the React base classes:
 - `componentWillMount()`
 - `componentDidMount()`
 - `componentWillReceiveProps()`
 - `componentDidUpdate()`

If you extend `Component` or `PureComponent` from `react-component-update` and you also implement these events in your component, you will need to call the corresponding `super()` method like so:

```js
componentWillMount() {
	super.componentWillMount();
}

componentDidMount() {
	super.componentDidMount();
}

componentWillReceiveProps(nextProps) {
	super.componentWillReceiveProps(nextProps);
}

componentDidUpdate(prevProps, prevState) {
	super.componentDidUpdate(prevProps, prevState);
}
```
 
The `super()` method can be called anywhere in your function to suit your needs.

If you use the `withEvents()` higher-order component, you do not need to add any extra code to your events.  The new event (ex. `componentDidMountOrUpdate()`) will always run after the related built-in event (ex. `componentDidUpdate()`).

## License

[MIT](/LICENSE.md)
