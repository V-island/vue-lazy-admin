<template>
  <section class="collapse" @click="onToggleSidebar">
    <div class="login-images" :class="isCollapse ? 'right' : 'left'"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('keepAlive', ['isCollapse']),
  },
  methods: {
    onToggleSidebar() {
      this.$store.dispatch('keepAlive/onToggleSidebar');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/_base.scss';

.collapse {
  @include flexbox();
  @include wh(15px, 40px);
  @include tbc;
  right: -15px;
  border-radius: 0 3px 3px 0;
  background-color: $--color-primary;
  z-index: 1;
  cursor: pointer;

  &:hover {
    background-color: $--color-primary-light-1;
  }

  > .login-images {
    @include wh(18px, 18px);
    @include bgImage('../assets/images/menu-shrink-btn.png', cover);
    color: $--color-white;

    &.left {
      transform: rotate(90deg);
    }
    &.right {
      transform: rotate(-90deg);
    }
  }
}
</style>
