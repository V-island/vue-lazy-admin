<template>
  <section class="device-layout">
    <div class="device-card" v-for="item in tableData" :key="item.devCode">
      <div class="left-top">
        <g-svg-icon
          class="svg-icon"
          :name="getDictToIconName(cache.deviceType, item.devType)"
          :svgStyle="{
            width: '50px',
            height: '50px',
          }"
        >
        </g-svg-icon>
        <div class="title">{{ item.devName }}</div>
        <div class="code">{{ item.devCode }}</div>
      </div>
      <div class="right-top">
        <a-tag color="error" v-if="item.isOnline == 0"> 离线 </a-tag>
        <a-tag color="success" v-else> 在线 </a-tag>
      </div>
      <div class="right-bottom">
        <div class="tip-item" v-for="(tip, index) in item.data" :key="index">
          <!-- 烟雾传感器 -->
          <template v-if="['5'].includes(item.devType)">
            <span class="abnormal" v-if="tip > 1000">异常</span>
            <span class="normal" v-else>正常</span>
          </template>

          <!-- 水浸传感器 -->
          <template v-else-if="['6'].includes(item.devType)">
            <span class="abnormal" v-if="tip == 2">异常</span>
            <span class="normal" v-else>正常</span>
          </template>
          <template v-else>
            <span class="normal">{{ tip }}</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, computed, onMounted, onUnmounted, inject, getCurrentInstance } from 'vue';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import { utilFn, awaitWrap } from 'utils';
import { cacheStore } from 'store/cache';

const WSUtil = inject('WSUtil');
const { proxy } = getCurrentInstance();
const tableData = ref([]);
const cache = cacheStore();

// 初始化
const initLoadData = () => {
  WSUtil.init();
};

/** ============== 基础事件 =============== */
// 格式化设备图标
const getDictToIconName = (findDict, value) => {
  const item = proxy.$utils.find(findDict, (item) => `${item.value}` == `${value}`);
  if (item) return item.icon;
  return '-';
};

/** ============== 消息监听队列 =============== */
// 设备实时数据
CEvent.on('DeviceRealTimeStatus', (data) => {
  const onRealTimeStatus = proxy.$utils.debounce(() => {
    tableData.value = data || [];
  }, 100);
  onRealTimeStatus();
});

/** ============== 初始化访问 =============== */
onMounted(() => {
  initLoadData();
});

/** ============== 销毁钩子 =============== */
onUnmounted(() => {
  // 主动断开
  WSUtil.dispose();
  // 清空监听事件
  CEvent.clear();
});
</script>

<style lang="scss" scoped>
.device-layout {
  @include flexbox(flex-start, center, center, row, wrap);
}
.device-card {
  @include wh(260px, 260px);
  background: $--color-white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  margin: 10px;
  padding: 20px 15px;
}
.left-top {
  position: absolute;
  top: 20px;
  left: 20px;
  text-align: center;
  .title {
    font-weight: 600;
    font-size: 16px;
    margin: 10px 0;
  }
  .code {
    font-size: 16px;
  }
}
.right-top {
  position: absolute;
  top: 15px;
  right: 10px;
}
.right-bottom {
  position: absolute;
  bottom: 25px;
  right: 20px;
  color: $--color-primary;
}
.svg-icon {
  color: $--color-text-primary;
}
.tip-item {
  font-size: 24px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  .normal {
    color: $--color-success;
  }
  .abnormal {
    color: $--color-danger;
  }
}
:deep(.ant-tag) {
  font-size: 16px;
  padding: 3px 7px;
}
</style>
