#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> JavaScript objects with strict structure, typing, partial views, and changelog.

** this is a work in progress **

For now the [tests](https://github.com/CardForest/master-component/tree/master/test) are the only documentation.


## Install

```sh
$ npm install --save master-component
```

## Usage

```js
var Master = require('master-component');

```

```sh
# creates a browser.js
$ npm run browser
```

## Roadmap

### v0.1.0

##### schema 
- [x] primitive values
- [x] nested js objects
- [x] array type
- [x] nested array

##### strictness
- [x] guard types of primitive values
- [x] prevent setting of non primitive values

### v0.2.0

##### partial views 
- [x] allow specifying hidden paths for partial views
- [ ] allow to 'unhide' paths when creating partial views

##### Changelog
- [x] record primitive value set in changelog
- [ ] allow a partial view of the changelog
- [ ] allow to 'unhide' paths when creating a changelog partial views

### v0.3.0

##### Custom Components
- [ ] custom schema
- [ ] custom partial views
- [ ] custom changelog events

## License

BSD. Copyright © 2015 [Amit Portnoy](https://github.com/amitport).

[npm-image]: https://img.shields.io/npm/v/master-component.svg?style=flat
[npm-url]: https://npmjs.org/package/master-component
[travis-image]: https://travis-ci.org/CardForest/master-component.svg?branch=master
[travis-url]: https://travis-ci.org/CardForest/master-component
[daviddm-image]: https://david-dm.org/CardForest/master-component.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/CardForest/master-component
