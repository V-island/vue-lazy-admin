import { utilFn } from 'utils'

// 局部mixin
export const mixins = {}

// 全局mixin
export default function globalMixin(Vue) {
  Vue.mixin({
    methods: {
      ...utilFn,
    },
  })
}
