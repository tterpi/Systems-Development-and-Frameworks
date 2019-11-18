const getApolloServer = require("./apollo.js");

const server = getApolloServer();
server.listen().then(({url})=> {
 console.log(`Apollo server running at: ${url}`);
});

