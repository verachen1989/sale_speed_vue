<template>
  <div class="bg-white rounded-lg p-4">
    <h3 class="text-gray-900 text-base font-semibold mb-3">流速趋势</h3>
    
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="metricType = '套数'"
          :class="[
            'px-3 py-1 text-xs rounded transition-colors',
            metricType === '套数'
              ? 'bg-green-700 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          ]"
        >
          套数
        </button>
        <button
          @click="metricType = '金额'"
          :class="[
            'px-3 py-1 text-xs rounded transition-colors',
            metricType === '金额'
              ? 'bg-green-700 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          ]"
        >
          金额
        </button>
      </div>

      <div v-if="store.period === '当年'" class="flex items-center gap-2 text-xs">
        <span class="text-gray-500">对比</span>
        <el-select v-model="selectedVersion" size="small" class="w-40">
          <el-option label="年度经营计划版" value="年度经营计划版" />
          <el-option label="首开定价会版" value="首开定价会版" />
          <el-option label="全景会版" value="全景会版" />
          <el-option label="经营策划会版" value="经营策划会版" />
          <el-option label="交底会版" value="交底会版" />
        </el-select>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-3 text-xs">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
        <span class="text-gray-500">目标</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-700"></div>
        <span class="text-gray-500">实际</span>
      </div>
    </div>

    <v-chart :option="chartOption" :style="{ height: '200px' }" autoresize />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useDashboardStore } from '@/stores/dashboard'
import { getTrendData } from '@/mock/dashboardData'
import type { VersionType } from '@/types'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const store = useDashboardStore()
const metricType = ref<'套数' | '金额'>('套数')
const selectedVersion = ref<VersionType>('年度经营计划版')

const trendData = computed(() => {
  const data = getTrendData(store.period, store.indicatorType)
  
  // 根据会议版本调整目标值
  const versionMultipliers: Record<VersionType, number> = {
    '年度经营计划版': 1.1,
    '首开定价会版': 1.05,
    '全景会版': 1.0,
    '经营策划会版': 0.95,
    '交底会版': 0.9,
  }
  
  const multiplier = versionMultipliers[selectedVersion.value]
  
  return data.map(item => ({
    ...item,
    target: Math.round(item.target * multiplier),
    actual: metricType.value === '金额' ? Math.round(item.actual * 190) : item.actual,
    targetValue: metricType.value === '金额' ? Math.round(item.target * multiplier * 190) : Math.round(item.target * multiplier),
  }))
})

const chartOption = computed(() => ({
  grid: {
    left: 50,
    right: 20,
    top: 20,
    bottom: 30,
  },
  xAxis: {
    type: 'category',
    data: trendData.value.map(d => d.date),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#8c8c8c',
      fontSize: 11,
    },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: {
        color: '#f0f0f0',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#8c8c8c',
      fontSize: 11,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: {
      color: '#1a1a1a',
    },
    formatter: (params: any) => {
      const target = params[0]
      const actual = params[1]
      const rate = Math.round((actual.value / target.value) * 100)
      return `
        <div style="padding: 4px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${target.name}</div>
          <div style="color: #f59e0b;">目标: ${target.value.toLocaleString()}</div>
          <div style="color: #007440;">实际: ${actual.value.toLocaleString()}</div>
          <div style="color: ${rate >= 100 ? '#00c950' : '#ff3b30'};">达成率: ${rate}%</div>
        </div>
      `
    },
  },
  series: [
    {
      name: '目标',
      type: 'bar',
      data: trendData.value.map(d => d.targetValue),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 158, 11, 0.8)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.3)' },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: 16,
    },
    {
      name: '实际',
      type: 'bar',
      data: trendData.value.map(d => d.actual),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 116, 64, 0.8)' },
            { offset: 1, color: 'rgba(0, 116, 64, 0.3)' },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: 16,
    },
  ],
}))
</script>
