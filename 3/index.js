const {getApolloServer} = require('./apolloServer.js');
const neo4j = require('neo4j-driver');

getApolloServer().listen().then(({url})=> {
 console.log(`Apollo server running at: ${url}`);
});

const uri = "bolt://localhost:7687"
const user = "neo4j"
const password = "graphdb"
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()

const resultPromise = session.writeTransaction(tx =>
  tx.run(
    'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
    { message: 'hello, world' }
  )
)

resultPromise.then(result => {
  session.close()

  const singleRecord = result.records[0]
  const greeting = singleRecord.get(0)

  console.log(greeting)

  // on application exit:
  driver.close()
})

