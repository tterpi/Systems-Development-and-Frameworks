<template>
	<div>
        <Login/>
		<ul>
			<ListItem
				v-for="(item, index) in todos"
				v-bind:todo="item"
				v-bind:key="item.id"
				v-on:delete-todo="deleteTodo(index)"
				v-on:save-todo="saveTodo({index: index, message: $event})"
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
                { id: this.getNextId(), message: '', }
            );
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
        deleteTodo: function (index) {
            this.todos.splice(index, 1);
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
            todos: [
                { id: '1', message: 'Foo', },
                { id: '2', message: 'Bar', },
                { id: '3', message: 'Baz', }
            ],
            nextId: null,
        }
    },
}
</script>

