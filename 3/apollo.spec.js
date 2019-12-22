const { createTestClient } = require('apollo-server-testing');
const {gql} = require('apollo-server');
const {getTestApolloServer} = require('./apolloServer.js');

const server = getTestApolloServer();
const initClient = createTestClient(server);

const loginMutation = gql`
	mutation login($userName: String!, $pwd: String!){
		login(userName: $userName, pwd: $pwd)
	}
`;

const createTodoMutation = gql`
	mutation createTodo($message: String, $assignee: ID!){
		createTodo(message: $message, assignee: $assignee){
			message
			assignee{
				name
			}
		}
	}
`;

const createAssigneeMutation = gql`
	mutation createAssignee($name: String!){
		createAssignee(name: $name){
			name
		}
	}
`;

const updateTodoMutation = gql`
	mutation updateTodo($id: ID!, $message: String){
		updateTodo(id:$id, message:$message){
			id
			message
		}
	}
`;

const getTodoQuery = gql`
	query getTodo($id: ID!){
		todo(id: $id){
			id
			message
		}
	}
`;

const deleteTodoMutation = gql`
	mutation deleteTodo($id: ID!){
		deleteTodo(id: $id){
			id
			message
			assignee{
				name
			}
		}
	}
`;

	
const todosQuery = gql`
	query TodosQuery($assignee: ID){
		todos(assignee: $assignee){
			id
			message
			assignee{
				name
			}
		}
	}
`;

describe('User is logged in', ()=>{
	let query
	let mutate
	beforeEach(async()=>{
		const result = await initClient.mutate({
			mutation: loginMutation,
			variables: {userName: "Hans", pwd: "1234"}
		})
		
		const testServer = getTestApolloServer(()=>{return {token: result.data.login}});
		const testClient = createTestClient(testServer);
		//console.log(result);
		query = testClient.query;
		mutate = testClient.mutate;
	});
	
	it('creates a new todo', async ()=>{	
		const result = await mutate({
				mutation: createTodoMutation,
				variables: {message: "The new message", assignee: '1'}
		});
		//console.log(result);
		expect(result.data).toMatchObject({
			"createTodo":{
				message: "The new message",
				assignee: {
					name: "Hans"
				}
			}
		});
	});

	it('updates a todo', async ()=>{
		const result = await mutate(
		{
			mutation: updateTodoMutation,
			variables: {id: "2", message: "color me surprised"}
		}
		);
		
		expect(result.data).toMatchObject({
			updateTodo:
			{
				id: "2",
				message: "color me surprised"
			}
		});
	})
	
	it('deletes a todo', async () => {
		const queryResult = await query({
			query: todosQuery,
		});
		
		let expectedTodo = queryResult.data.todos[queryResult.data.todos.length -1];
		
		const result = await mutate({
			mutation: deleteTodoMutation,
			variables: {id: expectedTodo.id}
		});
		//console.log(result);
		expect(result.data.deleteTodo).toMatchObject(expectedTodo);
	})

	it('adds an assignee', async ()=>{
		const result = await mutate({
			mutation: createAssigneeMutation,
			variables: {name: "Helga"}
		});
		
		expect(result.data).toMatchObject({
			createAssignee:{
				name: "Helga"
			}
		});
	})
});

describe('User is not logged in', ()=>{
	let query
	let mutate
	beforeEach(()=>{
		const testServer = getTestApolloServer(()=>{return {token: ""}});
		const testClient = createTestClient(testServer);
		//console.log(result);
		query = testClient.query;
		mutate = testClient.mutate;
	})
	
	it('gets all todos', async ()=>{
		const result = await query({
			query: todosQuery,
		});
		expect(result.data.todos.length).toBe(3);
	});

	it('gets a single todo', async ()=>{
		const result = await query(
		{
			query: getTodoQuery,
			variables: {id: "2"}
		}
		);
		expect(result.data.todo.message).toBe("Bar");
	})
	
	it('gets all todos with assignee 1', async ()=>{
		const result = await query({
			query: todosQuery,
			variables: {assignee: "1"}
		});
		expect(result.data.todos.length).toBe(2);
	});
	
	it('cannot create a new todo', async ()=>{	
		const result = await mutate({
				mutation: createTodoMutation,
				variables: {message: "The new message", assignee: '1'}
		});
		//console.log(result);
		expect(result.error).not.toBe(null);
	});
});





