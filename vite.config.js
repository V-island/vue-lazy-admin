import path from 'path';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from "vite-plugin-mock";
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
} from 'vite-plugin-style-import'

// 设置绝对路径
function resolves(dir) {
  return path.join(__dirname, dir);
}

const localEnabled = process.env.USE_MOCK || false;
const prodEnabled = process.env.USE_CHUNK_MOCK || false;

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
      '@': resolves('src'),
      src: resolves('src'),
      api: resolves('src/api'),
      assets: resolves('src/assets'),
      components: resolves('src/components'),
      config: resolves('src/config'),
      'http-request': resolves('src/http-request'),
      layout: resolves('src/layout'),
      mixins: resolves('src/mixins'),
      mock: resolves('src/mock'),
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
        javascriptEnabled: true
      }
    },
  },
  plugins: [
    vue(),
    vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
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
    viteMockServe({
      mockPath: './src/server/mock', // mock文件地址
      localEnabled: localEnabled, // 开发打包开关
      prodEnabled: prodEnabled, // 生产打包开关
      // 这样可以控制关闭mock的时候不让mock打包到最终代码内
      injectCode: `
        import { setupProdMockServer } from './src/server/mockProdServer';
        setupProdMockServer();
      `,
      logger: false, //是否在控制台显示请求日志
      watchFiles: true, // 监视⽂件更改，并重新加载 mock 数据
      supportTs: false, // 打开后，可以读取 ts ⽂件模块。请注意，打开后将⽆法监视.js ⽂件。
    })
  ],
  // 开发服务,build后的生产模式还需nginx代理
  server: {
    host: 'localhost', // 指定服务器主机名
    port: 8080, // 指定服务器端口
    open: false, // 在服务器启动时自动打开默认浏览器
    https: false, // 是否开启HTTPS
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // 目标代理服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }

  },
});
