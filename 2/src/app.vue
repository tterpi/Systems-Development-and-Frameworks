<template>
	<List
		v-bind:todos="todos"
		v-on:add-todo="addTodo"
		v-on:save-todo="saveTodo"
		v-on:delete-todo="deleteTodo"
	></List>
</template>

<script>
import List from './components/List.vue'
export default{
  components: {List},
  methods: {
	addTodo: function(){
		this.todos.push(
			{ id: this.getNextId(), message: '', }
		);
	},
	saveTodo: function(todo){
		this.todos[todo.index].message = todo.message;
	},
	deleteTodo: function(index){
		this.todos.splice(index, 1);
	},
	getNextId: function(){
		return this.nextId++;
	}
  },
  created: function(){
	if(this.nextId === null){
			this.nextId = this.todos.length+1;
	}
  },
  data: function(){return{
    todos: [
      { id: '1', message: 'Foo', },
      { id: '2', message: 'Bar', },
      { id: '3', message: 'Baz', }
    ],
	nextId: null,
  }},
}
</script>
