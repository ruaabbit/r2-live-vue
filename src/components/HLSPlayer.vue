<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useHLSPlayer } from "../composables/useHLSPlayer";

const videoRef = ref<HTMLVideoElement>();
const loadingRef = ref<HTMLDivElement>();
const errorRef = ref<HTMLDivElement>();
const unmuteHintRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const isFullscreen = ref(false);

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

// 检测是否为移动设备
const isMobile = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
  );
};

// 全屏功能
const toggleFullscreen = async () => {
  if (!containerRef.value) return;

  try {
    if (!document.fullscreenElement) {
      await containerRef.value.requestFullscreen();
      isFullscreen.value = true;
      
      // 如果是移动设备，尝试多种方式提示或强制横屏
      if (isMobile()) {
        // 方法1: 尝试使用Screen Orientation API
        try {
          const orientation = (screen as any).orientation;
          if (orientation && orientation.lock) {
            await orientation.lock('landscape');
          }
        } catch (orientationError) {
          // 方法2: 如果Screen Orientation API不支持，显示横屏提示
          console.log('Screen Orientation API不支持，将使用CSS优化横屏体验');
          
          // 添加CSS类来优化横屏显示
          document.body.classList.add('fullscreen-landscape-hint');
          
          // 尝试触发设备方向改变事件（某些设备可能响应）
          if (window.DeviceOrientationEvent) {
            window.dispatchEvent(new Event('orientationchange'));
          }
        }
      }
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
      
      // 退出全屏时清理
      if (isMobile()) {
        try {
          const orientation = (screen as any).orientation;
          if (orientation && orientation.unlock) {
            orientation.unlock();
          }
        } catch (orientationError) {
          // 清理CSS类
          document.body.classList.remove('fullscreen-landscape-hint');
        }
        
        // 清理CSS类
        document.body.classList.remove('fullscreen-landscape-hint');
      }
    }
  } catch (error) {
    console.error('全屏操作失败:', error);
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  // 组件挂载后自动初始化播放器
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  // 清理在composable中处理
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<template>
  <div ref="containerRef" class="video-container">
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
      <button
        class="fullscreen-button"
        @click="toggleFullscreen"
        :title="isFullscreen ? '退出全屏' : '全屏显示'"
      >
        <svg
          v-if="!isFullscreen"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
          />
        </svg>
        <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: inherit;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
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
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
  height: 36px;
  display: flex;
  align-items: center;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.fullscreen-button {
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.fullscreen-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.fullscreen-button:active {
  transform: scale(0.95);
}

.fullscreen-button svg {
  transition: transform 0.2s ease;
}

.fullscreen-button:hover svg {
  transform: scale(1.1);
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

  .fullscreen-button {
    width: 36px;
    height: 36px;
    padding: 8px;
  }

  .fullscreen-button svg {
    width: 14px;
    height: 14px;
  }
}

/* 全屏状态下的样式 */
.video-container:fullscreen {
  border-radius: 0;
}

.video-container:fullscreen video {
  border-radius: 0;
  object-fit: contain;
}

.video-container:fullscreen .controls {
  bottom: 30px;
  right: 30px;
}

@media (max-width: 768px) {
  .video-container:fullscreen .controls {
    bottom: 20px;
    right: 20px;
  }
}
</style>
