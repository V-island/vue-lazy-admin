<template>
  <template>
    <g-modal v-model:visible="visible" width="650px" @onCancel="onCancel">
      <a-result>
        <template #icon>
          <g-svg-icon name="g-resultSuccess" :svgStyle="{ width: '160px', height: '160px' }" />
        </template>
        <template v-if="title != ''" #title>
          <p class="result-title">{{ title }}</p>
        </template>
        <template v-if="subTitle != ''" #subTitle>
          <p class="result-sub-title">{{ subTitle }}</p>
        </template>
        <template v-if="this.$slots.extra" #extra>
          <slot name="extra"></slot>
        </template>
      </a-result>
    </g-modal>
  </template>
</template>
<script>
import { debounce } from 'xe-utils';
import { defineComponent, reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 2,
    },
    onBackUrl: {
      type: String,
      default: null,
    },
  },
  emits: ['onCancel'],
  setup(props, { emit }) {
    const { duration, onBackUrl } = reactive(props);
    const router = useRouter();
    // 用于倒计时实例
    const timeOutTimer = ref(null);

    // 关闭事件
    const onCancel = () => {
      if (onBackUrl) router.push(onBackUrl);
      if (timeOutTimer.value) clearTimeout(timeOutTimer.value);

      emit('onCancel');
    };

    // 开启倒计时关闭功能
    const onCountdownEvent = debounce(() => {
      timeOutTimer.value = setTimeout(() => {
        onCancel();
      }, duration * 1000);
    }, 1000);

    watch(
      () => props.visible,
      (show) => {
        if (show && duration) onCountdownEvent();
      },
      {
        deep: true,
        immediate: true,
      },
    );

    return {
      onCancel,
    };
  },
});
</script>
<style lang="scss" scoped>
.result-title,
.result-sub-title {
  color: $--color-white;
}

.result-title {
  font-size: 16px;
}
.result-sub-title {
  font-size: 20px;
}
</style>
