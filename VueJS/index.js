import List from './components/List.js'
import ListItem from './components/ListItem.js'

var myApp = new Vue({
  el: '#app',
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
  data: {
    todos: [
      { id: '1', message: 'Foo', },
      { id: '2', message: 'Bar', },
      { id: '3', message: 'Baz', }
    ],
	nextId: null,
  }
})
