<template>
  <div ref="mapContainer" style="height: 400px"></div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import { onMounted, ref, watch } from 'vue'

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
    const latlngs: [number, number][] = path.path.map((p) => [p[1], p[2]])
    // 1つのフライトの経路を描画
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
    setTimeout(() => map?.invalidateSize(), 200) // ⭐️ 初回も念のため
  }
})

// props.selectedPathId の変更のみ監視（確実に反応）
watch(
  () => props.selectedPathId,
  () => {
    drawPaths()
    map?.invalidateSize() // ⭐️ タブ切り替え後に地図サイズを再計算
  },
)

// allPaths の変更も別途監視
watch(
  () => props.allPaths,
  () => {
    drawPaths()
    map?.invalidateSize() // ⭐️ タブ切り替え後に地図サイズを再計算
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
