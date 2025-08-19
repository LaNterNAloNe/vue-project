<template>
  <div id="app-container">
    <header class="app-header">
      <h1>中国网络微短剧英译智能体</h1>
      <p class="subtitle">AI-Powered Chinese Short Drama Translation Agent</p>
    </header>

    <main class="main-content">
      <section class="upload-section">
        <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop">
          <input type of="file" id="file-upload" @change="handleFileChange" accept="video/*" ref="fileInput" style="display: none;">
          
          <div v-if="!videoFile" class="upload-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <p>将视频文件拖拽到此处，或</p>
            <button @click="triggerFileUpload" class="upload-button">选择文件</button>
            <small class="file-info">支持 MP4, AVI, MOV 等格式</small>
          </div>

          <div v-if="videoFile" class="file-details">
            <h4>已选择文件:</h4>
            <p>{{ videoFile.name }}</p>
            <button @click="startProcessing" class="process-button" :disabled="isProcessing">
              {{ isProcessing ? '处理中...' : '开始翻译' }}
            </button>
          </div>
        </div>
      </section>

      <section class="display-section">
        <div class="video-player-container">
          <video v-if="videoSrc" :src="videoSrc" controls class="video-player"></video>
          <div v-else class="video-placeholder">
            <p>上传视频后在此预览</p>
          </div>
        </div>

        <div class="subtitle-display-container">
          <h3>字幕预览 (Subtitle Preview)</h3>
          <div class="subtitle-area">
            <div v-if="subtitles.length === 0" class="subtitle-placeholder">
              <p>翻译生成的字幕将在此显示...</p>
            </div>
            <ul v-else class="subtitle-list">
              <li v-for="(subtitle, index) in subtitles" :key="index" class="subtitle-item">
                <span class="timestamp">{{ subtitle.timestamp }}</span>
                <p class="text-original">{{ subtitle.original }}</p>
                <p class="text-translated">{{ subtitle.translated }}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const fileInput = ref(null);
    const videoFile = ref(null);
    const videoSrc = ref('');
    const isProcessing = ref(false);
    
    // Placeholder for subtitle data
    const subtitles = ref([
      // Example data structure
      // { timestamp: '00:00:01,234 --> 00:00:03,456', original: '你好！', translated: 'Hello!' },
      // { timestamp: '00:00:04,000 --> 00:00:06,789', original: '今天天气真好。', translated: 'The weather is great today.' }
    ]);

    const triggerFileUpload = () => {
      fileInput.value.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('video/')) {
        videoFile.value = file;
        videoSrc.value = URL.createObjectURL(file);
      } else {
        alert('请选择一个有效的视频文件！');
      }
    };
    
    const handleDrop = (event) => {
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            videoFile.value = file;
            videoSrc.value = URL.createObjectURL(file);
        } else {
            alert('请拖入一个有效的视频文件！');
        }
    };

    const startProcessing = () => {
      if (!videoFile.value) {
        alert('请先选择一个文件！');
        return;
      }
      isProcessing.value = true;
      console.log('开始处理文件:', videoFile.value.name);
      
      // --- API Integration Placeholder ---
      // 1. Upload file to server
      // 2. Poll for processing status
      // 3. On success, fetch subtitle data
      // ------------------------------------

      // Simulate API call and receiving data
      setTimeout(() => {
        subtitles.value = [
          { timestamp: '00:00:01,234 --> 00:00:03,456', original: '你好！', translated: 'Hello!' },
          { timestamp: '00:00:04,000 --> 00:00:06,789', original: '今天天气真好。', translated: 'The weather is great today.' },
          { timestamp: '00:00:07,100 --> 00:00:09,500', original: '我们去公园吧。', translated: "Let's go to the park." }
        ];
        isProcessing.value = false;
        console.log('处理完成');
      }, 3000); // Simulate a 3-second processing time
    };

    return {
      fileInput,
      videoFile,
      videoSrc,
      isProcessing,
      subtitles,
      triggerFileUpload,
      handleFileChange,
      handleDrop,
      startProcessing
    };
  }
}
</script>

<style>
/* Global Styling */
:root {
  --primary-color: #4A90E2;
  --secondary-color: #50E3C2;
  --background-color: #f4f7f9;
  --text-color: #333;
  --border-color: #dbe2e8;
  --card-bg-color: #ffffff;
  --font-family: 'Helvetica Neue', Arial, sans-serif;
}

body {
  font-family: var(--font-family);
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

#app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.app-header {
  text-align: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.app-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin: 0;
}

.app-header .subtitle {
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}

/* Main Content Layout */
.main-content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.upload-section, .display-section {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.upload-section {
  flex: 1;
  min-width: 350px;
}

.display-section {
  flex: 2;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Upload Box */
.upload-box {
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box:hover {
  border-color: var(--primary-color);
  background-color: #f9fcff;
}

.upload-icon {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.upload-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin: 1rem 0;
}

.upload-button:hover {
  background-color: #357abd;
}

.file-info {
  color: #888;
  font-size: 0.85rem;
}

.file-details p {
    word-break: break-all;
    background-color: #f0f0f0;
    padding: 0.5rem;
    border-radius: 5px;
}

.process-button {
    background-color: var(--secondary-color);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s ease;
    margin-top: 1rem;
}

.process-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Display Section */
.video-player-container, .subtitle-display-container {
  width: 100%;
}

.video-player {
  width: 100%;
  border-radius: 8px;
  background-color: #000;
}

.video-placeholder {
  width: 100%;
  height: 350px;
  background-color: #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.subtitle-area {
  height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
}

.subtitle-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
}

.subtitle-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.subtitle-item {
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}
.subtitle-item:last-child {
    border-bottom: none;
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
  margin-bottom: 0.4rem;
  display: block;
}

.text-original {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.3rem 0;
}

.text-translated {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 500;
  margin: 0;
}

</style>