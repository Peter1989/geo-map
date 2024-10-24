import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import * as path from "path"
import typescript2 from "rollup-plugin-typescript2"
import dts from "vite-plugin-dts"
import { viteStaticCopy } from "vite-plugin-static-copy"
import sassDts from "vite-plugin-sass-dts"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true
    }),
    sassDts(),
    cssInjectedByJsPlugin(),
    viteStaticCopy({
      targets: [
        // { src: "src/assets/geo-map.scss", dest: "dist/assets" },
        { src: "src/assets/scss", dest: "dist/assets" }
      ]
    }),
    typescript2({
      check: false,
      include: ["src/components/**/*.vue"],
      tsconfigOverride: {
        compilerOptions: {
          outDir: "dist",
          sourceMap: true,
          declaration: true,
          declarationMap: true
        }
      },
      exclude: ["vite.config.ts"]
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "src/components/index.ts",
      name: "geoMapDraw",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `geo-map-draw.${format}.js`
    }
    // rollupOptions: {
    // make sure to externalize deps that shouldn't be bundled
    // into your library
    // input: {
    //   main: path.resolve(__dirname, "src/components/index.ts")
    // },
    // external: ["vue"]
    // output: {
    //   assetFileNames: (assetInfo) => {
    //     if (assetInfo.name === "main.css") return "geomap.min.css"
    //     return assetInfo.name
    //   },
    //   exports: "named",
    //   globals: {
    //     vue: "Vue"
    //   }
    // }
    // }
  },
  // ↓解析配置
  resolve: {
    // ↓路径别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@comp": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@api": path.resolve(__dirname, "src/api"),
      "@store": path.resolve(__dirname, "src/store"),
      "@components": path.resolve(__dirname, "src/components"),
      "@modelManage": path.resolve(__dirname, "src/views/modelManage"),
      "@sampleMark": path.resolve(__dirname, "src/views/sampleMark")
    }
  }
})
