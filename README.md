# react-component-update

[![Build Status](https://travis-ci.org/wimpyprogrammer/react-component-update.svg?branch=master)](https://travis-ci.org/wimpyprogrammer/react-component-update)
[![codecov](https://codecov.io/gh/wimpyprogrammer/react-component-update/branch/master/graph/badge.svg)](https://codecov.io/gh/wimpyprogrammer/react-component-update)

Extends the React `Component` and `PureComponent` classes with convenience lifecycle events.

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

## Mixing with your own lifecycle events

`react-component-update` implements four lifecycle events of the React base classes:
 - `componentWillMount()`
 - `componentDidMount()`
 - `componentWillReceiveProps()`
 - `componentDidUpdate()`

If you also implement these events in your component, you will need to call the corresponding `super()` method like so:

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

## License

[MIT](/LICENSE.md)
