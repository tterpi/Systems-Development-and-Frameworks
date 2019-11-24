<template>
			<li>
				<div v-if="displayTodo">
					{{ todoString }}
					<button class="editButton" v-on:click="displayTodo=false">Edit</button>
					<button class="deleteButton" v-on:click="$emit('delete-todo')">Delete</button>
				</div>
				<div v-else>
					<input placeholder="Enter todo" v-model="inputValue"/>
					<button class="saveButton" v-on:click="saveTodo">Save</button>
					<button class="cancelButton" v-on:click="displayTodo=true">Cancel</button>
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