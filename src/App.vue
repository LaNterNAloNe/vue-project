<template>
  <div id="app-container">
    <header class="app-header">
      <h1>中国网络微短剧英译智能体</h1>
      <p class="subtitle">AI-Powered Chinese Short Drama Translation Agent</p>
    </header>

    <main class="main-content">
      <section class="upload-section">
        <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileUpload">
          <input type="file" id="file-upload" @change="handleFileChange" accept=".srt,.txt" ref="fileInput" style="display: none;">
          
          <div v-if="!File" class="upload-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> <!-- upload icon -->
            <p>将文本或字幕文件拖拽到此处</p>
            <small class="file-info">支持 txt , srt 等格式</small>
          </div>

          <div v-if="File" class="file-details">
            <h4>已选择文件:</h4>
            <p>{{ File.name }}</p>
            <button @click.stop="startProcessing" class="process-button" :disabled="isProcessing">
              {{ isProcessing ? '处理中...' : '开始翻译' }}
            </button>
          </div>
        </div>
      </section>

      <section class="display-section">
        <h3 class="tight-title">源字幕预览 (Original Subtitle Preview)</h3>
        <div class="subtitle-display-container">
          <div class="subtitle-area">
            <div v-if="File === null" class="subtitle-placeholder"> 
              <p>上传的文件或字幕内容将在此显示...</p>
            </div>
            <div v-if="File !== null && original_subtitles.length === 0" class="subtitle-placeholder">
              <p>上传的文件暂无内容</p>
            </div>

            <ul v-if="original_subtitles.length > 0" class="subtitle-list">
              <li v-for="(subtitle, index) in original_subtitles" :key="index" class="subtitle-item">
                <span class="timestamp">{{ subtitle.timestamp }}</span>
                <p class="text-original" v-html="subtitle.original"></p>
                <p class="text-original" v-if="subtitle.translated">{{ subtitle.translated }}</p>
              </li>
            </ul>

          </div>
        </div>

        <h3 class="tight-title">翻译字幕预览 (Translated Subtitle Preview)</h3>
        <div class="subtitle-display-container">
          <div class="subtitle-area">

            <div v-if="!isTranslated" class="subtitle-placeholder"> 
            <!-- 此处应判断是否完成翻译（翻译结果包含无文本【特殊情况】） -->
              <p>翻译生成的字幕将在此显示...</p>
            </div>

            <div v-if="translated_subtitles.length === 0 && isTranslated" class="subtitle-placeholder"> 
              <p>暂无翻译结果</p>
            </div>

            <ul v-else class="subtitle-list">
              <li v-for="(subtitle, index) in translated_subtitles" :key="index" class="subtitle-item">
                <span class="timestamp">{{ subtitle.timestamp }}</span>
                <p class="text-original">{{ subtitle.original }}</p>
                <p class="text-translated">{{ subtitle.translated }}</p>
              </li>
            </ul>

          </div>
          <button v-if="isTranslated" @click="downloadSRT(translated_subtitles)" class="process-button">下载字幕文件</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const fileInput = ref(null);
    const File = ref(null);
    const isProcessing = ref(false);
    const isTranslated = ref(false);
    
    // Placeholder for subtitle data
    const original_subtitles = ref([
      // Example data structure
      // { timestamp: '00:00:01,234 --> 00:00:03,456', original: '你好！', translated: 'Hello!' },
    ]);
    const translated_subtitles = ref([
      // Example data structure
      // { timestamp: '00:00:01,234 --> 00:00:03,456', original: '你好！', translated: 'Hello!' },
      // { timestamp: '00:00:04,000 --> 00:00:06,789', original: '今天天气真好。', translated: 'The weather is great today.' }
    ]);

    /****************************************
    INFO: 触发文件上传的函数
    ****************************************/
    const triggerFileUpload = () => {
      fileInput.value.click();
    };

    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0];
      const fileName = file.name.toLowerCase();
      if (file && (fileName.endsWith('.srt') || fileName.endsWith('.txt'))) {
        File.value = file;
        readSubtitleFile(file); // 👈 添加解析方法
      } else {
        ElMessage.warning('请拖入一个有效的文本或字幕文件！');
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.srt') || fileName.endsWith('.txt')){
        File.value = file;
        readSubtitleFile(file); // 👈 添加解析方法
      } else {
        ElMessage.warning('请选择一个有效的字幕文件（.srt 或 .txt）！');
      }
    };

    /****************************************
    INFO: 解析字幕文件的函数
    ****************************************/
    const readSubtitleFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result;
            original_subtitles.value = parseSRT(content); // 👈 解析为结构化数据
        };
        reader.readAsText(file);
    };

    const parseSRT = (text) => {
      // 去除 BOM
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      // 标准化换行符
      const normalizedText = text.replace(/\r\n|\r/g, '\n');
      // 按行分割并清理
      const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line !== '');

      const subtitles = [];
      let i = 0;

      while (i < lines.length) {
        // 判断是否是字幕编号
        if (/^\d+$/.test(lines[i])) {
          const index = lines[i];
          const timestamp = lines[i + 1];

          // 判断时间戳是否合法
          if (/-->/i.test(timestamp)) {
            let contentLines = [];
            let j = i + 2;

            // 收集内容行，直到遇到下一个编号或文件结束
            while (j < lines.length && !/^\d+$/.test(lines[j])) {
              contentLines.push(lines[j]);
              j++;
            }

            const original = contentLines[0] || '';
            const translated = contentLines[1] || '';

            subtitles.push({
              index,
              timestamp,
              original,
              translated,
              allContent: contentLines // 可选：保留所有内容行
            });

            i = j; // 跳到下一块字幕
          } else {
            i++; // 时间戳不合法，跳过
          }
        } else {
          i++; // 非编号行，跳过
        }
      }

      return subtitles;
    };

    /****************************************
    INFO: 处理文件的函数
    ****************************************/
    const startProcessing = () => {
      if (!File.value) {
        ElMessage.warning('请先选择一个文件！');
        return;
      }
      isProcessing.value = true;
      console.log('开始处理文件:', File.value.name);
      
      // --- API Integration Placeholder ---
      // 1. Upload file to server
      // 2. Poll for processing status
      // 3. On success, fetch subtitle data
      // ------------------------------------

      // Simulate API call and receiving data
      setTimeout(() => {
        translated_subtitles.value = [
          { timestamp: '00:00:01,234 --> 00:00:03,456', original: '你好！', translated: 'Hello!' },
          { timestamp: '00:00:04,000 --> 00:00:06,789', original: '今天天气真好。', translated: 'The weather is great today.' },
          { timestamp: '00:00:07,100 --> 00:00:09,500', original: '我们去公园吧。', translated: "Let's go to the park." },
          { timestamp: '00:00:10,000 --> 00:00:12,000', original: '再见！', translated: 'Goodbye!' },
          { timestamp: '00:00:13,000 --> 00:00:15,000', original: '谢谢！', translated: 'Thanks!' },
        ];
        isProcessing.value = false;
        isTranslated.value = true;
        ElMessage.success('处理完成');
      }, 3000); // Simulate a 3-second processing time
    };

    const convertToSRT = (subtitlesArray) => {
    return subtitlesArray.map((item, index) => {
        return `${index + 1}
${item.timestamp}
${item.original}
${item.translated}
` // 此处前面不应该有空行
    }).join('')
    }

    const downloadSRT = () => {
    const srtContent = convertToSRT(translated_subtitles.value)
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'subtitles.srt'
    a.click()

    URL.revokeObjectURL(url)
    }

    return {
      fileInput,
      File,
      isProcessing,
      original_subtitles,
      translated_subtitles,
      isTranslated,
      triggerFileUpload,
      handleFileChange,
      readSubtitleFile,
      handleDrop,
      startProcessing,
      convertToSRT,
      downloadSRT,
    };
    // 这表示：你希望这些变量和方法可以在 <template> 中被访问和使用。
    // 实际上你使用script setup 时，所有在 setup 函数中定义的变量和方法都会自动暴露到模板中。
  }
}
</script>

<style>
/* Title */
.tight-title {
  margin: 10px 0;
  line-height: 1;
}

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
  flex-wrap: stretch;
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
  flex-direction: column;
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
  height: stretch;
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