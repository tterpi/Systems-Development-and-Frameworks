<template>
	<div>
		<ul>
			<ListItem
				v-for="(item, index) in todos"
				v-bind:todo="item"
				v-bind:key="item.id"
				v-on:delete-todo="$emit('delete-todo',index)"
				v-on:save-todo="$emit('save-todo',{index: index, message: $event})"
			/>
		</ul>
		<button v-on:click="$emit('add-todo')">Add todo</button>
		</div>
</template>

<script>
import ListItem from './ListItem.vue'

export default{
	components: {ListItem},
	props: ['todos']
}
</script>

