<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="1200px"
      @update:visible="config.show = $event"
    >
      <div class="html-body" v-html="_get(config, 'params.historicalSolution', '')"></div>
      <template #footer>
        <el-button @click="config.show = false" icon="circle-close">关闭</el-button>
      </template>
    </VcDialog>
  </section>
</template>

<script>
import DialogMixin from 'mixins/dialog';

export default {
  mixins: [DialogMixin],
};
</script>

<style lang="scss" scoped></style>
