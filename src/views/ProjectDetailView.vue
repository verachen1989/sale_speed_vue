<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <div class="bg-green-700 px-4 py-2.5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-white text-sm font-semibold">9:41</span>
        <div class="flex items-center gap-1.5">
          <div class="text-white text-xs">📶 📡 🔋</div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button @click="router.back()" class="flex items-center justify-center w-8 h-8 text-white hover:opacity-80">
          <ChevronLeft :size="24" />
        </button>
        <h1 class="text-white text-lg font-semibold">{{ projectName }}</h1>
        <div class="flex items-center gap-3">
          <button class="flex items-center justify-center w-8 h-8 text-white hover:opacity-80">
            <Calendar :size="18" />
          </button>
          <button class="flex items-center justify-center w-8 h-8 text-white hover:opacity-80">
            <MoreHorizontal :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 pt-4 pb-20">
      <div class="sticky top-0 z-30 -mx-4 mb-2 bg-gray-50 px-4 pt-0 pb-1">
        <!-- Filter Row -->
        <div class="flex items-center gap-2 overflow-x-auto px-1 py-2">
          <el-select v-model="period" size="small" class="w-24">
            <el-option label="当日" value="当日" />
            <el-option label="当月" value="当月" />
            <el-option label="当年" value="当年" />
          </el-select>

          <el-select v-model="phase" size="small" class="w-24">
            <el-option label="全盘" value="全盘" />
            <el-option label="一期" value="一期" />
            <el-option label="二期" value="二期" />
          </el-select>

          <el-select v-model="propertyType" size="small" class="w-32">
            <el-option label="住宅-全部" value="住宅" />
            <el-option label="商办-全部" value="商办" />
            <el-option label="车储-全部" value="车储" />
          </el-select>

          <el-select v-model="indicatorType" size="small" class="w-24">
            <el-option label="协议" value="协议" />
            <el-option label="合同" value="合同" />
          </el-select>
        </div>

        <!-- Layout Cards -->
        <div class="rounded-tl-lg rounded-tr-3xl bg-green-50 px-4 py-2.5">
          <div class="flex gap-2 overflow-x-auto pb-2">
            <div
              v-for="layout in layoutOptions"
              :key="layout.label"
              :class="[
                'bg-white min-h-[76px] w-28 rounded-lg cursor-pointer transition-all shrink-0 relative text-left px-2 py-2 flex flex-col justify-end',
                selectedLayout === layout.label ? 'border border-green-700' : 'border-2 border-transparent'
              ]"
              @click="selectedLayout = layout.label"
            >
              <div class="absolute left-0 top-0 bg-green-100 h-6 rounded-tl-lg rounded-br-lg px-1.5 flex items-center max-w-[94%]">
                <p class="text-gray-700 text-xs font-medium truncate">{{ layout.label }}</p>
              </div>
              <div class="mt-6">
                <div class="flex items-baseline gap-1 text-gray-900">
                  <span class="text-base font-semibold">{{ layout.count.toLocaleString() }}</span>
                  <span class="text-xs">套</span>
                </div>
                <p class="mt-0.5 text-gray-500 text-xs truncate">
                  {{ layout.amount.toLocaleString() }}万
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <ProjectTrendChart
        :period="period"
        v-model:metric-type="metricType"
        v-model:selected-version="selectedVersion"
        :selected-layout="selectedLayout"
        :chart-data="chartData"
        :chart-title="chartTitle"
      />

      <!-- Detail Table -->
      <div class="bg-white rounded-xl p-3">
        <h3 class="text-gray-900 text-base font-semibold mb-3">{{ detailTitle }}</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 px-2 text-gray-600 font-medium sticky left-0 bg-white">指标</th>
                <th v-for="month in sortedMonths" :key="month" class="text-right py-2 px-2 text-gray-600 font-medium whitespace-pre-line">
                  {{ month.replace('-', '\n') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in sortedDetailData" :key="index" class="border-b border-gray-100">
                <td class="py-2 px-2 text-gray-900 font-medium sticky left-0 bg-white">{{ row.indicator }}</td>
                <td v-for="(value, idx) in row.values" :key="idx" class="text-right py-2 px-2 text-gray-700">
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Calendar, MoreHorizontal } from 'lucide-vue-next'
import ProjectTrendChart from '@/components/ProjectTrendChart.vue'
import { getProjectDetail } from '@/mock/dashboardData'
import type { Period, IndicatorType, PropertyType, VersionType, ChartData } from '@/types'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const projectName = (route.query.name as string) || '项目详情'

const period = ref<Period>('当年')
const phase = ref('全盘')
const propertyType = ref<PropertyType>('住宅')
const indicatorType = ref<IndicatorType>('合同')
const metricType = ref<'套数' | '金额'>('套数')
const selectedLayout = ref('全部已售')
const selectedVersion = ref<VersionType>('年度经营计划版')

const project = computed(() => getProjectDetail(projectId, period.value, propertyType.value))

const layoutOptions = computed(() => {
  const baseUnits = project.value?.contractUnits || 1000
  const baseAmount = project.value?.contractAmount || 200000
  
  return [
    {
      label: '全部已售',
      count: baseUnits,
      amount: baseAmount,
    },
    {
      label: '中高层128A-3',
      count: Math.round(baseUnits * 0.052),
      amount: Math.round(baseAmount * 0.052),
    },
    {
      label: '中高层106b-4',
      count: Math.round(baseUnits * 0.049),
      amount: Math.round(baseAmount * 0.049),
    },
    {
      label: '中高层109B-5',
      count: Math.round(baseUnits * 0.061),
      amount: Math.round(baseAmount * 0.061),
    },
    {
      label: '中高层139A-10',
      count: Math.round(baseUnits * 0.073),
      amount: Math.round(baseAmount * 0.073),
    },
  ]
})

// 生成月份标签（从2026年3月往前推6个月）
const rollingMonthLabels = computed(() => {
  return Array.from({ length: 6 }, (_, index) => {
    const startYear = 2026
    const startMonth = 3
    const offset = 5 - index
    let month = startMonth - offset
    let year = startYear
    
    while (month <= 0) {
      month += 12
      year -= 1
    }
    
    return `${month}月`
  })
})

// 生成趋势数据
const baseTrendData = computed(() => {
  if (period.value === '当年') {
    return [
      { month: rollingMonthLabels.value[0], target: 60, actual: 62, visits: 280 },
      { month: rollingMonthLabels.value[1], target: 68, actual: 65, visits: 310 },
      { month: rollingMonthLabels.value[2], target: 72, actual: 78, visits: 350 },
      { month: rollingMonthLabels.value[3], target: 75, actual: 82, visits: 380 },
      { month: rollingMonthLabels.value[4], target: 78, actual: 72, visits: 340 },
      { month: rollingMonthLabels.value[5], target: 80, actual: 75, visits: 360 },
    ]
  } else if (period.value === '当月') {
    return [
      { month: '2/03-2/09', target: 140, actual: 135, visits: 45 },
      { month: '2/10-2/16', target: 150, actual: 155, visits: 52 },
      { month: '2/17-2/23', target: 160, actual: 165, visits: 55 },
      { month: '2/24-3/02', target: 170, actual: 175, visits: 58 },
      { month: '3/03-3/09', target: 165, actual: 160, visits: 53 },
      { month: '3/10-3/16', target: 175, actual: 180, visits: 60 },
    ]
  } else {
    return [
      { month: '3/10', target: 25, actual: 27, visits: 12 },
      { month: '3/11', target: 23, actual: 24, visits: 10 },
      { month: '3/12', target: 28, actual: 30, visits: 13 },
      { month: '3/13', target: 30, actual: 32, visits: 14 },
      { month: '3/14', target: 29, actual: 28, visits: 12 },
      { month: '3/15', target: 32, actual: 35, visits: 15 },
      { month: '3/16', target: 31, actual: 30, visits: 13 },
    ]
  }
})

// 根据会议版本调整目标值
const versionMultipliers: Record<VersionType, number> = {
  '年度经营计划版': 1.1,
  '首开定价会版': 1.05,
  '全景会版': 1.0,
  '经营策划会版': 0.95,
  '交底会版': 0.9,
}

const chartData = computed<ChartData[]>(() => {
  const multiplier = versionMultipliers[selectedVersion.value]
  const isAllLayout = selectedLayout.value === '全部已售'
  const layoutRatio = isAllLayout ? 1 : 0.15
  
  return baseTrendData.value.map((item, index) => {
    const adjustedTarget = Math.round(item.target * multiplier * layoutRatio)
    const adjustedActual = Math.round(item.actual * layoutRatio)
    const monthLabel = item.month || ''
    
    if (metricType.value === '金额') {
      const avgPrice = 315 + (index % 4) * 6
      return {
        month: monthLabel,
        date: monthLabel,
        target: Math.round(adjustedTarget * avgPrice),
        actual: Math.round(adjustedActual * avgPrice),
        visits: item.visits || 0,
      }
    }
    
    return {
      month: monthLabel,
      date: monthLabel,
      target: adjustedTarget,
      actual: adjustedActual,
      visits: item.visits || 0,
    }
  })
})

const chartTitle = computed(() => {
  const periodTitle = {
    当日: '近7日流速趋势',
    当月: '近6周流速趋势',
    当年: '近6个月流速趋势',
  }
  const suffix = selectedLayout.value !== '全部已售' ? `-${selectedLayout.value}` : ''
  return periodTitle[period.value] + suffix
})

const detailTitle = computed(() => {
  const periodTitle = {
    当日: '近7日流速趋势',
    当月: '近6周流速趋势',
    当年: '近6个月流速趋势',
  }
  const suffix = selectedLayout.value !== '全部已售' ? `-${selectedLayout.value}` : ''
  return periodTitle[period.value] + '-明细' + suffix
})

// 明细表格数据
const estimatedPrices = computed(() => chartData.value.map((_, index) => 315 + (index % 4) * 6))

const detailData = computed(() => {
  const data = chartData.value
  const prices = estimatedPrices.value
  
  if (period.value === '当年') {
    return [
      {
        indicator: metricType.value === '金额' ? '目标金额' : '目标',
        values: data.map(d => d.target.toLocaleString()),
      },
      {
        indicator: metricType.value === '金额' ? `${indicatorType.value}金额` : `${indicatorType.value}实际`,
        values: data.map(d => d.actual.toLocaleString()),
      },
      {
        indicator: '达成率',
        values: data.map(d => `${Math.round((d.actual / Math.max(d.target, 1)) * 100)}%`),
      },
      {
        indicator: metricType.value === '金额' ? '合同套数' : `${indicatorType.value}金额`,
        values: data.map((d, i) => Math.round(d.actual * (prices[i] || 315)).toLocaleString()),
      },
      {
        indicator: '回款合计',
        values: data.map((d, i) => Math.round(d.actual * (prices[i] || 315) * 0.92).toLocaleString()),
      },
    ]
  } else {
    return [
      {
        indicator: metricType.value === '金额' ? `${indicatorType.value}金额` : `${indicatorType.value}实际`,
        values: data.map(d => d.actual.toLocaleString()),
      },
      {
        indicator: metricType.value === '金额' ? '合同套数' : `${indicatorType.value}金额`,
        values: data.map((d, i) => Math.round(d.actual * (prices[i] || 315)).toLocaleString()),
      },
      {
        indicator: '回款合计',
        values: data.map((d, i) => Math.round(d.actual * (prices[i] || 315) * 0.92).toLocaleString()),
      },
    ]
  }
})

const sortedMonths = computed(() => chartData.value.map(d => d.month).reverse())

const sortedDetailData = computed(() => {
  return detailData.value.map(row => ({
    ...row,
    values: [...row.values].reverse(),
  }))
})
</script>
