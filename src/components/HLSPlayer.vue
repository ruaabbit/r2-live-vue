<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useHLSPlayer } from "../composables/useHLSPlayer";

const videoRef = ref<HTMLVideoElement>();
const loadingRef = ref<HTMLDivElement>();
const errorRef = ref<HTMLDivElement>();
const unmuteHintRef = ref<HTMLDivElement>();

const streamUrl =
  "https://ruabbit-bucket.r2.ruabbit.vip/owncast/hls/0/stream.m3u8";

const {
  isLoading,
  error,
  showUnmuteHint,
  isMuted,
  retry,
  reload,
  toggleMute,
  unmute,
  handleVideoClick,
} = useHLSPlayer(videoRef, streamUrl);

onMounted(() => {
  // 组件挂载后自动初始化播放器
});

onUnmounted(() => {
  // 清理在composable中处理
});
</script>

<template>
  <div class="video-container">
    <video
      ref="videoRef"
      preload="none"
      muted
      autoplay
      playsinline
      @click="handleVideoClick"
    ></video>

    <div v-show="isLoading" ref="loadingRef" class="loading-overlay">
      <div>正在加载直播流...</div>
    </div>

    <div v-show="error" ref="errorRef" class="error-message">
      <div>{{ error }}</div>
      <button class="retry-button" @click="retry">重试</button>
    </div>

    <div
      v-show="showUnmuteHint"
      ref="unmuteHintRef"
      class="unmute-hint"
      @click="unmute"
    >
      <div>🔊 点击屏幕开启声音</div>
      <div class="hint-text">直播需要用户交互才能播放声音</div>
    </div>

    <div class="controls">
      <button class="control-button" @click="reload">刷新</button>
      <button class="control-button" @click="toggleMute">
        {{ isMuted ? "取消静音" : "静音" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 10;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  z-index: 20;
}

.retry-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #45b7b8;
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 15;
}

.control-button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.unmute-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  z-index: 25;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.unmute-hint:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.hint-text {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .controls {
    bottom: 10px;
    right: 10px;
  }

  .control-button {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>
