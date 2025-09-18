<template>
  <a-layout class="h-[100vh]">
    <!-- 固定头部的头部导航 -->
    <a-layout-header class="fixed top-0 left-0 right-0 z-[9999]" @click="headerClick">
      <div class="logo w-30 h-8 bg-[rgb(236,236,236)] float-left m-4">
        <img src="/src/assets/logo.png" alt="logo" class="w-full h-full" />
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        class="line-h-[64px]"
      >
        <a-menu-item key="1">
          <router-link to="/deviceDefine">设备定义</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/mvc">MVC01-24</router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/xios">XIOS UC1</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <!-- 主要内容区域 -->
    <a-layout-content class="pt-[64px] bg-white">
      <div class="relative z-1">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'

// const selectedKeys = ref(['1'])
const headerClick = () => {
  //点击头部时，返回顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 根据当前路由设置初始选中项
const getInitialSelectedKey = () => {
  const currentPath = router.currentRoute.value.path
  if (currentPath === '/deviceDefine') return ['1']
  if (currentPath === '/mvc') return ['2']
  if (currentPath === '/xios') return ['3']
  return ['1'] // 默认选中第一个
}

const selectedKeys = ref(getInitialSelectedKey())

// 监听路由变化，更新选中项
onMounted(() => {
  router.afterEach((to) => {
    if (to.path === '/deviceDefine') {
      selectedKeys.value = ['1']
    } else if (to.path === '/mvc') {
      selectedKeys.value = ['2']
    } else if (to.path === '/xios') {
      selectedKeys.value = ['3']
    }
  })
})
</script>

<style scoped></style>
