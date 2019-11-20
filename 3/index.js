const getApolloServer = require('./apolloServer.js');

getApolloServer().listen().then(({url})=> {
 console.log(`Apollo server running at: ${url}`);
});

