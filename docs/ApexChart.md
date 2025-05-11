承知しました。ここでは **ApexCharts の `rangeBar` チャート**について、Vue3 + TypeScript を前提に、**基本から応用まで詳細に解説**します。

---

# ✅ ApexCharts `rangeBar` チャート完全ガイド

---

## 🔷 1. そもそも `rangeBar` とは？

**棒グラフの1本1本に「開始値」と「終了値」があるチャート**です。
一般的な棒グラフ（`bar`）は「値 = 高さ」ですが、`rangeBar` は「値 = 開始と終了のペア」です。

よくある用途：

- ガントチャート（作業期間表示）
- タイムライン（イベント発生の区間）
- フライト/電車の運行タイミング

---

## 🔷 2. 基本構成（最小実装）

### ▼ Chartの種類

```ts
chart: {
  type: 'rangeBar'
}
```

### ▼ データ形式

```ts
const series = [
  {
    name: 'FlightA',
    data: [
      {
        x: 'FlightA',
        y: [startTimestamp, endTimestamp]
      },
      ...
    ]
  }
]
```

- `x`: 棒のラベル（カテゴリ）
- `y`: `[start, end]`（Unixタイムミリ秒 or 数値）

---

## 🔷 3. 時系列タイムラインとして使う

### ▼ 時間軸にするには `xaxis.type = 'datetime'`

```ts
xaxis: {
  type: 'datetime',
  labels: {
    datetimeUTC: false  // ローカルタイムで表示
  }
}
```

---

## 🔷 4. 横棒にする（indexAxisのような設定）

ApexCharts の場合、`horizontal: true` を指定：

```ts
plotOptions: {
  bar: {
    horizontal: true,
    barHeight: '60%' // 棒の太さを調整
  }
}
```

---

## 🔷 5. 複数棒（複数便や人物）を並べて表示

```ts
const series = [
  {
    data: [
      { x: 'FlightA', y: [start1, end1] },
      { x: 'FlightA', y: [start2, end2] },
      { x: 'FlightB', y: [start3, end3] },
      ...
    ]
  }
]
```

- 同じ `x` 値でも複数棒が並列に描画される
- 同じ系列でも `x` ラベルで分かれる

---

## 🔷 6. 色分けやデザイン調整

### ▼ 自動でランダム色にせず統一する

```ts
colors: ['#4caf50']
```

### ▼ 特定棒に色を指定する場合（`fillColor`）

```ts
data: [
  {
    x: 'FlightA',
    y: [start, end],
    fillColor: '#f44336',
  },
]
```

---

## 🔷 7. ラベル・ツールチップの制御

```ts
tooltip: {
  x: {
    format: 'HH:mm:ss'
  },
  y: {
    formatter: (val: any[]) =>
      `${new Date(val[0]).toLocaleTimeString()} - ${new Date(val[1]).toLocaleTimeString()}`
  }
}
```

---

## 🔷 8. Vue3 コンポーネントで使うには

### ▼ 必要パッケージ

```bash
npm install apexcharts vue3-apexcharts
```

### ▼ 使用例（`TimelineChart.vue`）

```vue
<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

const series = [
  {
    data: [
      {
        x: 'FlightA',
        y: [new Date('2025-05-11T10:00:00').getTime(), new Date('2025-05-11T10:03:00').getTime()],
      },
      {
        x: 'FlightA',
        y: [new Date('2025-05-11T10:06:00').getTime(), new Date('2025-05-11T10:09:00').getTime()],
      },
    ],
  },
]

const options = {
  chart: {
    type: 'rangeBar',
    height: 300,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '50%',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
    },
  },
  tooltip: {
    x: { format: 'HH:mm' },
  },
}
</script>

<template>
  <VueApexCharts type="rangeBar" :options="options" :series="series" />
</template>
```

---

## 🔷 9. 自動生成例：3分周期でON/OFF

```ts
function generateRangeBarSeries(start: string, end: string, periodMin: number): any[] {
  const result = []
  let cur = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  let toggle = true

  while (cur < endTime) {
    const next = cur + periodMin * 60 * 1000
    if (toggle) {
      result.push({
        x: 'FlightA',
        y: [cur, Math.min(next, endTime)],
      })
    }
    cur = next
    toggle = !toggle
  }

  return [{ data: result }]
}
```

---

## ✅ まとめ表

| 機能           | 設定項目                 | 例                  |
| -------------- | ------------------------ | ------------------- |
| 棒の開始・終了 | `y: [start, end]`        | `[10:00, 10:03]`    |
| 横棒にする     | `horizontal: true`       | `plotOptions.bar`   |
| 時間軸にする   | `xaxis.type: 'datetime'` | Unix timestamp 使用 |
| 棒の色         | `fillColor`, `colors`    | `'#4caf50'`         |
| 複数棒         | 同じ x に複数 y          | Gantt風に可         |

---

このあたりをベースに、**複数便（FlightA/B/C）表示**や **色付きステータス（通常/異常）** などにも発展可能です。

ご希望があれば、完全なサンプルコンポーネントも提供しますか？
