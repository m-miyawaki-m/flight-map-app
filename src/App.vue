<template>
  <v-app>
    <!-- スライド式コメントサイドバー -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      location="right"
      permanent
      width="300"
      mini-variant-width="64"
      class="pa-2"
    >
      <template v-if="!mini">
        <v-list-item prepend-icon="mdi-comment-text" title="フライトコメント" />
        <v-divider class="my-2" />
      </template>

      <!-- コメント一覧 -->
      <v-list>
        <v-list-item
          v-for="(comment, index) in comments"
          :key="index"
          :prepend-icon="comment.icon"
          density="compact"
        >
          <v-list-item-title>{{ comment.user }}</v-list-item-title>
          <v-list-item-subtitle>{{ comment.message }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <!-- コメント入力欄 -->
      <template v-if="!mini">
        <v-divider class="my-2" />
        <v-textarea v-model="newComment" label="コメントを入力" auto-grow rows="2" hide-details />
        <v-btn class="mt-2" block color="primary" @click="submitComment" :disabled="!newComment">
          コメント送信
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <!-- 上部フォーム -->
        <v-row align="center">
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="icao24" label="ICAO24 (例: 3c4b26)" />
              </v-col>
              <v-col cols="6" class="d-flex align-center">
                <v-btn @click="loadFlightData" color="primary">フライト読み込み</v-btn>
                <v-btn @click="drawer = !drawer" class="ml-2" color="secondary">
                  {{ drawer ? 'コメントを隠す' : 'コメントを表示' }}
                </v-btn>
                <v-btn @click="mini = !mini" class="ml-2" color="info">
                  {{ mini ? '拡張表示' : 'ミニ表示' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- 航路パターン表（追加） -->
        <v-row>
          <v-col cols="12">
            <v-data-table
              :items="flightTable"
              :headers="[
                { text: '出発地', value: 'from' },
                { text: '目的地', value: 'to' },
                { text: '便名', value: 'flight' },
              ]"
              class="elevation-1"
              item-value="flight"
              @click:row="selectFlight"
            />
          </v-col>
        </v-row>

        <!-- グラフと地図 -->
        <v-row>
          <v-col cols="4">
            <TimelineChart :labels="timestamps" :data="altitudes" v-if="altitudes.length" />
          </v-col>
          <v-col cols="8">
            <FlightMap :allPaths="flightTable" :selectedPathId="selectedFlightId" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TimelineChart from './components/TimelineChart.vue'
import FlightMap from './components/FlightMap.vue'

interface Comment {
  user: string
  icon: string
  message: string
}

interface FlightPath {
  from: string
  to: string
  flight: string
  path: [number, number, number, number, number, number, number, number][]
}

const icao24 = ref('3c4b26')
const timestamps = ref<string[]>([])
const altitudes = ref<number[]>([])
const coordinates = ref<[number, number][]>([])

const drawer = ref(true)
const mini = ref(false)

const newComment = ref('')

const submitComment = () => {
  comments.value.push({
    user: '自分',
    icon: 'mdi-account',
    message: newComment.value,
  })
  newComment.value = ''
}

const comments = ref<Comment[]>([
  { user: 'ユーザーA', icon: 'mdi-account', message: '高度が安定しています' },
  { user: 'ユーザーB', icon: 'mdi-airplane-takeoff', message: '離陸時に揺れました' },
])

const flightTable = ref<FlightPath[]>([])
const selectedFlightId = ref<string>('')

const selectFlight = (flight: FlightPath) => {
  if (!flight || !flight.path) return
  selectedFlightId.value = flight.flight
  timestamps.value = flight.path.map((p) => new Date(p[0] * 1000).toLocaleTimeString())
  altitudes.value = flight.path.map((p) => p[7])
  coordinates.value = flight.path.map((p) => [p[1], p[2]])
}

const loadFlightData = () => {
  const selected = flightTable.value.find((f) => f.flight === icao24.value)
  if (!selected) return
  selectedFlightId.value = selected.flight
  timestamps.value = selected.path.map((p) => new Date(p[0] * 1000).toLocaleTimeString())
  altitudes.value = selected.path.map((p) => p[7])
  coordinates.value = selected.path.map((p) => [p[1], p[2]])
}

onMounted(async () => {
  const data = await fetch('/flightData.json').then((res) => res.json())
  flightTable.value = data
})
</script>
