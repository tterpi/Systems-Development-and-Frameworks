const neo4j = require('neo4j-driver');

const uri = "bolt://localhost:7687"
const user = "neo4j"
const password = "graphdb"
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

function getNeo4jDriver(){
	return driver;
}

function getSession(){
	return driver.session();
}

module.exports = getNeo4jDriver;
