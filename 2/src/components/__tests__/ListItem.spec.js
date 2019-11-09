import { shallowMount } from '@vue/test-utils'
import ListItem from '../ListItem.vue'

describe('ListItem', () => {
	it('Renders a delete button', () => {
		const wrapper = shallowMount(ListItem, {
			propsData: {
				todo: { id: '1', message: 'Hello', },
			}
		})

		const deleteButton = wrapper.find('#deleteButton')

		expect(deleteButton.exists()).toBeTruthy()
		expect(deleteButton.text()).toContain('Delete');
	})
})