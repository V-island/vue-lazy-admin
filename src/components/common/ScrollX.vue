<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from '@/utils'

defineProps({
  showArrow: {
    type: Boolean,
    default: true,
  },
})

const translateX = ref(0)
const content = ref(null)
const wrapper = ref(null)
const isOverflow = ref(false)

const resetTranslateX = debounce((wrapperWidth, contentWidth) => {
  if (!isOverflow.value) translateX.value = 0
  else if (-translateX.value > contentWidth - wrapperWidth)
    translateX.value = wrapperWidth - contentWidth
  else if (translateX.value > 0) translateX.value = 0
}, 200)

const refreshIsOverflow = debounce(() => {
  const wrapperWidth = wrapper.value?.offsetWidth
  const contentWidth = content.value?.offsetWidth
  isOverflow.value = contentWidth > wrapperWidth
  resetTranslateX(wrapperWidth, contentWidth)
}, 200)

function handleMouseWheel(e) {
  const { wheelDelta } = e
  const wrapperWidth = wrapper.value?.offsetWidth
  const contentWidth = content.value?.offsetWidth
  /**
   * @wheelDelta 平行滚动的值 >0： 右移  <0: 左移
   * @translateX 内容translateX的值
   * @wrapperWidth 容器的宽度
   * @contentWidth 内容的宽度
   */
  if (wheelDelta < 0) {
    if (wrapperWidth > contentWidth && translateX.value < -10) return
    if (wrapperWidth <= contentWidth && contentWidth + translateX.value - wrapperWidth < -10) return
  }
  if (wheelDelta > 0 && translateX.value > 10) return

  translateX.value += wheelDelta
  resetTranslateX(wrapperWidth, contentWidth)
}

const observer = new MutationObserver(refreshIsOverflow)
onMounted(() => {
  refreshIsOverflow()

  window.addEventListener('resize', refreshIsOverflow)
  // 监听内容宽度刷新是否超出
  observer.observe(content.value, { childList: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshIsOverflow)
  observer.disconnect()
})

function handleScroll(x, width) {
  const wrapperWidth = wrapper.value?.offsetWidth
  const contentWidth = content.value?.offsetWidth
  if (contentWidth <= wrapperWidth) return

  // 当 x 小于可视范围的最小值时
  if (x < -translateX.value + 150) {
    translateX.value = -(x - 150)
    resetTranslateX(wrapperWidth, contentWidth)
  }

  // 当 x 大于可视范围的最大值时
  if (x + width > -translateX.value + wrapperWidth) {
    translateX.value = wrapperWidth - (x + width)
    resetTranslateX(wrapperWidth, contentWidth)
  }
}

defineExpose({
  handleScroll,
})
</script>

<template>
  <div
    ref="wrapper"
    class="wrapper"
    bg="white dark:bg-dark"
    @mousewheel.prevent="handleMouseWheel"
  >
    <template v-if="showArrow && isOverflow">
      <div
        absolute
        top-0
        bottom-0
        left-0
        m-auto
        w-20
        h-35
        flex
        items-center
        justify-center
        z-2
        cursor-pointer
        text-18
        bg="white dark:gray-7"
        un-border="1 solid gray-200 rd-2 dark:gray-6"
        @click="handleMouseWheel({ wheelDelta: 120 })"
      >
        <span class="i-ic:baseline-keyboard-arrow-left" />
      </div>
      <div
        absolute
        top-0
        bottom-0
        right-0
        m-auto
        w-20
        h-35
        flex
        items-center
        justify-center
        text-18
        z-2
        cursor-pointer
        un-border="1 solid gray-200 rd-2 dark:gray-6"
        bg="white dark:gray-7"
        @click="handleMouseWheel({ wheelDelta: -120 })"
      >
        <span class="i-ic:baseline-keyboard-arrow-right" />
      </div>
    </template>

    <div
      ref="content"
      class="content"
      :class="{ overflow: isOverflow && showArrow }"
      :style="{
        transform: `translateX(${translateX}px)`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;

  z-index: 9;
  overflow: hidden;
  position: relative;
  .content {
    padding: 0 10px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    transition: transform 0.5s;
    &.overflow {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
}
</style>
