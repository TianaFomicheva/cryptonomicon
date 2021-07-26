import AddField from '../src/components/AddField.vue'
import { mount } from '@vue/test-utils'

test('AddField', () => {
  const wrapper = mount(AddField, {
    data() {
      return {
        ticker: 'BTC',
      }
    }
  })
  expect(wrapper.find('#wallet').element.value).toEqual('BTC')
})
