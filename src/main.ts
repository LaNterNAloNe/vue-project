import { createApp } from 'vue'
import App from './main.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/theme.css'

import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')
