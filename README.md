# Apollo Directive Link

[![Build Status](https://travis-ci.org/svengau/apollo-link-directive.svg?branch=master)](https://travis-ci.org/svengau/apollo-link-directive)

## Purpose

An Apollo Link to easily add custom directives in your GraphQL queries.

## Installation

```bash

npm install apollo-link-directive --save
# or
yarn add apollo-link-directive

```

## Usage

### Basics

This sample code shows how to use this Apollo Link to change the HttpLink uri with the "admin" directive: 

```js

import { from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { DirectiveLink } from "apollo-link-directive";

const adminDirectiveLink = new DirectiveLink([
  { 
    directive: 'admin', 
    callback: (operation, _forward) => operation.setContext({ uri: '/graphql-admin' })
   },
]);

const httpLink = new HttpLink({
  uri: '/graphql',
});

// Configure the ApolloClient
const client = new ApolloClient({
  link: from([adminDirectiveLink,  httpLink]),
  cache: new InMemoryCache(),
});



```

this sample code will update all queries having admin directive with uri: /graphql-admin, for example from this query:

```

const query = gql`
  query luke {
    person @admin {
      name
    }
  }
`;

```

## Options

The options you can pass to DirectiveLink are an array of directives like this:

- `directive`: the name of the directive
- `callback`: a callback function with args `operation` and `forward`
- `remove`: an option to remove the directive from the code. Default: true

## Thanks

Setting up the project has been largely inspired by the wonderful [apollo-link-rest](https://github.com/apollographql/apollo-link-rest) project.
