<template>
  <svg :class="`svg-icon ${className}`" aria-hidden="true" :style="svgStyle">
    <use :href="iconName"></use>
  </svg>
</template>
<script>
import { defineComponent, computed, watch, ref } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    svgStyle: {
      type: Object,
      default: () => {
        return {
          width: '31px',
          height: '24px',
        };
      },
    },
  },
  setup(props, { emit }) {
    const iconName = computed(() => `#${props.name}`);

    return {
      iconName,
    };
  },
});
</script>
<style lang="scss" scoped>
.svg-icon {
  // width: 31px;
  // height: 24px;
  fill: currentColor;
  vertical-align: middle;
  color: inherit;
  outline: none;
}
</style>
