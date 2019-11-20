//import { rule, and, or, not, shield } from 'graphql-shield'
const { rule, and, or, not, shield } = require('graphql-shield');

const authenticatedUser = "Hanna";

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  // Is there a Grocer with such email in our database (Prisma)?
  return ctx.userName === authenticatedUser;
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