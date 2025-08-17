import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(false)

    // 切换主题
    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    // 监听变化并修改 DOM
    watch(isDark, (newVal) => {
        document.documentElement.classList.toggle('dark-theme', newVal)
        document.documentElement.classList.toggle('light-theme', !newVal)
    }, { immediate: true })

    return { isDark, toggleTheme }
})
