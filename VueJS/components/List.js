export default Vue.component('list', {
	props: ['todos'],
	template: `
		<ol>
			<list-item
				v-for="item in todos"
				v-bind:todo="item"
				v-bind:key="item.id"
			></list-item>
		</ol>
		`
})
