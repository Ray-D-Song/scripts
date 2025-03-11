#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 解析命令行参数
const args = process.argv.slice(2);
let scriptType = null;
const remainingArgs = [];

// 遍历命令行参数
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-s' && i + 1 < args.length) {
    scriptType = args[i + 1];
    i++; // 跳过下一个参数
  } else {
    remainingArgs.push(args[i]);
  }
}

// 如果未提供脚本类型，显示使用说明并退出
if (!scriptType) {
  console.log('用法: scripts -s <脚本类型> [脚本特定参数]');
  console.log('');
  console.log('可用的脚本类型:');
  console.log('  latex-render    LaTeX 渲染器，将 LaTeX 文件转换为 HTML');
  console.log('');
  console.log('例如:');
  console.log('  scripts -s latex-render -i /path/to/input -o /path/to/output');
  process.exit(1);
}

// 根据脚本类型执行相应的脚本
async function runScript() {
  try {
    switch (scriptType.toLowerCase()) {
      case 'latex-render':
        // 执行 LatexRender 脚本
        const latexRenderPath = path.join(__dirname, 'LatexRender.mjs');
        
        // 检查脚本文件是否存在
        try {
          await fs.access(latexRenderPath);
        } catch (err) {
          console.error(`错误: 找不到 LaTeX 渲染器脚本。`);
          process.exit(1);
        }
        
        // 使用 spawn 执行脚本
        const latexRender = spawn('node', [latexRenderPath, ...remainingArgs], {
          stdio: 'inherit'
        });
        
        latexRender.on('close', (code) => {
          process.exit(code);
        });
        break;
        
      default:
        console.error(`错误: 未知的脚本类型 "${scriptType}"`);
        console.log('可用的脚本类型: latex-render');
        process.exit(1);
    }
  } catch (err) {
    console.error('执行脚本时发生错误:', err);
    process.exit(1);
  }
}

runScript().catch(err => {
  console.error('致命错误:', err);
  process.exit(1);
}); 