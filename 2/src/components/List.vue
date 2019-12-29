<template>
	<div>
        <Login/>
		<ul>
			<ListItem
				v-for="(item, index) in todos"
				v-bind:todo="item"
				v-bind:key="index"
				v-on:delete-todo="deleteTodo(item.id)"
				v-on:save-todo="saveTodo({index: item.id, message: $event})"
                v-on:create-todo="createTodo($event)"
			/>
		</ul>
		<button class="add-button" v-on:click="addTodo()">Add todo</button>
	</div>
</template>

<script>
import ListItem from './ListItem.vue'
import Login from './Login.vue'
import gql from 'graphql-tag'

export default {
    components: { ListItem, Login },
    methods: {
        addTodo: function () {
            this.todos.push(
                { id: null, message: '', assignee: {id: null, name: "unknown"}}
            );
        },
        createTodo: async function (todo){
            await this.$apollo.mutate({
                mutation:gql`
                mutation createTodo($message: String, $assignee: ID!){
                    createTodo(message: $message, assignee: $assignee){
                        message
                        assignee{
                            name
                        }
                    }
                }
                `,
                variables:{
                    message: todo,
                    assignee: '2'
                }
            })
            this.$apollo.queries.todos.refetch()
        },
        saveTodo: async function (todo) {
            await this.$apollo.mutate(
                {
                    mutation: gql`
                    mutation updateTodo($id: ID!, $message: String){
                        updateTodo(id:$id, message:$message){
                            id
                            message
                        }
                    }
                `,
                variables: {
                    id: todo.index,
                    message: todo.message
                }
                }
            )
            //this.todos[todo.index].message = todo.message;
        },
        deleteTodo: async function (index) {
            await this.$apollo.mutate({
                mutation: gql`
                mutation deleteTodo($id: ID!){
                    deleteTodo(id: $id){
                        id
                        message
                    }
                }
                `,
                variables: {
                    id: index
                }
            })
            this.$apollo.queries.todos.refetch()
            //this.todos.splice(index, 1);
        },
        getNextId: function () {
            return this.nextId++;
        }
    },
    created: function () {
        if (this.nextId === null) {
            this.nextId = this.todos.length + 1;
        }
    },
    apollo: {
        todos: {
            query: gql`
            query TodosQuery($assignee: ID, $first: Int, $offset: Int){
                todos(assignee: $assignee, first: $first, offset: $offset){
                    id
                    message
                    assignee{
                        id
                        name
                    }
                }
            }
            `,
            variables: {
                first: 25,
                offset: 0
            }
        }
    },
    data: function () {
        return {
            todos: [],
            nextId: null,
        }
    },
}
</script>

