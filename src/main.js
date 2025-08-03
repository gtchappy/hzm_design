import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'  // Ant Design 样式
import router from './router'
import App from './App.vue'
import Antd from 'ant-design-vue'

const app = createApp(App)
app.use(Antd)  // 注册 Ant Design 组件
app.use(createPinia())
app.use(router)

app.mount('#app')
