<script setup lang="ts">
import HLSPlayer from "./components/HLSPlayer.vue";
</script>

<template>
  <div id="app">
    <div class="player-wrapper">
      <div class="player-container">
        <div class="container-header">
          <div class="header-content">
            <h1 class="stream-title">兔小兔的直播</h1>
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>在线</span>
            </div>
          </div>
        </div>
        <div class="player-frame">
          <HLSPlayer />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.player-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.player-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.player-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.container-header {
  padding: 20px 24px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stream-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
}

.player-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  #app {
    padding: 16px;
  }

  .player-container {
    border-radius: 20px;
  }

  .stream-title {
    font-size: 20px;
  }

  .container-header {
    padding: 16px 20px 12px;
  }
}

@media (max-width: 768px) {
  #app {
    padding: 12px;
    align-items: flex-start;
    padding-top: 20px;
  }

  .player-container {
    border-radius: 16px;
  }

  .player-frame {
    border-radius: 0 0 16px 16px;
  }

  .stream-title {
    font-size: 18px;
  }

  .container-header {
    padding: 12px 16px 10px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .status-indicator {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 8px;
    padding-top: 16px;
  }

  .player-container {
    border-radius: 12px;
  }

  .player-frame {
    border-radius: 0 0 12px 12px;
  }

  .stream-title {
    font-size: 16px;
  }

  .container-header {
    padding: 10px 14px 8px;
  }
}

/* 超宽屏幕优化 */
@media (min-width: 1400px) {
  .player-wrapper {
    max-width: 1400px;
  }
}

/* 高度小于宽度时的横屏优化 */
@media (max-height: 600px) and (orientation: landscape) {
  #app {
    padding: 12px;
    align-items: center;
  }

  .container-header {
    padding: 8px 16px 6px;
  }

  .stream-title {
    font-size: 16px;
  }

  .status-indicator {
    font-size: 12px;
  }
}
</style>
