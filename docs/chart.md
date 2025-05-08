こちらは `TimelineChart.vue` における **Vue 3 Composition API + Chart.js + vue-chartjs** の文法詳細解説です。

---

## ✅ 1. `<script setup lang="ts">` の基本構造

```ts
<script setup lang="ts">
```

- `setup`: Composition API を簡潔に書くための構文
- `lang="ts"`: TypeScript を有効に

---

## ✅ 2. `Chart.js` のモジュール登録

```ts
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
```

### 解説：

- `vue-chartjs` は `chart.js` のラッパー → `Line` コンポーネントを使う
- `ChartJS.register(...)`：Chart.js v3以降で使う機能はすべて**明示的に登録が必要**

  - `Title`, `Tooltip`, `Legend`: 補助表示
  - `LineElement`, `PointElement`: 折れ線と点
  - `LinearScale`, `CategoryScale`: 軸

---

## ✅ 3. `props` の定義とデータ構築

```ts
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
```

### 解説：

- `defineProps<>()`: 親から受け取る `labels`（横軸）と `data`（縦軸）を型定義
- `chartData`: Chart.js 用のデータ構造

| プロパティ        | 説明                               |
| ----------------- | ---------------------------------- |
| `labels`          | 横軸に表示されるラベル（例：時刻） |
| `datasets`        | 表示する折れ線群（複数可）         |
| `borderColor`     | 線の色                             |
| `backgroundColor` | 点や面の塗りつぶし色               |
| `tension`         | 曲線の滑らかさ（0〜1）             |

---

## ✅ 4. `<template>` の内容

```vue
<template>
  <div style="max-height: 300px">
    <Line :data="chartData" />
  </div>
</template>
```

- `<Line>` コンポーネントは `vue-chartjs` のラッパー
- `:data="chartData"`：Chart.js 形式のオブジェクトを渡す
- `style="max-height: 300px"`：表示サイズ制限

---

## ✅ 5. 補足：Y軸や X軸、ツールチップのカスタマイズ

オプションを追加したい場合：

```ts
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  scales: {
    y: { beginAtZero: true },
    x: {},
  },
}
```

```vue
<Line :data="chartData" :options="chartOptions" />
```

---

## ✅ まとめ

| 技術                  | 役割                                 |
| --------------------- | ------------------------------------ |
| `defineProps`         | 親コンポーネントからデータを受け取る |
| `ChartJS.register`    | Chart.js 機能を明示的に登録          |
| `Line` コンポーネント | グラフ描画の本体                     |
| `chartData`           | 表示データの定義                     |

---

次に進めたいのは Chart のカスタマイズですか？ それとも、データが複数系列（高度 + 速度など）になった場合の対応でしょうか？
