import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'  // Ant Design ��ʽ
import router from './router'
import App from './App.vue'
import Antd from 'ant-design-vue'

const app = createApp(App)
app.use(Antd)  // ע�� Ant Design ���
app.use(createPinia())
app.use(router)

app.mount('#app')
