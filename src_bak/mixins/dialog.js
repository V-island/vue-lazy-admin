let DialogMixin = {
  props: {
    config: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      // default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  },
}

export default DialogMixin
