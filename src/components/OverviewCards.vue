<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="bg-white rounded-lg p-3">
      <div class="text-gray-500 text-xs mb-1">{{ store.indicatorType }}套数</div>
      <div class="text-2xl font-bold text-gray-900">{{ totalUnits.toLocaleString() }}</div>
      <div class="text-green-600 text-xs mt-1">↑ 18%</div>
    </div>

    <div class="bg-white rounded-lg p-3">
      <div class="text-gray-500 text-xs mb-1">{{ store.indicatorType }}金额</div>
      <div class="text-2xl font-bold text-gray-900">{{ totalAmount.toLocaleString() }}</div>
      <div class="text-green-600 text-xs mt-1">↑ 20%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { getProjects } from '@/mock/dashboardData'

const store = useDashboardStore()

const projects = computed(() => getProjects(store.period, store.propertyType))

const totalUnits = computed(() => {
  return projects.value.reduce((sum, p) => {
    return sum + (store.indicatorType === '协议' ? p.agreementUnits : p.contractUnits)
  }, 0)
})

const totalAmount = computed(() => {
  return projects.value.reduce((sum, p) => {
    return sum + (store.indicatorType === '协议' ? p.agreementAmount : p.contractAmount)
  }, 0)
})
</script>
