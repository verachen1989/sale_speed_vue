<template>
  <div class="bg-white rounded-xl p-3 mb-3">
    <h3 class="text-gray-900 text-base font-semibold mb-2">{{ chartTitle }}</h3>

    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('update:metricType', '套数')"
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
          @click="$emit('update:metricType', '金额')"
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

      <div v-if="period === '当年'" class="flex items-center gap-2 text-xs shrink-0">
        <span class="text-gray-500">对比</span>
        <el-select :model-value="selectedVersion" @change="$emit('update:selectedVersion', $event)" size="small" class="w-40">
          <el-option label="年度经营计划版" value="年度经营计划版" />
          <el-option label="首开定价会版" value="首开定价会版" />
          <el-option label="全景会版" value="全景会版" />
          <el-option label="经营策划会版" value="经营策划会版" />
          <el-option label="交底会版" value="交底会版" />
        </el-select>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-4 text-xs">
        <div v-if="period === '当年'" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-orange-500"></div>
          <span class="text-gray-500">目标</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-700"></div>
          <span class="text-gray-500">实际</span>
        </div>
        <div v-if="isAllLayoutSelected && metricType === '套数'" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
          <span class="text-gray-500">来访组数</span>
        </div>
      </div>
      <span class="text-gray-500 text-xs">单位：{{ unitLabel }}</span>
    </div>

    <v-chart :option="chartOption" :style="{ height: '180px' }" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { Period, VersionType, ChartData } from '@/types'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

interface Props {
  period: Period
  metricType: '套数' | '金额'
  selectedVersion: VersionType
  selectedLayout: string
  chartData: ChartData[]
  chartTitle: string
}

const props = defineProps<Props>()

defineEmits<{
  'update:metricType': [value: '套数' | '金额']
  'update:selectedVersion': [value: VersionType]
}>()

const isAllLayoutSelected = computed(() => props.selectedLayout === '全部已售')

const unitLabel = computed(() => {
  if (isAllLayoutSelected.value && props.metricType === '套数') {
    return '套/组'
  }
  return props.metricType === '套数' ? '套' : '万'
})

const chartOption = computed(() => {
  const series: any[] = []
  
  // 目标柱（只在当年显示）
  if (props.period === '当年') {
    series.push({
      name: '目标',
      type: 'bar',
      data: props.chartData.map(d => d.target),
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
      barWidth: 14,
      barGap: '10%',
    })
  }
  
  // 来访组数柱（只在全部已售且套数时显示，且在实际柱之前）
  if (isAllLayoutSelected.value && props.metricType === '套数') {
    series.push({
      name: '来访组数',
      type: 'bar',
      data: props.chartData.map(d => d.visits || 0),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.8)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.3)' },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: 14,
      barGap: '10%',
    })
  }
  
  // 实际柱
  series.push({
    name: '实际',
    type: 'bar',
    data: props.chartData.map(d => d.actual),
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
    barWidth: 14,
    barGap: '10%',
  })

  return {
    grid: {
      left: 45,
      right: 10,
      top: 20,
      bottom: 20,
    },
    xAxis: {
      type: 'category',
      data: props.chartData.map(d => d.month),
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
        let html = `<div style="padding: 4px;"><div style="font-weight: 600; margin-bottom: 4px;">${params[0].name}</div>`
        
        params.forEach((item: any) => {
          const color = item.seriesName === '目标' ? '#f59e0b' : item.seriesName === '来访组数' ? '#3b82f6' : '#007440'
          html += `<div style="color: ${color};">${item.seriesName}: ${item.value.toLocaleString()}</div>`
        })
        
        if (props.period === '当年') {
          const target = params.find((p: any) => p.seriesName === '目标')
          const actual = params.find((p: any) => p.seriesName === '实际')
          if (target && actual) {
            const rate = Math.round((actual.value / target.value) * 100)
            html += `<div style="color: ${rate >= 100 ? '#00c950' : '#ff3b30'};">达成率: ${rate}%</div>`
          }
        }
        
        html += '</div>'
        return html
      },
    },
    series,
  }
})
</script>
