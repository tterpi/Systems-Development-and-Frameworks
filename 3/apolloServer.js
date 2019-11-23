const getSchema = require("./apollo.js");
const {ApolloServer} = require('apollo-server');
const permissions = require('./permissions.js');
const { applyMiddleware } = require('graphql-middleware');

function getApolloServer(){
	const schema = getSchema();
	const schemaWithMiddleware = applyMiddleware(schema, permissions);
	const server = new ApolloServer({schema: schemaWithMiddleware, context: ({req})=>{return {token: req.headers.authorization}}});
	return server;
}

module.exports = getApolloServer;
