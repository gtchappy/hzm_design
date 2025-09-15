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


// document.addEventListener('contextmenu', function(e) {
//   // 阻止默认的右键菜单行为
//   e.preventDefault();
//   // 可选：可以在这里添加自定义右键菜单的逻辑
//   // alert('右键菜单已禁用');
// });
