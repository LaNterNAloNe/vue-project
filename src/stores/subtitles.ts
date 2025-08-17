import { defineStore } from 'pinia'

export const useSubtitleStore = defineStore('subtitle', {
    state: () => ({
        videoFile: null as File | null,   // 当前上传的视频文件
        subtitles: [] as string[],       // 字幕数组
        language: 'zh' as string         // 当前翻译语言（默认中文）
    }),

    actions: {
        setVideo(file: File) {
            this.videoFile = file
        },
        setSubtitles(data: string[]) {
            this.subtitles = data
        },
        clearAll() {
            this.videoFile = null
            this.subtitles = []
        },
        setLanguage(lang: string) {
            this.language = lang
        }
    }
})
