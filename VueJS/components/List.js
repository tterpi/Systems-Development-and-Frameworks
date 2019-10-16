export default Vue.component('list', {
	props: ['todos'],
	template: `
		<ol>
			<list-item
				v-for="(item, index) in todos"
				v-bind:todo="item"
				v-bind:key="item.id"
				v-on:deleteTodo="todos.splice(index, 1)"
				v-on:saveTodo="todos[index].message = $event"
			/>
		</ol>
		`
})
