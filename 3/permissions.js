//import { rule, and, or, not, shield } from 'graphql-shield'
const { rule, and, or, not, shield } = require('graphql-shield');
const jwt = require('jsonwebtoken');
const secret = require('./secret.js');

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  // Is there a Grocer with such email in our database (Prisma)?
  //console.log(ctx);
  var valid = false;
  try{
	  var payload = jwt.verify(ctx.token, secret);
	  valid = payload != null;
  }
  catch(err){
	  console.log(err);
  }
  return valid;
})

const permissions = shield({
  Mutation: {
	createTodo: isAuthenticated,
	updateTodo: isAuthenticated,
	deleteTodo: isAuthenticated,
	createAssignee: isAuthenticated
  },
})

module.exports = permissions;
