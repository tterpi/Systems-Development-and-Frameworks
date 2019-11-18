const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Todo {
    id: ID!
    message: String
    assignee: Assignee
  }

  type Assignee {
    id: ID!
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    todos: [Todo]
  }
`;

const assignees= [
      {id: '1', name: 'Hans'},
      {id: '2', name: 'Hanna'}
    ];

const todos = [
      { id: '1', message: 'Foo', assignee: assignees[0],},
      { id: '2', message: 'Bar', assignee: assignees[1],},
      { id: '3', message: 'Baz', assignee: assignees[0],}
    ];

const resolvers = {
  Query: {
    todos: () => todos,
  },
};

const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({url})=> {
 console.log(`Apollo server running at: ${url}`);
});
