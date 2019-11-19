const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server');

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

  type Query {
	todo(id: ID!): Todo
    todos(assignee: ID): [Todo]
  }
  
  type Mutation{
	  createTodo(message: String, assignee: ID): Todo
	  updateTodo(id: ID, message: String): Todo
	  deleteTodo(id: ID): Todo
	  createAssignee(name: String): Assignee
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

function getRandomId(){
	return Math.floor(Math.random() * Math.floor(9999999)).toString();
}	
	
const resolvers = {
  Query: {
	todo: (parent, args, context, info) => {
		return todos.find((todo)=>{return todo.id == args.id});
	},
    todos: (parent, args, context, info) => {
		let result = todos;
		if(args.assignee != null){
			result = todos.filter((todo)=>{return todo.assignee.id == args.assignee});
		}
		return result;
	},
  },
  Mutation: {
	  createTodo: (parent, args, context, info) =>{
		  todos.push({
			  id: getRandomId(),
			  message: args.message,
			  assignee: assignees.find((assignee)=>{ return assignee.id == args.assignee})
		  });
		  return todos[todos.length -1];
	  },
	  deleteTodo: (parent, args, context, info) =>{
		return todos.splice(todos.findIndex((todo)=>{return todo.id == args.id}),1)[0];  
	  },
	  updateTodo: (parent, args, context, info) =>{
		let todo = todos.find((todo)=>{return todo.id == args.id});
		todo.message = args.message;
		return todo;
	  },
	  createAssignee: (parent, args, context, info) =>{
		  assignees.push({
			  id: getRandomId(),
			  name: args.name
		  });
		  return assignees[assignees.length -1];
	  },
  }
};

function getApolloServer(context, middleware){ 
	const schema = makeExecutableSchema({
		
	},
	middleware);
	return new ApolloServer({typeDefs, resolvers, context})
};

function getSchema(){
	return makeExecutableSchema({
		typeDefs,
		resolvers
	});
}

module.exports = getSchema;

