<template>
  <section>
    <el-sub-menu v-if="!menu.hidden" :index="`${menu.url}`" :key="`${menu.name}`">
      <template #title>
        <div class="images-title">
          <el-image
            class="icon"
            v-if="menu.customIcon"
            :src="menu.customIcon"
            fit="fill"
          ></el-image>
          {{ menu.name }}
        </div>
      </template>
      <template v-for="(childItem, childIndex) in menu.children">
        <template v-if="childItem.children && childItem.children.length > 0 && childItem.name">
          <VcSubMenu :menu="childItem" :key="childIndex" />
        </template>
        <el-menu-item v-else :index="`${childItem.url}`" :key="`${childItem.name}`">
          <template #title>
            <span>{{ childItem.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-sub-menu>
  </section>
</template>

<script>
export default {
  name: 'VcSubMenu',
  props: {
    menu: {
      type: Object,
      // default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/_base.scss';
.images-title {
  @include flexbox(flex-start);
  .icon {
    @include wh(18px, 18px);
    font-size: 18px;
    color: $--color-primary;
    margin-right: 12px;
    line-height: 1;
  }
}
</style>
