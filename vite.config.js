import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
} from 'vite-plugin-style-import'

// 设置绝对路径
function resolve(dir) {
  return path.join(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  // 基本路径
  base: './',
  // 构建时的输出目录
  outDir: 'dist',
  // 放置静态资源的目录
  assetsDir: 'assets',
  // 调整内部的 webpack 配置
  resolve: {
    alias: {
      '@': resolve('src'),
      src: resolve('src'),
      api: resolve('src/api'),
      assets: resolve('src/assets'),
      components: resolve('src/components'),
      config: resolve('src/config'),
      directives: resolve('src/directives'),
      'http-request': resolve('src/http-request'),
      i18n: resolve('src/i18n'),
      layout: resolve('src/layout'),
      mixins: resolve('src/mixins'),
      router: resolve('src/router'),
      store: resolve('src/store'),
      styles: resolve('src/styles'),
      utils: resolve('src/utils'),
      views: resolve('src/views'),
      plugins: resolve('src/plugins'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "styles/index.scss";`,
      },
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver()
      ]
    }),
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
      ],
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),
  ],
  // 开发服务,build后的生产模式还需nginx代理
  server: {
    host: 'localhost', // 指定服务器主机名
    port: 8000, // 指定服务器端口
    open: false, // 在服务器启动时自动打开默认浏览器
    https: false, // 是否开启HTTPS
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:3000', // 目标代理服务器地址
    //     changeOrigin: true, // 允许跨域
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }

  },
});
