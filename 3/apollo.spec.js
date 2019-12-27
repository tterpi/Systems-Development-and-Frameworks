const { createTestClient } = require('apollo-server-testing');
const {gql} = require('apollo-server');
const {getTestApolloServer} = require('./apolloServer.js');
const {importDataToNeo4j, cleanUpDataInNeo4j} = require('./mockData.js');
const {closeDriver} = require("./neo4j.js");

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
	mutation createAssignee($name: String!, $password: String!){
		createAssignee(name: $name, password: $password){
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
		}
	}
`;

	
const todosQuery = gql`
	query TodosQuery($assignee: ID, $first: Int, $offset: Int){
		todos(assignee: $assignee, first: $first, offset: $offset){
			id
			message
			assignee{
				name
			}
		}
	}
`;


beforeAll(async()=>{
	await cleanUpDataInNeo4j()
})

afterAll(async()=>{
	await closeDriver()
})

describe('User is logged in', ()=>{
	let query
	let mutate
	beforeEach(async()=>{
		await importDataToNeo4j()
		const result = await initClient.mutate({
			mutation: loginMutation,
			variables: {userName: "Hans", pwd: "1234"}
		})
		
		const testServer = getTestApolloServer({token: result.data.login});
		const testClient = createTestClient(testServer);
		//console.log(result);
		query = testClient.query;
		mutate = testClient.mutate;
	});
	afterEach(async()=>{
		await cleanUpDataInNeo4j()
	})
	
	it('creates a new todo', async ()=>{	
		const result = await mutate({
				mutation: createTodoMutation,
				variables: {message: "The new message", assignee: '1'}
		});
		console.log(result);
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
		console.log(result);
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
			variables: {
				first: 10,
				offset: 0
			}
		});
		
		let expectedTodo = queryResult.data.todos[queryResult.data.todos.length -1];
		
		const result = await mutate({
			mutation: deleteTodoMutation,
			variables: {id: expectedTodo.id}
		});
		
		const emptyResult = await query(
		{
			query: getTodoQuery,
			variables: {id: expectedTodo.id}
		}
		);
		
		console.log(result);
		console.log(expectedTodo);
		expect(result.data.deleteTodo.id).toBe(expectedTodo.id);
		expect(emptyResult.data.todo).toBeFalsy;
	})

	it('adds an assignee', async ()=>{
		const result = await mutate({
			mutation: createAssigneeMutation,
			variables: {name: "Helga", password: "1337"}
		});
		console.log(result);
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
	beforeEach(async ()=>{
		await importDataToNeo4j()
		const testServer = getTestApolloServer(()=>{return {token: ""}});
		const testClient = createTestClient(testServer);
		//console.log(result);
		query = testClient.query;
		mutate = testClient.mutate;
	})
	afterEach(async()=>{
		await cleanUpDataInNeo4j()
	})
	
	it('gets all todos', async ()=>{
		const result = await query({
			query: todosQuery,
			variables: {
				first: 10,
				offset: 0
			}
		});
		expect(result.data.todos.length).toBe(4);
	});
	
	it('gets all todos with pagination', async ()=>{
		const result = await query({
			query: todosQuery,
			variables: {
				first: 2,
				offset: 1
			}
		});
		expect(result.data.todos.length).toBe(2);
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
			variables: {
				assignee: "1",
				first: 10,
				offset: 0
			}
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





