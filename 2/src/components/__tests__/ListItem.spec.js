import { shallowMount } from '@vue/test-utils'
import ListItem from '../ListItem.vue'

const factory = (values = {}) => {
  return shallowMount(ListItem, {
    propsData : values
  })
}

describe('ListItem', () => {
	describe('Given none empty todo', () => {
		const wrapper = factory({
				todo: { id: '1', message: 'Hello', },
		})

		it('Renders an edit button', () => {
			const editButton = wrapper.find('.editButton')

			expect(editButton.exists()).toBeTruthy()
			expect(editButton.text()).toContain('Edit');
		})

		it('Renders a delete button', () => {
			const deleteButton = wrapper.find('.deleteButton')

			expect(deleteButton.exists()).toBeTruthy()
			expect(deleteButton.text()).toContain('Delete');
		})

		it('Emits delete-todo event after click on delete button', () => {
			const deleteButton = wrapper.find('.deleteButton')
			deleteButton.trigger('click')

			expect(wrapper.emitted('delete-todo')).toBeTruthy();
		})

		it('Renders the todo text', () => {
			expect(wrapper.text()).toContain('Hello');
		})

		describe('After clicking edit button', () => {
			beforeAll(() => {
				const editButton = wrapper.find('.editButton');
				editButton.trigger('click');
			})

			it('Renders a cancel button', () => {
				const cancelButton = wrapper.find('.cancelButton')

				expect(cancelButton.exists()).toBeTruthy()
				expect(cancelButton.text()).toContain('Cancel');
			})

			describe('Input field tests:', () => {
				it('Renders an input field', () => {
					const input = wrapper.find('input')
					expect(input.exists()).toBeTruthy()
				})

				it('Renders the todo text in the input field', () => {
					const input = wrapper.find('input')
					expect(input.element.value).toContain('Hello');
				})
			})

			describe('Save button tests:', () => {
				it('Renders a save button', () => {
					const saveButton = wrapper.find('.saveButton')

					expect(saveButton.exists()).toBeTruthy()
					expect(saveButton.text()).toContain('Save');
				})

				it('Emits save-todo event with correct payload', () => {
					const saveButton = wrapper.find('.saveButton')

					saveButton.trigger('click');
					expect(wrapper.emitted('save-todo')).toBeTruthy;
					expect(wrapper.emitted('save-todo')[0]).toEqual(['Hello'])
				})

				it('Renders the todo text after save button was clicked', () => {
					expect(wrapper.text()).toContain('Hello');
				})
			})
		})
	})
})