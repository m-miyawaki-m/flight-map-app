<!-- src/components/TimelineChart.vue -->
<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

const props = defineProps<{ labels: string[]; data: number[] }>()

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: 'Altitude (m)',
      data: props.data,
      borderColor: 'blue',
      backgroundColor: 'lightblue',
      tension: 0.3,
    },
  ],
}
</script>

<template>
  <div style="max-height: 300px">
    <Line :data="chartData" />
  </div>
</template>
