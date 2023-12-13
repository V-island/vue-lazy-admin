<template>
  <AppPage :show-footer="true">
    <!-- bg-cover :style="{ backgroundImage: `url(${bgImg})` }" -->
    <!-- logo 
    <div flex items-center justify-start>
      <Logo mr-10 h-38 w-38></Logo>
      <div text="black opacity-90 38" font="normal sans">{{ title }}</div>
    </div>-->
    <!-- 表单 -->
    <div m-auto max-w-700 min-w-428 flex items-center justify-center rounded-10 p-15 card-shadow relative z-2
      class="bg-white/50 dark:bg-black/50 backdrop-blur-xl">
      <div w="100%" flex="~ col" p="x-20 y-20" relative>
        <div absolute top-10 class="left-1/2 -translate-x-1/2">
          <Logo h-32 w-32></Logo>
        </div>
        <div relative m-t-50 text="24 black" font="normal semibold" p="b-10"
          un-after="absolute content-empty bottom-6 left-0 w-22 h-4 bg-gradient-line" style="
            --un-gradient: var(--primary-color);
            --un-gradient-stops: var(--primary-color-hover);
          " dark:text-white>
          登录
        </div>
        <div text="14 black" line-height-normal mb-20 dark:text-white>欢迎登录{{ title }}</div>

        <div mt-30>
          <NInput v-model:value="loginInfo.username" class="autofocus h-50 items-center pl-10 text-16"
            placeholder="请输入您的用户名" :maxlength="20" />
        </div>
        <div mt-30>
          <NInput v-model:value="loginInfo.password" class="h-50 items-center pl-10 text-16" type="password"
            show-password-on="mousedown" placeholder="请输入您的密码" :maxlength="20" @keydown.enter="handleLogin" />
        </div>
        <div mt-20>
          <NCheckbox :checked="isRemember" label="记住我" :on-update:checked="(val) => (isRemember = val)" />
        </div>
        <div mt-20>
          <NButton class="h-50 w-full rounded-5 text-16" type="primary" :loading="loading" @click="handleLogin">
            登录
          </NButton>
        </div>
      </div>
    </div>
    <div absolute inset-0 z-0 overflow-hidden pointer-events-none>
      <img src="//api.paugram.com/bing" alt="bg" wh-full object-cover />
    </div>
  </AppPage>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import AppPage from '@/components/page/AppPage.vue';

import { lStorage, setToken } from '@/utils';
import { addDynamicRoutes } from '@/router';
import { useAppStore, useUserStore } from '@/store';
// import bgImg from '@/assets/images/login_bg.webp';
import config from '@/constant/config';
import api from '@/api';

const title = import.meta.env.VITE_TITLE; // 环境变量中读取

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const { query } = useRoute();

const loginInfo = ref({
  username: 'admin',
  password: '123456',
});

// Reactive LocalStorage/SessionStorage - vueuse
const isRemember = useStorage('isRemember', false);
const loading = ref(false);

// 初始化
const initLoginInfo = () => {
  // 从 localStorage 中获取记住的用户名和密码
  const localLoginInfo = lStorage.get('loginInfo');
  if (localLoginInfo) {
    loginInfo.value = {
      username: localLoginInfo.username || 'admin',
      password: localLoginInfo.password || '123456',
    };
  }
};
/** ============== 基础事件 =============== */
// 登录事件
const handleLogin = async () => {
  const { username, password } = loginInfo.value;
  if (!username || !password) return $message.warning('请输入用户名和密码');

  // 判断是否需要验证码
  if (JSON.parse(import.meta.env.VITE_USE_CAPTCHA)) {
    // 腾讯滑块验证码 (在 index.html 中引入 js 文件)
    const captcha = new TencentCaptcha(
      config.TENCENT_CAPTCHA,
      async (res) => res.ret === 0 && loginByUserNameToToken(username, password),
    );
    captcha.show();
  } else {
    loginByUserNameToToken(username, password);
  }
};
/** ============== 数据请求 =============== */
// 用户名登录
const loginByUserNameToToken = async (username, password) => {
  loading.value = true;
  $message.loading('正在验证...');

  // 登录接口
  try {
    const res = await api.login({ username, password });
    // 如果是json-server
    if (JSON.parse(import.meta.env.VITE_USE_JSONSERVER)) {
      setToken(res.data[0].token);// jsonserver token
    } else {
      setToken(res.data.token) // 持久化 token
    }

    $message.success('登录成功');

    await userStore.getUserInfo(); // 获取用户信息
    await appStore.getBlogInfo(); // 获取博客信息

    // "记住我" 功能
    isRemember ? lStorage.set('loginInfo', { username, password }) : lStorage.remove('loginInfo');

    // 动态添加路由
    await addDynamicRoutes();

    // 页面跳转: 根据 URL 中的 redirect 进行跳转
    if (query.redirect) {
      const path = query.redirect;
      Reflect.deleteProperty(query, 'redirect'); // 从对象身上删除属性
      router.push({ path, query });
    } else {
      router.push('/');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initLoginInfo();
});
</script>
