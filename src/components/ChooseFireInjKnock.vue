<template>
  <a-select
    v-model:value="selectedItems"
    mode="multiple"
    placeholder="Inserted are removed"
    style="width: 100%"
    :options="filteredOptions.map(item => ({ value: item }))"
  ></a-select>
</template>
<script setup>
import { computed, ref } from 'vue';
const OPTIONS = ['电喷', '点火', '爆震'];
const selectedItems = ref([]);
const filteredOptions = computed(() => OPTIONS.filter(o => !selectedItems.value.includes(o)));
</script>
