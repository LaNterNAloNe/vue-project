<template>
  <div class="page-container">
    <el-card class="upload-card" shadow="hover">
      <div class="header">
        <el-icon><VideoCamera /></el-icon>
        <span class="title">视频上传</span>
      </div>

      <el-upload
        class="upload-area"
        drag
        action="/api/upload"
        accept="video/*"
        :before-upload="beforeUpload"
        :headers="uploadHeaders"
        :data="uploadData"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
      >
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="upload-text">点击或拖拽视频文件到此处上传</div>
      </el-upload>
    </el-card>

    <el-card v-if="subtitles.length" class="table-card" shadow="hover">
      <div class="table-title">字幕翻译结果</div>
      <el-table :data="subtitles" stripe border style="width: 100%">
        <el-table-column prop="start" label="开始时间" width="120" />
        <el-table-column prop="end" label="结束时间" width="120" />
        <el-table-column prop="original" label="原文字幕" />
        <el-table-column prop="translated" label="翻译字幕" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, VideoCamera } from '@element-plus/icons-vue'

// 字幕数据
const subtitles = ref([])

// 上传成功回调
const handleUploadSuccess = (response) => {
  if (response && response.subtitles) {
    subtitles.value = response.subtitles
    ElMessage.success('字幕解析成功')
  } else {
    ElMessage.error('字幕解析失败')
  }
}

// 上传前校验
const beforeUpload = (file) => {
  const isVideo = file.type.startsWith('video/')
//   const isSizeOk = file.size / 1024 / 1024 < 100 // 限制100MB

  if (!isVideo) {
    ElMessage.error('文件类型错误：只能上传视频文件')
    return false
  }

//   if (!isSizeOk) {
//     ElMessage.warning('文件过大：请上传小于100MB的视频')
//     return false
//   }

  return true // 校验通过，继续上传
}


// 请求头（可选）
const uploadHeaders = {
  // Authorization: 'Bearer your-token'
}

// 附加参数（可选）
const uploadData = {
  // userId: 123
}
</script>


<style scoped>
.page-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.upload-card {
  padding: 20px;
  margin-bottom: 50px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header .title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}

.upload-area {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed #409EFF;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.upload-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 16px;
  color: #666;
}

.table-card {
  padding: 20px;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.page-container {
  margin: 40px auto;
  padding: 0 20px;
  max-width: 800px;
  min-width: 360px;
  box-sizing: border-box;
}

/* 卡片样式保持一致 */
.upload-card,
.table-card {
  padding: 20px;
  margin-bottom: 30px;
}

/* 响应式调整：在小屏幕下居中并稍微缩小字体 */
@media screen and (max-width: 480px) {
  .header .title {
    font-size: 18px;
  }

  .upload-text {
    font-size: 14px;
  }

  .upload-icon {
    font-size: 32px;
  }
}

</style>
