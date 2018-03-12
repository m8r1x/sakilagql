sakila API GraphQL Wrapper
=====================

A wrapper around [sakila API](https://github.com/m8r1x/sakilagql) built using GraphQL.

Uses:

* [graphql-js](https://github.com/graphql/graphql-js) - a JavaScript GraphQL runtime.
* [DataLoader](https://github.com/facebook/dataloader) - for coalescing and caching fetches.
* [express-graphql](https://github.com/graphql/express-graphql) - to provide HTTP access to GraphQL.
* [GraphiQL](https://github.com/graphql/graphiql) - for easy exploration of this GraphQL server.

## Getting Started

The project is built with [typescript](https://www.typescriptlang.org) so ensure that the [typescript compiler](https://github.com/basarat/tsc) is installed.
```sh
$ tsc -v # global installation
Version 2.7.2 # At the time of writing
```

Install dependencies with

```sh
$ npm install
```

## Testing

Running:

```sh
$ npm test
```

will compile the project and run the tests using [ava](https://github.com/avajs/ava) located in `./api` and `./schema`

## Local Server

A local express server is in `./server`. It can be run with:

```sh
$ npm start
```

or using [ts-node](https://github.com/TypeStrong/ts-node) in dev mode
```sh
$ npm start:dev
```

A GraphiQL instance will be opened at http://localhost:3000/ (or similar; the actual port number will be printed to the console) to explore the API.
