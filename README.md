# alignment.js

A suite of reusable [React](http://reactjs.org/) components for creating a variety of visualizations involving [multiple sequence alignments](https://en.wikipedia.org/wiki/Multiple_sequence_alignment). [View the live demo here](http://alignment.hyphy.org/).

`alignment.js` can be used to create standard MSA viewers, utilizing functional programming to permit custom behavior such as highlighting individual sites:

![alt text](images/standard.png)

as well as scaffold viewers for next-generation sequencing data where a reference sequence stays fixed to the top:

![alt text](images/scaffold.gif)

and joint phylogeny/alignment viewers using packages like [phylotree.js](https://github.com/veg/phylotree.js):

![alt text](images/phyalign.png)

## Installation

`alignment.js` is [available on NPM](https://www.npmjs.com/package/alignment.js) and can thus be installed with `npm`

```
npm install alignment.js
```

or `yarn`

```
yarn add alignment.js
```

## Development

### Installation

```
git clone https://github.com/veg/alignment.js
cd alignment.js
yarn
```

### Application

Start the development server:

```
yarn develop
```

`webpack-dev-server` will find an available port and open up your default browser. Refreshes will automatically occur on writes to files.

### Library

For testing the library in dependent packages before releases, `alignment.js` uses yalc. The library is built by Babeling `src` into `lib`, and `lib` is published. For convenience, this is encapsulated in the following NPM script:

```
yarn yalc
```

## Deployment

### Application

Server will read from environment variable `$PORT`.

```
yarn app
yarn serve
```

### Library

```
yarn library
```
