<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <div class="bg-green-700 px-4 py-3 sticky top-0 z-50">
      <!-- Status Bar -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-white text-sm font-semibold">9:41</span>
        <div class="flex items-center gap-1">
          <div class="text-white text-xs">📶</div>
          <div class="text-white text-xs">📡</div>
          <div class="text-white text-xs">🔋</div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between">
        <button class="flex items-center justify-center w-7 h-7 text-white hover:opacity-80">
          <ChevronLeft :size="24" />
        </button>
        <h1 class="text-white text-xl font-semibold">绿城中国</h1>
        <div class="flex items-center gap-3">
          <button class="flex items-center justify-center w-7 h-7 text-white hover:opacity-80">
            <Calendar :size="20" />
          </button>
          <button class="flex items-center justify-center w-7 h-7 text-white hover:opacity-80">
            <MoreHorizontal :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="sticky top-[88px] z-40 -mx-4 mb-2 bg-gray-50 px-4 pb-2">
        <HeaderFilter />
      </div>

      <div class="mt-2">
        <OverviewCards />
      </div>
      
      <div class="mt-2.5">
        <TrendChart />
      </div>
      
      <div class="mt-2.5">
        <ProjectTable @navigate="handleNavigate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Calendar, MoreHorizontal } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import HeaderFilter from '@/components/HeaderFilter.vue'
import OverviewCards from '@/components/OverviewCards.vue'
import TrendChart from '@/components/TrendChart.vue'
import ProjectTable from '@/components/ProjectTable.vue'

const router = useRouter()

function handleNavigate(projectId: string, projectName: string) {
  router.push({
    name: 'project-detail',
    params: { id: projectId },
    query: { name: projectName }
  })
}
</script>
