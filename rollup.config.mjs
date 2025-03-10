import * as glob from 'glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// 获取所有 src 目录下的入口文件
const entryFiles = glob.sync('src/**/index.mjs');

// 创建多入口配置
const configs = entryFiles.map(input => {
  // 从入口文件路径提取输出文件名
  const outputName = input.replace('src/', '').replace('/index.mjs', '');

  return {
    input,
    output: {
      file: `./dist/${outputName}.mjs`,
      format: 'esm',
    },
    // 添加插件以内联所有依赖
    plugins: [
      nodeResolve({ preferBuiltins: true }), // 解析第三方模块
      commonjs(), // 将 CommonJS 模块转换为 ES 模块
    ],
  };
});

// 添加 cli.mjs 作为额外的入口点
configs.push({
  input: 'src/cli.mjs',
  output: {
    file: './dist/cli.mjs',
    format: 'esm',
  },
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
  ],
});

export default configs;