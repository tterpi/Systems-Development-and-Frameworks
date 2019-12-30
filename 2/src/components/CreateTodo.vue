<template>
	<div>
        <input placeholder="message" v-model="message"/>
        <select v-model="assignee">
            <option disabled value="">assignee</option>
            <option v-for="(person) in assignees" v-bind:key="person.id" v-bind:value="person.id">
                {{ person.name }}
            </option>
        </select>
		<button class="saveButton" v-on:click="createTodo">create todo</button>
	</div>
</template>

<script>
import gql from 'graphql-tag'

export default{
	props : [],
	data: function (){
		return {
			message: "",
			assignee: ""
		}
	},
	methods: {
		createTodo: async function (){
            if(!this.message || !this.assignee){
                return
            }
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
                    message: this.message,
                    assignee: this.assignee
                }
            })
            this.$emit('todo-created');
            this.message = ""
            this.assignee = ""
            //this.$apollo.queries.todos.refetch()
        }
    },
    apollo: {
        assignees: {
            query: gql`{
                assignees{
                    id
                    name
                }
            }
            `
        }
    }
}
</script>