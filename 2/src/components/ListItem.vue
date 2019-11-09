<template>
			<li>
				<div v-if="displayTodo">
					{{ todoString }}
					<button v-on:click="displayTodo=false">Edit</button>
					<button id="deleteButton" v-on:click="$emit('delete-todo')">Delete</button>
				</div>
				<div v-else>
					<input placeholder="Enter todo" v-model="inputValue"/>
					<button v-on:click="saveTodo">Save</button>
					<button v-on:click="displayTodo=true">Cancel</button>
				</div>
			</li>
</template>

<script>
export default{
	props : ['todo'],
	data: function (){
		return {
			displayTodo: !(this.todo.message === ""),
			inputValue: this.todo.message
		}
	},
	methods: {
		saveTodo: function(){
			this.$emit('save-todo', this.inputValue);
			this.displayTodo = true;
		}
	}, 
	computed: {
		todoString: function(){
			return this.todo.id + ". " + this.todo.message;
		}
	}
}
</script>