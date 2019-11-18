const { createTestClient } = require('apollo-server-testing');
const getApolloServer = require("./apollo.js");
const {gql} = require('apollo-server');

const server = getApolloServer();
const { query, mutate } = createTestClient(server);

it('gets all todos', async ()=>{
	let todosQuery = gql`
		query TodosQuery{
			todos{
				message
				assignee{
					name
				}
			}
		}
	`;
	const result = await query({
		query: todosQuery,
	});
	expect(result.data.todos.length).toBe(3);
});

