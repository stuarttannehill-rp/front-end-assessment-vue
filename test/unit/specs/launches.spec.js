import Vue from 'vue'
import launches from '@/components/launches'

describe('launches.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(launches)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.notification').textContent)
      .toEqual('Updated')
  })
})
