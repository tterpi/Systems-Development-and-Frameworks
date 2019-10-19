export default Vue.component('list-item', {
	props : ['todo'],
	data: function (){
		return {
			displayTodo: true,
			inputValue: this.todo.message
		}
	},
	methods: {
		saveTodo: function(){
			//this.todo.message = this.inputValue;
			this.$emit('saveTodo', this.inputValue);
			this.displayTodo = true;
		}
	} 
	,
	template: 
		`
			<li>
				<template v-if="displayTodo">
					{{ todo.message }}
					<button v-on:click="displayTodo=false">Edit</button>
				</template>
				<template v-else>
					<input placeholder="Enter todo" v-model="inputValue"/>
					<button v-on:click="saveTodo">Save</button>
					<button v-on:click="displayTodo=true">Cancel</button>
				</template>
				<button v-on:click="$emit('deleteTodo')">Delete</button>
			</li>
		`
})
