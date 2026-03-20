<template>
  <div class="bg-white rounded-bl-[10px] rounded-br-[10px] p-4">
    <div class="mb-3 flex items-center justify-between gap-3">
      <h3 class="text-[#1a1a1a] text-[14px] font-medium">
        {{ titleText }}{{ filterLabel ? `-${filterLabel}` : '' }}
      </h3>
      <div v-if="period === '当年'" class="flex items-center gap-2 text-xs shrink-0">
        <span class="text-[#8c8c8c] text-[12px]">对比</span>
        <div class="relative inline-flex items-center">
          <select
            v-model="selectedVersion"
            class="h-auto w-auto border-0 bg-transparent text-[12px] text-[#007440] pl-0 pr-3 focus:outline-none appearance-none"
          >
            <option value="年度经营计划版">年度经营计划版</option>
            <option value="首开定价会版">首开定价会版</option>
            <option value="全景会版">全景会版</option>
            <option value="经营策划会版">经营策划会版</option>
            <option value="交底会版">交底会版</option>
          </select>
          <ChevronDown
            class="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[#007440]"
          />
        </div>
      </div>
    </div>

    <div class="mb-3 flex items-center gap-3">
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
    </div>

    <v-chart :option="chartOption" :style="{ height: '200px' }" autoresize />

    <div class="mt-2 flex items-center justify-center gap-4 text-xs">
      <template v-if="period === '当年'">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-orange-500"></div>
          <span class="text-[#8c8c8c] text-[12px]">目标</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-700"></div>
          <span class="text-[#8c8c8c] text-[12px]">实际</span>
        </div>
      </template>
      <template v-else>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-700"></div>
          <span class="text-[#8c8c8c] text-[12px]">实际</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ChevronDown } from 'lucide-vue-next'
import { getTrendData } from '@/mock/dashboardData'
import type { IndicatorType, Period, PropertyType, VersionType } from '@/types'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  period: Period
  indicatorType: IndicatorType
  propertyType: PropertyType
  filterLabel?: string
}>()

const filterLabel = computed(() => props.filterLabel ?? '')
const metricType = ref<'套数' | '金额'>('套数')
const selectedVersion = ref<VersionType>('年度经营计划版')
const titleText = computed(() => {
  const title = {
    当日: '近7日流速趋势',
    当月: '近6周流速趋势',
    当年: '近6个月流速趋势',
  } as const
  return title[props.period]
})

const trendData = computed(() => {
  const data = getTrendData(props.period, props.indicatorType, metricType.value, filterLabel.value, props.propertyType)
  
  // 根据会议版本调整目标值
  const versionMultipliers: Record<VersionType, number> = {
    '年度经营计划版': 1.1,
    '首开定价会版': 1.05,
    '全景会版': 1.0,
    '经营策划会版': 0.95,
    '交底会版': 0.9,
  }
  
  const multiplier = versionMultipliers[selectedVersion.value]
  
  return data.map((item) => ({
    ...item,
    target: Math.round(item.target * multiplier),
    targetValue: item.target,
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
      const target = params.find((p: any) => p.seriesName === '目标')
      const actual = params.find((p: any) => p.seriesName === '实际')
      const rawUnit = metricType.value === '金额' ? '万' : '套'
      if (!actual) return ''
      if (props.period !== '当年') {
        return `
          <div style="padding: 4px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${actual.name}</div>
            <div style="color: #007440;">实际: ${actual.value.toLocaleString()}${rawUnit}</div>
          </div>
        `
      }
      if (!target) return ''
      const rate = Math.round((actual.value / target.value) * 100)
      const diff = actual.value - target.value
      const diffColor = diff >= 0 ? '#00c950' : '#ff3b30'
      return `
        <div style="padding: 4px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${target.name}</div>
          <div style="color: #f59e0b;">目标: ${target.value.toLocaleString()}${rawUnit}</div>
          <div style="color: #007440;">实际: ${actual.value.toLocaleString()}${rawUnit}</div>
          <div style="color: ${diffColor};">偏差: ${diff >= 0 ? '+' : ''}${diff.toLocaleString()}${rawUnit}</div>
          <div style="color: ${rate >= 100 ? '#00c950' : '#ff3b30'};">达成率: ${rate}%</div>
        </div>
      `
    },
  },
  series: [
    ...(props.period === '当年'
      ? [{
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
    }]
      : []),
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
