<template>
  <a-layout class="h-[100vh]">
    <!-- 固定头部的头部导航 -->
    <a-layout-header class="fixed top-0 left-0 right-0 z-10">
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
import { ref } from 'vue'
const selectedKeys = ref(['1'])
</script>

<style scoped></style>
