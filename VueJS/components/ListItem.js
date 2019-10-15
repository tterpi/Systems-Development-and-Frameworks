export default Vue.component('list-item', {
	props : ['todo'],
	template: '<li>{{ todo.message }}</li>'
})
