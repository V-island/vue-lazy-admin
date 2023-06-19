<template>
  <el-tabs
    class="container"
    type="card"
    :model-value="activeView.name"
    :closable="viewCacheTabs.length > 1"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
  >
    <el-tab-pane v-for="item in viewCacheTabs" :key="item.name" :name="item.name">
      <template #label>
        <a :href="menuUrl" v-if="isQuestion == 'true' && activeView.name == item.name" target="_blank" rel="noopenner noreferrer">
          <img src="@/assets/images/question.png" />
        </a>
        {{ item.label }}
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getResult } from 'utils';
import { mapState } from 'vuex';
import { findByMenuUrl, operationRecordAdd } from 'api/sys/questionService';

export default {
  data() {
    return {
      query: {
        menuUrl: '',
        ticket: '',
      },
      isQuestion: '',
      menuUrl: '',
    };
  },
  computed: {
    ...mapState('keepAlive', ['viewCacheTabs', 'activeView']),
    ...mapState('user', ['userInfo']),
  },
  watch: {
    $route: {
      handler: function (val) {
        console.log('route', val);
        this.menuUrl = 'http://25.55.59.247:28801/#/search/list?type=cz&title=' + val.path;
        const userName = this._get(this.userInfo, `username`, '');
        this.query = {
          menuUrl: val.path,
          userName: userName,
        };
        this.initLoadData();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 初始化
    async initLoadData() {
      let [err, data] = await this._awaitWrap(this.getAllData());
      if (err || !data.result) return this.$message.error(err || data.message);
    },

    async getAllData() {
      const query = this._get(this, 'query', {});
      const params = {
        ...query,
      };
      // 查询是否有问答
      let [error, data] = await this._awaitWrap(findByMenuUrl(params));
      if (error) return Promise.resolve(getResult(false, error));
      this.isQuestion = data.data || "";
      

      // 操作记录
      let [errorAdd] = await this._awaitWrap(operationRecordAdd(params));
      if (errorAdd) return Promise.resolve(getResult(false, errorAdd));

      return Promise.resolve(getResult(true, '问答初始化完成'));
    },

    handleTabClick(tab) {
      this.$store.dispatch('keepAlive/setActiveView', this.viewCacheTabs[tab.index]);
      this.$router.push(this.viewCacheTabs[tab.index].path);
    },
    handleTabRemove(name) {
      const newTabs = [...this.viewCacheTabs];

      this.$store.dispatch('keepAlive/deleteCacheView', name);

      if (this.activeView.name !== name) return false;

      const index = newTabs.findIndex((item) => item.name === name);

      if (index > 0) return this.$router.replace(newTabs[index - 1].path);
    },
  },
};
</script>
