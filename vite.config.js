import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// 设置绝对路径
function resolves(dir) {
  return path.join(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  // 基本路径
  base: '/',
  // 构建时的输出目录
  outDir: 'dist',
  // 放置静态资源的目录
  assetsDir: 'assets',
  // 调整内部的 webpack 配置
  resolve: {
    alias: {
      '@': resolves('src'),
      src: resolves('src'),
      api: resolves('src/api'),
      assets: resolves('src/assets'),
      components: resolves('src/components'),
      config: resolves('src/config'),
      'http-request': resolves('src/http-request'),
      layout: resolves('src/layout'),
      mixins: resolves('src/mixins'),
      router: resolves('src/router'),
      store: resolves('src/store'),
      styles: resolves('src/styles'),
      utils: resolves('src/utils'),
      views: resolves('src/views'),
      plugins: resolves('src/plugins'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "styles/index.scss";`,
      },
      less: {
        modifyVars: {
          'primary-color': '#1890ff'
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: 'less' })],
    }),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          },
        },
      ],
    }),
    createSvgIconsPlugin({
      iconDirs: [resolves('src/assets/svg')],
      symbolId: '[name]',
    }),
    legacy({
      targets: ['defaults', 'ie >= 11', 'Android >= 7', 'chrome < 60', 'edge < 15'], // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })
  ],
  // 开发服务,build后的生产模式还需nginx代理
  server: {
    host: '0.0.0.0', // 指定服务器主机名
    port: 8883, // 指定服务器端口
    open: false, // 在服务器启动时自动打开默认浏览器
    https: false, // 是否开启HTTPS
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // 目标代理服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
