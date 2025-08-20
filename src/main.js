import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 别忘了样式！

const app = createApp(App)
app.use(ElementPlus) // 👈 这一步很关键！
app.mount('#app')
