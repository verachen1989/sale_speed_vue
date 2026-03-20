<template>
  <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
    <!-- 周期选择 -->
    <div class="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
      <button
        v-for="option in periodOptions"
        :key="option"
        @click="store.setPeriod(option)"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors whitespace-nowrap',
          store.period === option
            ? 'bg-white text-gray-900 shadow-sm font-medium'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ option }}
      </button>
    </div>

    <!-- 物业类型选择 -->
    <div class="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
      <button
        v-for="option in propertyOptions"
        :key="option"
        @click="store.setPropertyType(option)"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors whitespace-nowrap',
          store.propertyType === option
            ? 'bg-white text-gray-900 shadow-sm font-medium'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ option }}
      </button>
    </div>

    <!-- 指标类型选择 -->
    <div class="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
      <button
        v-for="option in indicatorOptions"
        :key="option"
        @click="store.setIndicatorType(option)"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors whitespace-nowrap',
          store.indicatorType === option
            ? 'bg-white text-gray-900 shadow-sm font-medium'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import type { Period, PropertyType, IndicatorType } from '@/types'

const store = useDashboardStore()

const periodOptions: Period[] = ['当日', '当月', '当年']
const propertyOptions: PropertyType[] = ['住宅', '商办', '车储']
const indicatorOptions: IndicatorType[] = ['协议', '合同']
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
