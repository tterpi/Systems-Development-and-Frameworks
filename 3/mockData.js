const {getNeo4jDriver} = require("./neo4j.js");
let assignees
let todos

const getAssignees= ()=> [
      {id: '1', name: 'Hans', password: "1234"},
      {id: '2', name: 'Hanna', password: "5678"},
	  {id: '3', name: 'Herbert', password: "8765"}
    ];

const getTodos = ()=>[
      { id: '1', message: 'Foo', assignee: assignees[0],},
      { id: '2', message: 'Bar', assignee: assignees[1],},
      { id: '3', message: 'Baz', assignee: assignees[0],},
	  { id: '4', message: 'Baz', assignee: assignees[2],}
    ];

async function importDataToNeo4j(){
	const driver = getNeo4jDriver();
	const session = driver.session();
	
	assignees = getAssignees()
	todos = getTodos()
	
	const personCreationQuery = `
		UNWIND $assignees AS assignee
		MERGE (n:Person:Assignee {id: assignee.id, name: assignee.name, password: assignee.password})
		RETURN n`
	
	let result = await session.run(personCreationQuery,
	{
		assignees: getAssignees()
	})
	//console.log(result);
	
	const todoCreationQuery = `
		UNWIND $todos AS todo
		MATCH (p:Assignee {id: todo.assignee.id})
		MERGE (t:Todo {id: todo.id})
		SET t.message = todo.message
		MERGE (t)-[:IS_ASSIGNED_TO]->(p)
		RETURN t`
		
	result = await session.run(todoCreationQuery,
	{
		todos: getTodos()
	})
	//console.log(result);
	
	session.close()
}

async function cleanUpDataInNeo4j(){
	const driver = getNeo4jDriver()
	const session = driver.session()
	await session.run(`MATCH (n) DETACH DELETE n`)
	session.close()
}

module.exports = {importDataToNeo4j, cleanUpDataInNeo4j}