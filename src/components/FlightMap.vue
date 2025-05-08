<template>
  <div ref="mapContainer" style="height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

interface FlightPath {
  from: string
  to: string
  flight: string
  path: [number, number, number, number, number, number, number, number][]
}

const props = defineProps<{ allPaths: FlightPath[]; selectedPathId: string }>()
const mapContainer = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

let polylines: L.Polyline[] = []

const drawPaths = () => {
  if (!map) return

  // 既存ポリライン削除
  polylines.forEach((poly) => map!.removeLayer(poly))
  polylines = []

  // 再描画
  for (const path of props.allPaths) {
    const latlngs = path.path.map((p) => [p[1], p[2]])
    const polyline = L.polyline(latlngs, {
      color: path.flight === props.selectedPathId ? 'red' : 'blue',
      weight: path.flight === props.selectedPathId ? 4 : 2,
    }).addTo(map!)
    polylines.push(polyline)
  }
}

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([35, 135], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)
    drawPaths()
  }
})

// props.selectedPathId の変更のみ監視（確実に反応）
watch(
  () => props.selectedPathId,
  () => {
    drawPaths()
  },
)

// allPaths の変更も別途監視
watch(
  () => props.allPaths,
  () => {
    drawPaths()
  },
  { deep: true },
)
</script>

<style scoped>
.leaflet-container {
  width: 100%;
  height: 100%;
}
</style>
