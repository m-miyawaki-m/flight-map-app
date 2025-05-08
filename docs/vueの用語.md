このコードベースにおける **双方向バインディング**, **リアクティブ変数**, **ライフサイクル** の仕組みを、Vue 3 の `Composition API` に沿ってわかりやすく解説します。

---

## ✅ 1. 双方向バインディング (`v-model`)

### 使われている箇所：

```vue
<v-text-field v-model="icao24" label="ICAO24" />
<v-textarea v-model="newComment" />
<v-navigation-drawer v-model="drawer" />
```

### 解説：

- `v-model` は Vue の「双方向バインディング」の機能。
- 入力欄の値が `icao24` にリアルタイムで同期され、変数を更新すれば入力欄にも反映されます。

| 左辺      | 右辺           | 説明                          |
| --------- | -------------- | ----------------------------- |
| UI → 変数 | 入力や操作     | ユーザーの入力が変数に反映    |
| 変数 → UI | プログラム更新 | JS 側で値を変えれば UI も更新 |

**例**：

```ts
icao24.value = 'abc123'
// → テキストフィールドにも 'abc123' が表示される
```

---

## ✅ 2. リアクティブ (`ref`, `.value`, `reactivity`)

### 宣言例：

```ts
const icao24 = ref('3c4b26')
const drawer = ref(true)
const comments = ref<Comment[]>([])
```

### 解説：

- `ref()` は Vue のリアクティブな変数（状態）を作る関数。
- `.value` を通じて中身にアクセス／代入する。
- テンプレート内では `.value` を書かずにそのまま使える（Vue が内部で解決）

| 書き方          | 説明                                               |
| --------------- | -------------------------------------------------- |
| `ref(x)`        | `x` をリアクティブに包む                           |
| `reactive(obj)` | オブジェクトをリアクティブ化（本コードでは未使用） |

**例**：

```ts
newComment.value = 'こんにちは' // 入力欄に反映
comments.value.push({ user: '自分', message: 'こんにちは', icon: 'mdi-account' })
```

---

## ✅ 3. ライフサイクルフック（`onMounted`）

### 使用例：

```ts
onMounted(async () => {
  const data = await fetch('/flightData.json').then((res) => res.json())
  flightTable.value = data
})
```

### 解説：

- `onMounted()` は Vue コンポーネントが DOM に「マウント（描画）」された直後に実行される関数。
- 初期化処理（API 呼び出し、データ読み込みなど）を行うのに最適。

**Vue の主要なライフサイクル一覧（Composition API）**：

| フック           | タイミング | 用途例             |
| ---------------- | ---------- | ------------------ |
| `onBeforeMount`  | DOM 生成前 | ログ、監視準備     |
| `onMounted`      | DOM 生成後 | 初期データ読み込み |
| `onBeforeUpdate` | 更新前     | 差分チェック       |
| `onUpdated`      | 更新後     | アニメ再実行       |
| `onUnmounted`    | 破棄時     | クリーンアップ     |

---

## ✅ まとめ：実際のコードでの活用

| 技術        | 本コードでの使用例                 | 意図                     |
| ----------- | ---------------------------------- | ------------------------ |
| `v-model`   | `v-textarea v-model="newComment"`  | 入力と変数を同期         |
| `ref()`     | `const selectedFlightId = ref('')` | 状態変化に自動反応       |
| `onMounted` | JSON読込                           | 初回表示時にデータを取得 |

---

さらに詳しく知りたい方向けに：

- `ref()` vs `reactive()` の違い
- `computed()` の導入で派生状態を管理する方法
- `watch()` の監視と反応設計

これらも興味あれば解説可能です。続けますか？

この Vue 3 Composition API を使ったプロジェクトにおける、以下の 3 つの概念を詳細に解説します：

---

## ✅ 1. `ref()` vs `reactive()` の違い

### 🔹 `ref()`

```ts
const drawer = ref(true)
const icao24 = ref('3c4b26')
```

- **プリミティブ型（文字列、数値、真偽値）や配列など単一値向け**
- `.value` を通じてアクセス／更新が必要（テンプレート内では不要）

```ts
drawer.value = false
```

---

### 🔹 `reactive()`

```ts
import { reactive } from 'vue'

const commentForm = reactive({
  user: '',
  message: '',
  icon: 'mdi-account',
})
```

- **複数のプロパティを持つ「オブジェクト・配列」向け**
- `.value` は不要（そのままアクセスできる）
- ネストしたプロパティもリアクティブに反応

```ts
commentForm.user = '自分'
```

---

### ✔ 使い分けの目安

| 用途                                   | 適するAPI    |
| -------------------------------------- | ------------ |
| 単体の値（文字列、数値、配列）         | `ref()`      |
| オブジェクト全体を状態として管理したい | `reactive()` |

---

## ✅ 2. `computed()` の使い方と意義（派生状態）

```ts
import { computed } from 'vue'

const commentCount = computed(() => comments.value.length)
```

- **リアクティブ変数から計算される“導出状態”を作る**
- `comments` が変わるたびに、自動的に `commentCount` が再計算される

---

### 実用例（例：地図が選択された時のタイトル）：

```ts
const selectedFlight = computed(() =>
  flightTable.value.find((f) => f.flight === selectedFlightId.value),
)
```

```vue
<span>選択中の便: {{ selectedFlight?.flight }}</span>
```

---

## ✅ 3. `watch()` の使い方と反応設計

```ts
import { watch } from 'vue'

watch(selectedFlightId, (newId, oldId) => {
  console.log('選択便が変わった:', oldId, '→', newId)
})
```

- **リアクティブな値の変化を“明示的に監視”し、副作用処理を行う**
- 非同期処理（API 再取得など）や、状態の連動更新に使う

---

### 高度な使用例：複数の値を監視する

```ts
watch([selectedFlightId, flightTable], ([newId, newTable]) => {
  console.log('再描画処理などを呼び出す')
})
```

---

## ✅ このコードに応じた提案

| 概要                            | 改善ポイント                                           |
| ------------------------------- | ------------------------------------------------------ |
| `selectFlight` 内でのデータ抽出 | `computed(() => selectedFlight)` に切り出せる          |
| `watch(selectedFlightId)`       | 地図やグラフ再描画など副作用的処理と親和性が高い       |
| `ref([])` のネストが深い場合    | `reactive()` + `computed()` で読みやすくなる可能性あり |

---

さらに進めるなら：

- `provide` / `inject` で状態共有
- `defineExpose()` による子→親への機能公開

なども Vue 3 の理解を深めるうえで有効です。特定の例を交えてコードに適用してみますか？

ではこのコードベースに `provide/inject` と `defineExpose()` を導入して、**コンポーネント間の状態共有** と **子→親への機能公開** を活用する方法を解説＋提案します。

---

## ✅ 1. `provide` / `inject`：親→子の状態共有（例：selectedFlightId）

### 🎯 目的：

`selectedFlightId` などの共通状態を親から `FlightMap.vue` や `TimelineChart.vue` へ「props を使わずに渡したい」ときに使います。

---

### 🔧 親 (`App.vue`)：`provide` の追加

```ts
import { provide } from 'vue'

// 末尾に追加（setupブロック内）
provide('selectedFlightId', selectedFlightId)
provide('comments', comments)
```

---

### 🧩 子 (`FlightMap.vue`など)：`inject` の使用

```ts
import { inject } from 'vue'

const selectedFlightId = inject<string>('selectedFlightId')
if (!selectedFlightId) throw new Error('selectedFlightId が提供されていません')
```

このように `inject()` すれば props を経由せず状態が共有されます。

---

## ✅ 2. `defineExpose()`：子から親にメソッドを公開する

### 🎯 目的：

たとえば `<FlightMap />` 内の地図再描画メソッドを、親（`App.vue`）から呼び出したいときに使います。

---

### 🔧 子 (`FlightMap.vue`) の expose 設定

```ts
// setupブロック内で定義
const redrawMap = () => {
  // 地図再描画ロジックなど
}

defineExpose({ redrawMap })
```

---

### 🧩 親 (`App.vue`) でアクセスする方法

```vue
<FlightMap ref="mapRef" />
```

```ts
const mapRef = ref()

const refreshMap = () => {
  mapRef.value?.redrawMap()
}
```

※ `ref="mapRef"` をつけて、`FlightMap.vue` の中で `defineExpose` されたメソッドにアクセスできます。

---

## ✳ 適用例（App.vueに導入するなら）

### setup の冒頭で：

```ts
import { ref, onMounted, provide } from 'vue'

provide('selectedFlightId', selectedFlightId)
```

---

### FlightMap.vue（例）

```ts
import { inject, onMounted } from 'vue'

const selectedFlightId = inject<string>('selectedFlightId')
defineExpose({ refreshMap: () => drawPaths() }) // 関数を親に公開
```

---

## ✅ まとめ

| 機能             | 目的                               | 適用対象                            |
| ---------------- | ---------------------------------- | ----------------------------------- |
| `provide/inject` | 親から子への props なし共有        | `selectedFlightId`, `comments` など |
| `defineExpose()` | 子コンポーネントの関数を親から呼ぶ | `FlightMap` の redraw など          |

---

必要であれば、`App.vue` および `FlightMap.vue` に適用済みのコードも生成できます。どちらの機能から導入してみますか？
