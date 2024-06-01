import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import Compression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { viteMockServe } from 'vite-plugin-mock'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import I18N from '@intlify/unplugin-vue-i18n/vite

import UnoCss from 'unocss/vite'

const pathSrc = resolve(__dirname, 'src')

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()) as ImportMetaEnv
  return {
    // 开发或生产环境服务的公共基础路径
    base: env.VITE_BASE,

    server: {
      port: 3311,
      // host: '0.0.0.0',
      // 服务启动时是否自动打开浏览器
      open: true,
      cors: true,
      proxy: {
        '/engula': {
          target: env.VITE_API_URL,
          secure: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/engula/, ''),
        },
      },
    },
    plugins: [
      vue(),
      UnoCss(),
      vueJsx(),
      svgLoader(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        resolvers: [AntDesignVueResolver({ importStyle: false })],
        imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head', '@vueuse/math'],
        // 项目级 api 自动按需导入
        dirs: ['src/api/**'],
        dts: resolve(__dirname, 'src/types/auto-imports.d.ts'),
      }),
      Components({
        dirs: [], // 避免解析到src/components (组件自动引入)
        dts: resolve(__dirname, 'src/types/components.d.ts'),
        types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
        resolvers: [AntDesignVueResolver({ importStyle: false }), VueUseComponentsResolver()],
      }),

      VueDevTools(),
      /**
       * i18n 国际化支持
       * https://www.npmjs.com/package/@intlify/unplugin-vue-i18n
       */
      // I18N({
      //   runtimeOnly: false,
      //   compositionOnly: true,
      //   include: ['locales/**'],
      // }),
      viteMockServe({
        mockPath: './mock', // 目录位置
        logger: true, //  是否在控制台显示请求日志
        supportTs: true, // 是否读取ts文件模块
        prodEnabled: true,
      }),
      /** gzip 压缩  https://github.com/anncwb/vite-plugin-compression */
      Compression(),
      /** 图片资源压缩  https://github.com/anncwb/vite-plugin-imagemin */
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        svgo: { plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }] },
      }),
    ],
    resolve: {
      alias: {
        '@': `${pathSrc}/`,
      },
    },
    /*  css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    }, */
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      outDir: 'dist', // 指定打包路径，默认为项目根目录下的dist目录
      minify: 'terser', // Vite 2.6.x 以上需要配置 minify："terser"，terserOptions才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true, // 生产环境去除 debugger
        },
        format: {
          comments: false, // 删除注释
        },
      },
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 自定义chunk 如果chunk超出警告，以下方式也可优化单个chunk文件过大
          manualChunks: {
            antd: ['ant-design-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
    },
  }
})
