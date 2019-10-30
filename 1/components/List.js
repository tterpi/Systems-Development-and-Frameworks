export default Vue.component('list', {
	props: ['todos'],
	template: `
		<div>
		<ul>
			<list-item
				v-for="(item, index) in todos"
				v-bind:todo="item"
				v-bind:key="item.id"
				v-on:delete-todo="$emit('delete-todo',index)"
				v-on:save-todo="$emit('save-todo',{index: index, message: $event})"
			/>
		</ul>
		<button v-on:click="$emit('add-todo')">Add todo</button>
		</div>
		`
})
