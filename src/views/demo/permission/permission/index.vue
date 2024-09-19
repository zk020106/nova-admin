<script setup lang="ts">
import { usePermission } from '@/hooks'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { hasPermission } = usePermission()
const { role } = authStore.userInfo!
</script>

<template>
  <n-card title="权限示例">
    <n-h1> 当前权限：{{ role }}</n-h1>
    <n-h2>v-permission 指令用法</n-h2>
    <n-space>
      <n-button v-permission="'super'">
        仅super可见
      </n-button>
      <n-button v-permission="['admin']">
        admin可见
      </n-button>
    </n-space>

    <n-h2>usePermission 函数用法</n-h2>
    <n-space>
      <n-button v-if="hasPermission('super')">
        super可见
      </n-button>
      <n-button v-if="hasPermission('admin')">
        admin可见
      </n-button>
      <n-button v-if="hasPermission(['admin', 'user'])">
        admin和user可见
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped></style>
