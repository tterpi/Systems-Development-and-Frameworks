import { shallowMount } from '@vue/test-utils'
import ListItem from '../ListItem.vue'

const factory = (values = {}) => {
  return shallowMount(ListItem, {
    propsData : values
  })
}

describe('ListItem', () => {
	it('Renders a delete button', () => {
		const wrapper = factory({
				todo: { id: '1', message: 'Hello', },
		})

		const deleteButton = wrapper.find('#deleteButton')

		expect(deleteButton.exists()).toBeTruthy()
		expect(deleteButton.text()).toContain('Delete');
	})

	it('Renders the todo text', () => {
		const wrapper = factory({
				todo: { id: '1', message: 'Hello', },
		})

		expect(wrapper.text()).toContain('Hello');
	})
})