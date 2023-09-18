<template>
  <section class="layout" id="particles">
    <div class="login-box">
      <div class="title">登录</div>
      <a-form
        name="login"
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          label="用户名"
          name="userId"
          placeholder="请输入您的用户名"
          :rules="[{ required: true, message: '请输入您的用户名!' }]"
        >
          <a-input v-model:value="formState.userId" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="passWord"
          placeholder="请输入您的密码"
          :rules="[{ required: true, message: '请输入您的密码!' }]"
        >
          <a-input-password v-model:value="formState.passWord" autocomplete="off" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 8 }">
          <a-button type="primary" html-type="submit" >登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { utilFn, awaitWrap } from 'utils';
import { message } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';

const router = useRouter();
const auth = useAuthStore();
const formState = reactive({
  userId: '',
  passWord: '',
});

// 初始化
const initLoadData = () => {
  // 引入粒子特效的相关配置
  particlesJS(
    'particles',

    {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: '#ffffff',
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000',
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: 'img/github.svg',
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.7,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.6,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab',
          },
          onclick: {
            enable: true,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: false,
    },
  );
};
/** ============== 基础事件 =============== */
// 登录事件
const onFinish = async (values) => {
  utilFn._showPageLoading();
  // 登录获取用户信息、角色、菜单等数据
  const [err, data] = await awaitWrap(auth.loginByUserNameToToken(values));
  utilFn._hidePageLoading();

  if (err || !data.result) return message.error(err || data.message);

  message.success(data.message);
  router.push({
    name: 'erpPut',
  });
};

/** ============== 数据请求 =============== */
onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped>
.layout {
  @include flexbox();
  background: #275474;
  height: 100vh;
}
.login-box {
  padding: 20px;
  width: 400px;
  height: 300px;
  background-color: $--color-white;
  z-index: 9;

  .title {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
  }
  .ant-form {
    margin-top: 50px;
  }
}
</style>
