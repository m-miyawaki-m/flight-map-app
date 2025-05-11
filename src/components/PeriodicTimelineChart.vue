<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  flightName: string
  startTime: string // ISO文字列: 例 '2025-05-11T10:00:00'
  endTime: string // ISO文字列
  periodMinutes: number // 例: 3
}

const props = defineProps<Props>()

// ✅ データ自動生成: ON/OFF 交互の棒データ
const chartSeries = computed(() => {
  const result = []
  let cur = new Date(props.startTime).getTime()
  const end = new Date(props.endTime).getTime()
  let toggle = true

  while (cur < end) {
    const next = cur + props.periodMinutes * 60 * 1000
    if (toggle) {
      result.push({
        x: props.flightName,
        y: [cur, Math.min(next, end)],
      })
    }
    cur = next
    toggle = !toggle
  }

  return [{ data: result }]
})

// ✅ チャートオプション
const chartOptions = {
  chart: {
    type: 'rangeBar',
    height: '100%', // ← 高さは親に依存
    sparkline: { enabled: true }, // ← 余白削減
    // zoom: { enabled: false },
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '30%', // ← 相対指定（棒の太さ）
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
    },
  },
  grid: {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  tooltip: {
    x: { format: 'HH:mm' },
    y: {
      formatter: (val: [number, number]) =>
        `${new Date(val[0]).toLocaleTimeString()} - ${new Date(val[1]).toLocaleTimeString()}`,
    },
  },
}
</script>

<template>
  <div style="width: 100%; height: 100%">
    <VueApexCharts type="rangeBar" :options="chartOptions" :series="chartSeries" />
  </div>
</template>
