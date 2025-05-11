<!-- src/components/TimelineTable.vue -->
<template>
  <v-data-table :headers="headers" :items="data" class="elevation-1" density="compact" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  data: { time: string; altitude: number }[]
}>()

const headers = computed(() => [
  { title: '時刻', value: 'time' },
  { title: '高度', value: 'altitude' },
])
</script>
