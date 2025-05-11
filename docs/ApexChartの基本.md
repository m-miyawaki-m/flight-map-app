了解しました！
以下に、**Vue 3 + Vuetify 3 環境で ApexCharts（vue3-apexcharts）を使うための基本と知っておくべき知識**を、実践目線でまとめます。

---

# ✅ Vue 3 + Vuetify 3 + ApexCharts の基本とポイント集

---

## 1️⃣ 導入・インストール

```bash
npm install apexcharts vue3-apexcharts
```

### ✅ 登録（必要に応じてグローバル登録）

```ts
// main.ts
import VueApexCharts from 'vue3-apexcharts'
app.component('VueApexCharts', VueApexCharts)
```

> 局所的に使うだけなら `import VueApexCharts from 'vue3-apexcharts'` を各コンポーネントでOK。

---

## 2️⃣ 基本の使い方（テンプレ）

### ✅ コンポーネント内

```vue
<template>
  <VueApexCharts type="line" :options="chartOptions" :series="chartSeries" />
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

const chartSeries = [
  {
    name: 'Series 1',
    data: [10, 20, 30, 40],
  },
]

const chartOptions = {
  chart: {
    type: 'line',
    height: 300,
  },
  xaxis: {
    categories: ['A', 'B', 'C', 'D'],
  },
}
</script>
```

---

## 3️⃣ よく使う Chart Type（type）

| type            | 説明                                              |
| --------------- | ------------------------------------------------- |
| `line`          | 折れ線グラフ                                      |
| `bar`           | 縦棒グラフ                                        |
| `area`          | 面グラフ（塗りつぶし）                            |
| `pie` / `donut` | 円グラフ                                          |
| `radar`         | レーダーチャート                                  |
| `rangeBar`      | ガントチャート風（開始〜終了） ✅タイムライン向け |

---

## 4️⃣ Vuetifyと併用する際の重要ポイント

### ✅ ✅ 親要素でサイズを管理する（Vuetify内で使うとき）

```vue
<v-card style="height: 200px;">
  <VueApexCharts style="height: 100%;" :options="options" :series="series" />
</v-card>
```

- ApexCharts の `chart.height: '100%'` とし、Vuetify の `<v-card>` や `<v-col>` でサイズを制御
- `sparkline: true` を使えば Vuetify の余白と干渉せずに表示できる

---

## 5️⃣ データのリアクティブ対応

Vue 3 の `ref` / `computed` に対応しています。

```ts
const dynamicData = ref<number[]>([10, 20, 30])

const chartSeries = computed(() => [
  {
    name: 'リアクティブ',
    data: dynamicData.value,
  },
])
```

---

## 6️⃣ 表示崩れ・重なりの防止ポイント

| 問題             | 対応方法                                                              |
| ---------------- | --------------------------------------------------------------------- |
| グラフがはみ出す | `chart.height: '100%'` + 親に `height` を指定                         |
| 重なる           | `overflow: hidden` + `sparkline: true`                                |
| 再描画されない   | タブ切り替え時に `chart?.update()` や `invalidateSize()` を使うとよい |

---

## 7️⃣ tooltipやラベルの調整

```ts
tooltip: {
  x: { format: 'HH:mm' },
  y: {
    formatter: (val: number) => `${val} m`
  }
}
```

- `x.format` は日付系で便利（`datetime` 軸と相性が良い）
- `formatter` で単位付けなども柔軟に設定できる

---

## 8️⃣ カスタムカラー・デザイン

```ts
colors: ['#4caf50', '#2196f3']
plotOptions: {
  bar: {
    borderRadius: 4,
    horizontal: true
  }
}
```

- `colors[]` で系列ごとに色指定
- `borderRadius` で丸み調整
- `horizontal: true` は横棒グラフや `rangeBar` に特に便利

---

## 9️⃣ 複数便・グループデータの描画

```ts
series: [
  {
    name: 'FlightA',
    data: [
      { x: 'FlightA', y: [start, end] },
      { x: 'FlightA', y: [start2, end2] },
    ],
  },
  {
    name: 'FlightB',
    data: [{ x: 'FlightB', y: [start, end] }],
  },
]
```

> `rangeBar` や `bar` タイプで有効。`x` を便名、`y` を値または `[開始, 終了]` に。

---

## ✅ まとめ：Vue 3 + Vuetify 3 + ApexCharts の基本マインド

| 知っておくべきこと                 | 要点                                               |
| ---------------------------------- | -------------------------------------------------- |
| サイズ制御は親コンテナが主         | ApexChart 自体は `height: '100%'` に任せる         |
| Vuetifyの余白との干渉回避          | `sparkline: true` と `padding: 0` 指定など         |
| グラフ種別ごとに適切なオプション   | `rangeBar`, `line`, `area` などで異なる            |
| 連携は `ref` / `computed` で柔軟に | propsや状態に応じて動的更新可                      |
| 複数表示・並列表示もOK             | Vuetifyの`v-row`+`v-col`と組み合わせて柔軟に展開可 |

---

さらに応用で「アニメーション制御」「クリックイベント」「リアルタイム更新」なども可能です。
他に知っておきたい活用方法はありますか？（例：チャートからの選択イベント、外部更新、画像として保存など）

ApexCharts の `rangeBar` チャートを使う場合、\*\*データ構造は「各バーごとに `開始時間` と `終了時間` を指定する配列」\*\*になります。

---

## ✅ 基本構造（`series` 配列の中に `data` 配列）

```ts
const series = [
  {
    name: 'FlightA',
    data: [
      {
        x: 'FlightA', // ラベル（便名やカテゴリ）
        y: [startTimestamp, endTimestamp], // Unixミリ秒（または数値）
      },
      {
        x: 'FlightA',
        y: [start2, end2],
      },
    ],
  },
  {
    name: 'FlightB',
    data: [
      {
        x: 'FlightB',
        y: [start3, end3],
      },
    ],
  },
]
```

---

## ✅ 実際の例（時刻ベース・タイムライン形式）

```ts
const series = [
  {
    name: 'フライト区間',
    data: [
      {
        x: 'FlightA',
        y: [new Date('2025-05-11T10:00:00').getTime(), new Date('2025-05-11T10:15:00').getTime()],
      },
      {
        x: 'FlightA',
        y: [new Date('2025-05-11T10:30:00').getTime(), new Date('2025-05-11T10:45:00').getTime()],
      },
      {
        x: 'FlightB',
        y: [new Date('2025-05-11T10:10:00').getTime(), new Date('2025-05-11T10:25:00').getTime()],
      },
    ],
  },
]
```

---

## ✅ 時間軸表示オプション（datetime 軸を指定）

```ts
const options = {
  chart: {
    type: 'rangeBar',
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    type: 'datetime', // 時間軸として扱うために必要
  },
}
```

---

## ✅ 補足：`x` に何を入れるか？

| `x` に入れるもの         | 説明・用途                                           |
| ------------------------ | ---------------------------------------------------- |
| `'FlightA'` などの文字列 | 便名、プロセス名などラベルとして表示                 |
| 日付・数値               | グラフの軸が `category` や `numeric` のときに使用    |
| 番号 (1, 2...)           | 整列させたいだけのときにもOK（ただし読みやすさ低下） |

---

## ✅ よくある拡張

| 拡張したいこと     | 構造に追加する                             |
| ------------------ | ------------------------------------------ |
| 色を変える         | `fillColor: '#f44336'`                     |
| ラベルを追加       | `customData` や `tooltip.formatter` を活用 |
| 区間にIDをつけたい | `id: '区間1'` を付加してもOK（独自で管理） |

---

## ✅ まとめ

- `rangeBar` の `data` は **`x: ラベル`, `y: [開始, 終了]`** の構造
- **`y` の値は数値でも日時（Unixミリ秒）でもOK**
- `xaxis.type: 'datetime'` を使えば、時刻ベースでタイムラインが引ける
- 複数ラベル（便・人物・プロセスなど）にも対応可能

---

必要であれば、**複数の便を1枚に表示するテンプレート**や、**カスタムラベル・クリックイベント対応の構造**も提示できます。使い方の具体例を見ますか？

了解です！
あなたが求めているのは、**ApexCharts の `rangeBar` チャートで「周期的な表示区間（ON/OFF）を自動生成」して表示する**ことですね。

---

## ✅ 目的：周期的な区間（ON区間）を `rangeBar` で描画する

例えば：

- 時間：`10:00:00 ~ 10:15:00`
- 周期：3分
- 表示：

  - `10:00 ~ 10:03` ✔️
  - `10:03 ~ 10:06` ❌
  - `10:06 ~ 10:09` ✔️
  - `10:09 ~ 10:12` ❌
  - `10:12 ~ 10:15` ✔️

---

## ✅ 必要な構造（`series` を周期で構築）

### ▼ 自動生成関数（周期ON/OFF）

```ts
function generatePeriodicRangeBars(
  label: string,
  startTime: string, // ISO
  endTime: string, // ISO
  periodMinutes: number,
) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const result: { x: string; y: [number, number] }[] = []

  let current = start
  let show = true

  while (current < end) {
    const next = current + periodMinutes * 60 * 1000
    if (show) {
      result.push({
        x: label,
        y: [current, Math.min(next, end)],
      })
    }
    current = next
    show = !show
  }

  return [
    {
      name: label,
      data: result,
    },
  ]
}
```

---

## ✅ 使用例

```ts
const series = generatePeriodicRangeBars('FlightA', '2025-05-11T10:00:00', '2025-05-11T10:15:00', 3)
```

これで、ApexCharts の `rangeBar` 用データが周期ON/OFFに従って自動生成されます。

---

## ✅ 表示オプション（`rangeBar`用）

```ts
const options = {
  chart: {
    type: 'rangeBar',
    height: '100%',
    sparkline: { enabled: true },
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '40%',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: { datetimeUTC: false },
  },
  tooltip: {
    x: { format: 'HH:mm' },
  },
}
```

---

## ✅ 表示結果（イメージ）

```
FlightA ━━━        ━━━        ━━━
         10:00     10:06     10:12
```

---

## ✅ 拡張アイデア（任意）

| 要件                  | 追加内容                                                |
| --------------------- | ------------------------------------------------------- |
| 色の交互切り替え      | `fillColor` を `result.push({ ..., fillColor })` に追加 |
| 複数便同時表示        | `series` を複数便分 `concat()` して渡す                 |
| データを props で渡す | 関数を Vue コンポーネント内で `computed` 化可能         |

---

この構成で周期ON/OFF区間を簡単に作成できます。
必要なら、**Vue用コンポーネントで再利用可能な状態**に仕立て直しますか？

了解しました！
以下に、周期的な `rangeBar` チャートを **Vue 3 コンポーネントとして再利用できるように構成した完全版**を提供します。

---

# ✅ `PeriodicRangeBarChart.vue`（再利用可能コンポーネント）

```vue
<!-- components/PeriodicRangeBarChart.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  flightName: string
  startTime: string // 例: '2025-05-11T10:00:00'
  endTime: string // 例: '2025-05-11T10:15:00'
  periodMinutes: number // 周期（分単位）
}

const props = defineProps<Props>()

// ✅ 周期的なON区間のみをrangeBar形式で生成
const chartSeries = computed(() => {
  const start = new Date(props.startTime).getTime()
  const end = new Date(props.endTime).getTime()
  const result: { x: string; y: [number, number] }[] = []

  let current = start
  let show = true

  while (current < end) {
    const next = current + props.periodMinutes * 60 * 1000
    if (show) {
      result.push({
        x: props.flightName,
        y: [current, Math.min(next, end)],
      })
    }
    current = next
    show = !show
  }

  return [
    {
      name: props.flightName,
      data: result,
    },
  ]
})

// ✅ チャートオプション
const chartOptions = {
  chart: {
    type: 'rangeBar',
    height: '100%',
    sparkline: { enabled: true },
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '40%',
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
  <div style="width: 100%; height: 100%;">
    <VueApexCharts type="rangeBar" :options="chartOptions" :series="chartSeries" />
  </div>
</template>
```

---

# ✅ 使用例（親コンポーネント）

```vue
<template>
  <v-card style="height: 100px;">
    <div class="text-subtitle-2 mb-1">FlightA</div>
    <div style="height: calc(100% - 20px);">
      <PeriodicRangeBarChart
        flightName="FlightA"
        startTime="2025-05-11T10:00:00"
        endTime="2025-05-11T10:15:00"
        :periodMinutes="3"
      />
    </div>
  </v-card>
</template>
```

---

## ✅ 特徴まとめ

| 特徴                    | 内容                                       |
| ----------------------- | ------------------------------------------ |
| ✅ 再利用可能           | 任意のフライト名・時間範囲・周期に対応     |
| ✅ サイズ柔軟           | 親要素の `height` に従う (`height: 100%`)  |
| ✅ Vuetifyとも相性良好  | `<v-card>` や `<v-col>` と組み合わせやすい |
| ✅ 周期ON/OFFの自動制御 | ON → OFF を交互で描画                      |

---

このまま拡張して「色分け」「複数便まとめて表示」「クリックイベント」も組み込み可能です。
それも必要であれば対応しましょうか？

良い質問です！
**ApexChartsの `rangeBar` を周期表示に使う Vue コンポーネントで、「事前に用意した表示用データ（インターフェース付き）」を渡したい**という場合、次のように対応するのがベストです。

---

## ✅ ゴール：周期生成ではなく、\*\*既に加工済みのデータ（インターフェース付き）\*\*をコンポーネントに渡す形式にする

---

## 🔷 1. データ構造（インターフェース定義）

```ts
export interface RangeBarItem {
  label: string // 表示ラベル（x軸）
  start: number // 開始時刻（Unixミリ秒）
  end: number // 終了時刻（Unixミリ秒）
}
```

---

## 🔷 2. props 経由で受け取る形の汎用 `RangeBarChart.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface RangeBarItem {
  label: string
  start: number // Unixミリ秒
  end: number // Unixミリ秒
}

const props = defineProps<{
  data: RangeBarItem[]
}>()

const chartSeries = computed(() => {
  return [
    {
      name: 'Timeline',
      data: props.data.map((item) => ({
        x: item.label,
        y: [item.start, item.end],
      })),
    },
  ]
})

const chartOptions = {
  chart: {
    type: 'rangeBar',
    height: '100%',
    sparkline: { enabled: true },
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '40%',
    },
  },
  xaxis: {
    type: 'datetime',
    labels: { datetimeUTC: false },
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
  <div style="width: 100%; height: 100%;">
    <VueApexCharts type="rangeBar" :options="chartOptions" :series="chartSeries" />
  </div>
</template>
```

---

## 🔷 3. 親コンポーネントでのデータ作成＆使用例

```ts
import type { RangeBarItem } from '@/components/RangeBarChart.vue'

const rangeData: RangeBarItem[] = [
  {
    label: 'FlightA',
    start: new Date('2025-05-11T10:00:00').getTime(),
    end: new Date('2025-05-11T10:03:00').getTime(),
  },
  {
    label: 'FlightA',
    start: new Date('2025-05-11T10:06:00').getTime(),
    end: new Date('2025-05-11T10:09:00').getTime(),
  },
  {
    label: 'FlightB',
    start: new Date('2025-05-11T10:01:00').getTime(),
    end: new Date('2025-05-11T10:05:00').getTime(),
  },
]
```

```vue
<RangeBarChart :data="rangeData" />
```

---

## ✅ メリット

| 項目                   | 内容                                            |
| ---------------------- | ----------------------------------------------- |
| 柔軟な表示             | 周期/非周期に関係なく任意の時間データを表示可能 |
| フロントでの加工も簡単 | Vue側で `Array.map()` で変換できる              |
| 型安全                 | `RangeBarItem` インターフェースで補完が効く     |
| テスト・再利用性       | データと描画が分離されるので管理しやすい        |

---

### ✅ 拡張例（任意）

- `fillColor` を個別の `RangeBarItem` に追加して色付き表示
- `customData` を入れてクリック時に詳細を参照
- 複数便を `label` で使い分けて同一チャートに表示

---

この構成で、**ビジネスロジックと表示を切り分けて柔軟かつ再利用可能なチャート化**ができます。
必要なら、**色分けやツールチップに詳細表示を追加する拡張版**もすぐ対応できます！どうしますか？

了解しました！
ご要望は以下のとおりですね：

---

## ✅ 目的

- **rangeBarチャートの左にプルダウンリスト（`<v-select>`）を配置**
- **選択された便名（例：`FlightA`）のみに絞ってタイムライン表示**
- データは事前に配列で保持されている

---

## ✅ 実現方法の構成

1. **全便のデータ（`RangeBarItem[]`）を `props` または `data` として用意**
2. **便名リストを `computed` で生成**
3. **選択された便名に基づいて `filter` して `rangeBar` 表示**
4. **UI上は `<v-row>` + `<v-col>` で左にプルダウン、右にチャート**

---

## ✅ 完全なコード例（再利用可能）

### 📄 `FilterableTimelineChart.vue`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { VSelect } from 'vuetify/components'

interface RangeBarItem {
  label: string
  start: number
  end: number
}

const props = defineProps<{
  data: RangeBarItem[]
}>()

const selectedFlight = ref<string>('') // 選択中の便名

// ▼ プルダウンに使う便名一覧（ユニーク）
const flightNames = computed(() => {
  const set = new Set(props.data.map((d) => d.label))
  return Array.from(set)
})

// ▼ 選択された便に絞り込んだデータ
const filteredSeries = computed(() => {
  if (!selectedFlight.value) return []
  const filtered = props.data.filter((d) => d.label === selectedFlight.value)
  return [
    {
      name: selectedFlight.value,
      data: filtered.map((d) => ({
        x: d.label,
        y: [d.start, d.end],
      })),
    },
  ]
})

// ▼ チャート設定
const chartOptions = {
  chart: {
    type: 'rangeBar',
    height: '100%',
    sparkline: { enabled: true },
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '40%',
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
  <v-row no-gutters>
    <!-- 左：選択 -->
    <v-col cols="4" class="pr-2">
      <v-select
        v-model="selectedFlight"
        :items="flightNames"
        label="便名を選択"
        variant="outlined"
        dense
        clearable
      />
    </v-col>

    <!-- 右：チャート -->
    <v-col cols="8" style="height: 100px;">
      <VueApexCharts type="rangeBar" :options="chartOptions" :series="filteredSeries" />
    </v-col>
  </v-row>
</template>
```

---

## ✅ 親側からの使い方（例）

```ts
const allTimelineData: RangeBarItem[] = [
  { label: 'FlightA', start: ..., end: ... },
  { label: 'FlightA', start: ..., end: ... },
  { label: 'FlightB', start: ..., end: ... },
  ...
]
```

```vue
<FilterableTimelineChart :data="allTimelineData" />
```

---

## ✅ 特徴まとめ

| 特徴                           | 説明                                  |
| ------------------------------ | ------------------------------------- |
| プルダウンで便を選択           | `v-select` 使用で Vuetifyと統一感あり |
| データ構造は `RangeBarItem[]`  | 便名・開始・終了だけのシンプル構成    |
| 選択なしなら非表示（または空） | `filteredSeries = []` で無駄描画防止  |
| コンパクトに横並び             | `v-row` + `v-col` で柔軟なUI          |

---

必要に応じて、**複数選択対応（マルチ選択）** や **ラベル付き表示・色分け**にも拡張可能です。次に進めますか？
