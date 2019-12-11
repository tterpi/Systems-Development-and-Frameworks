const { ApolloServer, gql} = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const jwt = require('jsonwebtoken');
const secret = require('./secret.js');

let assignees
let todos

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
	  login(userName: String!, pwd: String!): String! 
	  createTodo(message: String, assignee: ID!): Todo
	  updateTodo(id: ID!, message: String): Todo
	  deleteTodo(id: ID!): Todo
	  createAssignee(name: String!): Assignee
  }
`;

const getAssignees= ()=> [
      {id: '1', name: 'Hans', password: "1234"},
      {id: '2', name: 'Hanna', password: "5678"}
    ];

const getTodos = ()=>[
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
    todos: async(parent, args, context, info) => {
		const session = context.driver.session()
		let result
		if(args.assignee != null){
			result = await session.run(`
			MATCH (t:Todo)-[:IS_ASSIGNED_TO]->(p:Person {id: $assignee})
			RETURN t, p
			`,
			{
				assignee: args.assignee
			})
		}else{
			result = await session.run(`
			MATCH (t:Todo)-[:IS_ASSIGNED_TO]->(p:Person)
			RETURN t, p
			`)			
		}

		session.close()
		//console.log(result);
		return result.records.map((record) => {
			let response = {...record.get('t').properties, assignee: record.get('p').properties}
			return response;
		});
	},
  },
  Mutation: {
	  login: (parent, args, context, info) =>{
		  return jwt.sign({userName: args.userName}, secret, {expiresIn: "1 day"});
	  },
	  createTodo: async (parent, args, context, info) => {
		  const session = context.driver.session()
		  const result = await session.run(`
		  MATCH (p:Person) WHERE p.id = $assignee
		  CREATE (t:Todo {id: $id, message: $message})
		  MERGE (t)-[:IS_ASSIGNED_TO]->(p)
		  RETURN t, p
		  `,
		  {
			id: getRandomId(),
			message: args.message,
			assignee: args.assignee
		  }
		  )
		  session.close();
		  //console.log(result);
		  const record = result.records[0];
		  return {...record.get('t').properties, assignee: record.get('p').properties};
	  },
	  deleteTodo: (parent, args, context, info) =>{
		return todos.splice(todos.findIndex((todo)=>{return todo.id == args.id}),1)[0];  
	  },
	  updateTodo: (parent, args, context, info) =>{
		let todo = todos.find((todo)=>{return todo.id == args.id});
		todo.message = args.message;
		return todo;
	  },
	  createAssignee: async (parent, args, context, info) => {
		  const session = context.driver.session()
		  const result = await session.run(`
		  CREATE (p:Person {id: $id, name: $name})
		  RETURN p
		  `,
		  {
			  id: getRandomId(),
			  name: args.name
		  }
		  )
		  session.close();
		  //console.log(result.records[0].get('p'));
		  return result.records[0].get('p').properties;
	  },
  }
};

function getSchema(){
	//reset the data each time the schema is returned
	assignees = getAssignees();
	todos = getTodos();
	return makeExecutableSchema({
		typeDefs: typeDefs,
		resolvers: resolvers
});
}

module.exports = getSchema;

