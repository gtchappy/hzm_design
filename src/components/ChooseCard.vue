<template>
  <div style="background-color: #ececec; padding: 0 20px 20px 20px">
    <a-row :gutter="10">
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug A pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, Pindex) in PLUGA"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.canChoose.includes(a),
              // 'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            :style="
              Pindex > 55
                ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }
                : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }
            "
            class="flex items-center"
          >
            <a-popover :title="getMappedTitle(a.split(':')[1])" trigger="hover">
              <a-avatar
                style="
                  background-color: rgb(255, 182, 103);
                  color: rgb(0, 0, 0);
                  margin-left: 10px;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                {{ 'A' + (Pindex + 1) }}
              </a-avatar>
            </a-popover>
            <a-dropdown :trigger="['click']">
              <div style="text-align: center" class="flex-1 flex flex-col justify-between">
                <div
                  class="flex items-center justify-center mr-5"
                  :class="{
                    'func-card':
                      counterStore.pinFunction[counterStore.selectedPinFunc]?.includes(a),
                  }"
                >
                  {{ a.split(':')[1] }}
                </div>
                <!-- 选择的引脚 -->
                <div class="flex items-center justify-center mr-5" style="font-size: 11px">
                  {{ counterStore.pinChoose['A' + (Pindex + 1)] }}
                </div>
                <!-- 定义 -->
                <div class="flex items-center justify-center mr-5" style="font-size: 11px">
                  {{ counterStore.pinChooseDefine['A' + (Pindex + 1)] }}
                </div>
                <!-- 备注 -->
                <div class="flex items-center justify-center mr-5" style="font-size: 11px">
                  {{ counterStore.remark['A' + (Pindex + 1)] }}
                </div>
              </div>

              <template #overlay>
                <a-menu>
                  <a-menu-item
                    :key="index"
                    v-for="index in counterStore.devicePinDefine[counterStore.currentDevice]"
                    @click="handleMenuClick(index, 'A' + (Pindex + 1), a)"
                    >{{ index }}</a-menu-item
                  >
                  <a-input-group compact>
                    <a-input
                      style="width: 150px"
                      v-model:value="inputDeviceValue"
                      @keyup.enter="
                        handleDeviceConfirmClick(inputDeviceValue, 'A' + (Pindex + 1), a)
                      "
                    />
                    <a-button
                      type="primary"
                      style=" text-align: center"
                      @click="handleDeviceConfirmClick(inputDeviceValue, 'A' + (Pindex + 1), a)"
                      >OK</a-button
                    >
                  </a-input-group>
                </a-menu>
              </template>
            </a-dropdown>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug B pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGB"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
            :style="
              index > 55
                ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }
                : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }
            "
            class="flex items-center"
          >
            <a-popover :title="getMappedTitle(a.split(':')[1])" trigger="hover">
              <a-avatar
                style="
                  background-color: rgb(185, 241, 78);
                  color: rgb(0, 0, 0);
                  margin-left: 10px;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                {{ 'B' + (index + 1) }}
              </a-avatar>
            </a-popover>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug C pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGC"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
            :style="
              index > 55
                ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }
                : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }
            "
            class="flex items-center"
          >
            <a-popover :title="getMappedTitle(a.split(':')[1])" trigger="hover">
              <a-avatar
                style="
                  background-color: rgb(253, 228, 132);
                  color: rgb(0, 0, 0);
                  margin-left: 10px;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                {{ 'C' + (index + 1) }}
              </a-avatar>
            </a-popover>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug D pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGD"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
            :style="
              index > 55
                ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }
                : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }
            "
            class="flex items-center"
          >
            <a-popover :title="getMappedTitle(a.split(':')[1])" trigger="hover">
              <a-avatar
                style="
                  background-color: rgb(184, 230, 254);
                  color: rgb(0, 0, 0);
                  margin-left: 10px;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                {{ 'D' + (index + 1) }}
              </a-avatar>
            </a-popover>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug E pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGE"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
            :style="{ width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-popover :title="getMappedTitle(a.split(':')[1])" trigger="hover">
              <a-avatar
                style="
                  background-color: rgb(255, 214, 167);
                  color: rgb(0, 0, 0);
                  margin-left: 10px;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                {{ 'E' + (index + 1) }}
              </a-avatar>
            </a-popover>
            <div style="text-align: center" class="flex-1 flex flex-col justify-between">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <div>
    {{ counterStore.currentDevice }}
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'
const counterStore = useCounterStore()
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  PLUGA: {
    type: Array,
    default: () => [],
  },
  PLUGB: {
    type: Array,
    default: () => [],
  },
  PLUGC: {
    type: Array,
    default: () => [],
  },
  PLUGD: {
    type: Array,
    default: () => [],
  },
  PLUGE: {
    type: Array,
    default: () => [],
  },
  PlugName: {
    type: String,
    default: '',
  },
  currentDevice: {
    type: String,
    default: '',
  },
})
const getMappedTitle = (pin) => {
  switch (pin) {
    case 'PGND':
      return '这是PGND'
    case 'FREQ-PS':
      return '12V+'
    case 'FREQ1-IN':
    case 'FREQ2-IN':
      return '若作为开关量输出只可输出12V+'
    case 'D':
      return 'Engine Plug D pin assignment'
    case 'E':
      return 'Engine Plug E pin assignment'
    default:
      return ''
  }
}

const handleMenuClick = (index, Pindex, a) => {
  console.log('handleMenuClick', counterStore.currentDevice, index, Pindex, a)
  counterStore.pinChoose[Pindex] = counterStore.currentDevice + index
  counterStore.pinChooseDefine[Pindex] = counterStore.deviceDefine[counterStore.currentDevice]
  counterStore.confirmedTags.push(a)
  console.log('confirmTags', counterStore.confirmedTags)
  //将pinChoose改成编码
  //记录选中设备的最终定义,在counterStore.selectedIdDefine这个对象中，添加counterStore.selectedId:Pindex
  if (!counterStore.selectedIdDefine[counterStore.selectedId]) {
    counterStore.selectedIdDefine[counterStore.selectedId] = []
  }
  counterStore.selectedIdDefine[counterStore.selectedId].push(Pindex)
  console.log('handleMenuClick', counterStore.selectedIdDefine)
}
const handleDeviceConfirmClick = (value, pin, a) => {
  if (value) {
    counterStore.remark[pin] = value
  } else if (confirm('Are you sure?')) {
    counterStore.confirmedTags = counterStore.confirmedTags.filter((item) => item !== a)
    counterStore.pinChoose[pin] = ''
    counterStore.pinChooseDefine[pin] = ''
    counterStore.remark[pin] = ''
  }
  inputDeviceValue.value = ''
}
const inputDeviceValue = ref('')
</script>

<style scoped>
/* 可选择的卡片样式 */
.default-card {
  text-align: center;
  background-color: rgb(255, 255, 255);
}
/* 已选择的卡片样式 */
.active-card {
  text-align: center;
  background-color: rgb(48, 201, 104);
}
/* 推荐的的卡片样式 */
.used-card {
  text-align: center;
  background-color: rgb(33, 150, 243);
}
.func-card {
  background-color: rgb(167, 183, 255);
}
</style>
