const getSchema = require("./apollo.js");
const {ApolloServer} = require('apollo-server');
const permissions = require('./permissions.js');
const { applyMiddleware } = require('graphql-middleware');
const getNeo4jDriver = require("./neo4j.js");

function getApolloServer(opts = {}){
  const defaults = {
		schema: applyMiddleware(getSchema(), permissions),
    context: ({req}) => ({
      token: req.headers.authorization,
      driver: getNeo4jDriver()
    })
  }
  opts = { ...defaults, ...opts }
	return new ApolloServer(opts);
}


module.exports.getApolloServer = getApolloServer;
