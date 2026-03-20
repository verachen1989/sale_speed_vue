<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <div class="p-3 border-b border-gray-200">
      <h3 class="text-gray-900 text-base font-semibold">项目明细</h3>
    </div>

    <el-table :data="projects" style="width: 100%" stripe>
      <el-table-column prop="name" label="项目名称" width="180">
        <template #default="{ row }">
          <button
            @click="$emit('navigate', row.id, row.name)"
            class="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ row.name }}
          </button>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="100" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column label="套数" width="120" align="right">
        <template #default="{ row }">
          {{ getUnits(row).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="金额(万)" width="120" align="right">
        <template #default="{ row }">
          {{ getAmount(row).toLocaleString() }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { getProjects } from '@/mock/dashboardData'
import type { ProjectRecord } from '@/types'

defineEmits<{
  navigate: [projectId: string, projectName: string]
}>()

const store = useDashboardStore()

const projects = computed(() => getProjects(store.period, store.propertyType))

function getUnits(project: ProjectRecord) {
  return store.indicatorType === '协议' ? project.agreementUnits : project.contractUnits
}

function getAmount(project: ProjectRecord) {
  return store.indicatorType === '协议' ? project.agreementAmount : project.contractAmount
}
</script>
