const getSchema = require("./apollo.js");
const {ApolloServer} = require('apollo-server');
const {permissions} = require('./permissions.js');
const { applyMiddleware } = require('graphql-middleware');

function getApolloServer(){
	const schema = getSchema();
	//const schemaWithMiddleware = applyMiddleware(schema, permissions);
	const server = new ApolloServer({schema, context: ()=>{return {userName: "Hanna"}}});
	return server;
}

module.exports = getApolloServer;
