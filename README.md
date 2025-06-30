# HLS Live Stream Player - Vue3版

兔小兔的直播播放器，使用Vue3和TypeScript重构的现代化版本。

## 功能特性

- 🎥 HLS直播流播放支持
- 🔄 自动重连机制
- 📱 响应式设计，支持移动端
- 🔊 用户交互音频控制
- 🌐 网络状态监控
- ⚡ 基于Vue3 Composition API
- 🛠️ TypeScript类型安全
- 📦 Vite快速构建

## 技术栈

- **Vue 3** - 现代化的响应式框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的前端构建工具
- **HLS.js** - HTTP Live Streaming支持
- **Composition API** - Vue3的组合式API

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   └── HLSPlayer.vue          # HLS播放器组件
├── composables/
│   └── useHLSPlayer.ts        # HLS播放器逻辑
├── App.vue                    # 主应用组件
├── main.ts                    # 应用入口
└── style.css                  # 全局样式
```

## 核心组件

### HLSPlayer.vue
主要的视频播放器组件，包含：
- 视频播放控制
- 加载状态显示
- 错误处理界面
- 音频控制提示

### useHLSPlayer.ts
包含所有播放器逻辑的composable：
- HLS流初始化
- 错误处理和重连
- 健康检查机制
- 用户交互处理

## 配置

可以在 `src/composables/useHLSPlayer.ts` 中修改以下配置：

- `maxReconnectAttempts`: 最大重连次数 (默认: 5)
- `reconnectDelay`: 重连延迟 (默认: 5000ms)
- `healthCheckInterval`: 健康检查间隔 (默认: 30000ms)

## 部署

构建完成后，`dist` 目录包含所有静态文件，可以部署到任何静态文件服务器。

## 浏览器支持

- Chrome/Edge 85+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Android Chrome 85+

## 许可证

MIT License
