const { createTestClient } = require('apollo-server-testing');
const getApolloServer = require("./apollo.js");
const {gql} = require('apollo-server');

const server = getApolloServer();
const { query, mutate } = createTestClient(server);

const createTodoMutation = gql`
	mutation createTodo($message: String, $assignee: ID){
		createTodo(message: $message, assignee: $assignee){
			message
			assignee{
				name
			}
		}
	}
`;

const createAssigneeMutation = gql`
	mutation createAssignee($name: String){
		createAssignee(name: $name){
			name
		}
	}
`;
	
const deleteTodoMutation = gql`
	mutation deleteTodo($id: ID){
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
	query TodosQuery{
		todos{
			id
			message
			assignee{
				name
			}
		}
	}
`;
it('gets all todos', async ()=>{
	const result = await query({
		query: todosQuery,
	});
	expect(result.data.todos.length).toBe(3);
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

