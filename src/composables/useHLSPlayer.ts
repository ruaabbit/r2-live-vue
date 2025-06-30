import { ref, onMounted, onUnmounted, type Ref } from "vue";
import Hls from "hls.js";

export function useHLSPlayer(
  videoRef: Ref<HTMLVideoElement | undefined>,
  streamUrl: string
) {
  const isLoading = ref(true);
  const error = ref("");
  const showUnmuteHint = ref(false);
  const isMuted = ref(true);

  let hls: Hls | null = null;
  let reconnectAttempts = 0;
  let healthCheckTimer: number | null = null;
  let hasUserInteracted = false;
  let videoWaitTimer: number | null = null;

  // 参数常量
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000;
  const healthCheckInterval = 30000;
  const maxVideoWaitTime = 10000; // 最大等待视频元素时间

  // 状态切换
  const setLoading = (v: boolean) => (isLoading.value = v);
  const setError = (msg: string) => {
    error.value = msg;
    setLoading(false);
  };

  // 事件处理
  function handleHLSError(_: any, data: any) {
    if (data.fatal) {
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setError("网络错误，正在尝试重连...");
        retry();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setError("媒体错误，正在尝试恢复...");
        hls?.recoverMediaError();
      } else {
        setError("播放器错误，正在重新加载...");
        retry();
      }
    }
  }

  function startPlay() {
    setLoading(true);
    error.value = "";
    if (Hls.isSupported()) {
      if (hls) hls.destroy();
      hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 10000,
      });
      hls.on(Hls.Events.ERROR, handleHLSError);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.value?.play().catch(() => setLoading(false));
      });
      hls.loadSource(streamUrl);
      if (videoRef.value) hls.attachMedia(videoRef.value);
    } else if (videoRef.value?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = streamUrl;
      videoRef.value.addEventListener("canplay", () => {
        videoRef.value?.play().catch(() => setLoading(false));
      });
    } else {
      setError("您的浏览器不支持 HLS 视频播放");
    }
    startHealthCheck();
  }

  function startHealthCheck() {
    stopHealthCheck();
    healthCheckTimer = window.setInterval(() => {
      if (videoRef.value?.paused && !videoRef.value?.ended && !isLoading.value) {
        videoRef.value.play().catch(() => {});
      }
      // 更严谨的HLS错误检查
      if (hls && hls.media) {
        const mediaError = hls.media.error;
        if (mediaError && mediaError.code !== MediaError.MEDIA_ERR_ABORTED) {
          retry();
        }
      }
    }, healthCheckInterval);
  }
  function stopHealthCheck() {
    if (healthCheckTimer) {
      window.clearInterval(healthCheckTimer);
      healthCheckTimer = null;
    }
  }

  function retry() {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setError("连接失败次数过多，请检查网络或稍后重试");
      return;
    }
    reconnectAttempts++;
    setTimeout(startPlay, reconnectDelay);
  }

  function reload() {
    reconnectAttempts = 0;
    error.value = "";
    startPlay();
  }

  // 手动重试函数（用于用户主动点击重试按钮）
  function manualRetry() {
    reconnectAttempts = 0;
    error.value = "";
    startPlay();
  }

  function toggleMute() {
    if (videoRef.value) {
      videoRef.value.muted = !videoRef.value.muted;
      isMuted.value = videoRef.value.muted;
    }
  }

  function unmute() {
    if (videoRef.value) {
      videoRef.value.muted = false;
      isMuted.value = false;
      showUnmuteHint.value = false;
    }
  }

  function handleVideoClick() {
    if (videoRef.value?.muted) unmute();
  }

  // 事件监听器引用，用于正确移除
  const eventHandlers = {
    visibilitychange: () => {
      document.hidden ? stopHealthCheck() : startHealthCheck();
    },
    online: retry,
    offline: () => {
      setError("网络连接已断开");
      stopHealthCheck();
    },
    userInteraction: () => {
      hasUserInteracted = true;
    }
  };

  // 事件监听
  function setupEvents() {
    if (!videoRef.value) return;
    const v = videoRef.value;
    
    // 视频事件
    v.addEventListener("loadstart", () => setLoading(true));
    v.addEventListener("canplay", () => setLoading(false));
    v.addEventListener("error", () => setError("视频播放错误"));
    v.addEventListener("ended", retry);
    v.addEventListener("pause", () => {
      setTimeout(() => {
        if (v.paused && !v.ended && !isLoading.value) v.play().catch(() => {});
      }, 1000);
    });
    v.addEventListener("play", () => {
      setLoading(false);
      error.value = "";
      reconnectAttempts = 0;
      if (v.muted && hasUserInteracted) {
        showUnmuteHint.value = true;
        setTimeout(() => (showUnmuteHint.value = false), 10000);
      }
    });
    
    // 全局事件
    document.addEventListener("visibilitychange", eventHandlers.visibilitychange);
    window.addEventListener("online", eventHandlers.online);
    window.addEventListener("offline", eventHandlers.offline);
    document.addEventListener("click", eventHandlers.userInteraction);
  }

  function cleanup() {
    stopHealthCheck();
    
    // 清理视频等待定时器
    if (videoWaitTimer !== null) {
      clearInterval(videoWaitTimer);
      videoWaitTimer = null;
    }
    
    // 销毁HLS实例
    if (hls) {
      hls.destroy();
      hls = null;
    }
    
    // 正确移除事件监听器
    document.removeEventListener("visibilitychange", eventHandlers.visibilitychange);
    window.removeEventListener("online", eventHandlers.online);
    window.removeEventListener("offline", eventHandlers.offline);
    document.removeEventListener("click", eventHandlers.userInteraction);
  }

  onMounted(() => {
    let waitAttempts = 0;
    const maxWaitAttempts = maxVideoWaitTime / 50; // 最大尝试次数
    
    // 等待 videoRef.value 存在后再绑定事件
    videoWaitTimer = setInterval(() => {
      waitAttempts++;
      
      if (videoRef.value) {
        setupEvents();
        if (videoWaitTimer !== null) {
          clearInterval(videoWaitTimer);
          videoWaitTimer = null;
        }
        startPlay();
      } else if (waitAttempts >= maxWaitAttempts) {
        // 超时处理
        if (videoWaitTimer !== null) {
          clearInterval(videoWaitTimer);
          videoWaitTimer = null;
        }
        setError("视频元素加载超时，请刷新页面重试");
      }
    }, 50);
  });
  onUnmounted(cleanup);

  return {
    isLoading,
    error,
    showUnmuteHint,
    isMuted,
    retry: manualRetry, // 导出手动重试函数供用户点击使用
    reload,
    toggleMute,
    unmute,
    handleVideoClick,
  };
}
