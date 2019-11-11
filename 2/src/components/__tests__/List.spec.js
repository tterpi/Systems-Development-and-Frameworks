import { shallowMount } from '@vue/test-utils'
import List from '../List.vue'
import ListItem from '../ListItem.vue'

const factory = (values = {}) => {
	return shallowMount(List, {
		propsData: values
	})
}

describe('List', () => {
	const wrapper = factory({
		todos: [
			{ id: '1', message: 'Foo', },
			{ id: '2', message: 'Bar', },
			{ id: '3', message: 'Baz', }
		]
	});
	it('Renders a add todo button', () => {
		const addButton = wrapper.find(".add-button");
		expect(addButton.text()).toBe("Add todo");
	})

	it('Emits add-todo event after clicking add button', () => {
		const addButton = wrapper.find(".add-button");
		addButton.trigger('click');
		expect(wrapper.emitted('add-todo')).toBeTruthy;
	})

	it('Renders the correct number of list items', () => {
		const listItems = wrapper.findAll(ListItem);
		expect(listItems.length).toBe(3);
	})
})