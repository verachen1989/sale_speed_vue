<template>
  <div class="flex items-center gap-2 overflow-x-auto py-2">
    <el-select v-model="store.period" @change="store.setPeriod" size="small" class="w-24">
      <el-option label="当日" value="当日" />
      <el-option label="当月" value="当月" />
      <el-option label="当年" value="当年" />
    </el-select>

    <el-select v-model="store.propertyType" @change="store.setPropertyType" size="small" class="w-24">
      <el-option label="住宅" value="住宅" />
      <el-option label="商办" value="商办" />
      <el-option label="车储" value="车储" />
    </el-select>

    <el-select v-model="store.indicatorType" @change="store.setIndicatorType" size="small" class="w-24">
      <el-option label="协议" value="协议" />
      <el-option label="合同" value="合同" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
</script>
