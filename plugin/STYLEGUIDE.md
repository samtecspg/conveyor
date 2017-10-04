# React Style Guide

Under development and up for discussion

## Routing

TODO

## Creating React Classes

Prefer the newer es6 class syntax over es5 createClass syntax

```js
// good
class Table extends React.Component {...}

// bad
const Table =  React.createClass({...});
```

## PropTypes

Always use PropTypes when creating a React class. It's like a poor mans Typescript.

```js
// good
import PropTypes from 'prop-types';
class Table extends React.Component {...}

Table.PropTypes = {
  selectedRows: PropTypes.array,
  beAwesome: PropTypes.bool
}
```
