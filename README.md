# Frontend Lab

バックエンドエンジニア向けの Next.js 学習用サンプルリポジトリです。
タスク管理画面を題材に、フロントエンドの一般概念、React、Next.js、API、DB のつながりを、実際に操作しながら学べる構成にしています。

## まずは難しく考えないでください

この教材では、最初からすべてを理解する必要はありません。
まずは「画面でボタンを押すと、サーバーを経由して DB のデータが変わる」という流れだけを体験してください。

```text
あなたがボタンを押す
  ↓
ブラウザが Next.js の API を呼ぶ
  ↓
API が DB のタスクを変更する
  ↓
ブラウザの画面が新しい状態になる
```

### 最初に覚える言葉は 5 つだけ

| 言葉 | やさしい意味 |
| --- | --- |
| コンポーネント | 画面を作る部品。ボタンやタスク一覧など |
| Props | 親の部品から子の部品へ渡すデータ |
| State | 画面上で変化する値。入力文字や完了状態など |
| API | ブラウザとサーバーがデータをやり取りする窓口 |
| DB | タスクなどのデータを保存する場所 |

### 最初の 10 分でやること

1. `npm run dev` を実行する
2. ブラウザでタスクを追加する
3. タスクを完了にする
4. ページを再読み込みする
5. データが残っていることを確認する

ここまでできれば、すでに「画面、API、DB」がつながった状態を体験できています。
その後で、下のハンズオンを少しずつ進めてください。

### ファイルは全部理解しなくて大丈夫です

最初は次の 3 ファイルだけ見てください。

- `src/app/page.tsx`: ページの入口です
- `src/components/task-board.tsx`: ボタンや入力欄など、操作する画面です
- `src/app/api/tasks/route.ts`: タスク一覧取得と作成の API です

`Prisma`、`Server Component`、`Client Component` などの詳しい意味は、実際に操作した後で読み返すと理解しやすくなります。

## 1. この教材のゴール

このリポジトリを一通り学習した後、次のことを説明・実装できる状態を目指します。

- ブラウザ、Next.js サーバー、API、DB の役割を説明できる
- React のコンポーネント、Props、State、イベントを使い分けられる
- Server Component と Client Component の違いを説明できる
- App Router のディレクトリ構成から URL を設計できる
- Route Handler で CRUD API を実装できる
- フォームの入力、送信中、成功、失敗、空状態を扱える
- Prisma を使って SQLite にデータを永続化できる
- 型定義とバリデーションで不正な入力を防げる

## 2. アプリケーションの全体像

このアプリでは、ブラウザからタスクを操作します。

```text
ブラウザ
   │
   │ 画面表示・クリック・フォーム入力
   ▼
Next.js Page / Client Component
   │
   │ fetch("/api/tasks")
   ▼
Route Handler
   │
   │ Prisma Client
   ▼
SQLite（dev.db）
```

### 役割の対応

| 層 | このプロジェクト | 主な責務 |
| --- | --- | --- |
| View | JSX / Tailwind CSS | 画面を表示する |
| UI 部品 | React Component | 表示と操作を部品化する |
| Server 処理 | Server Component | サーバー側でデータを準備する |
| API | Route Handler | HTTP リクエストを処理する |
| Service / Data Access | `src/lib` / Prisma | DB 操作やデータ処理を行う |
| Model / DTO | `src/types` / Prisma schema | データの形を定義する |
| Database | SQLite | データを永続化する |

## 3. セットアップ

### 必要な環境

- Node.js 20 以上
- npm
- VS Code（推奨）

### 初回セットアップ

```bash
npm install
npx prisma migrate dev
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

初回の API 呼び出し時に DB が空であれば、学習用の初期タスクが自動投入されます。

### よく使うコマンド

```bash
# 開発サーバー
npm run dev

# ESLint
npm run lint

# 本番ビルド（Prisma Client の生成も実行）
npm run build

# 本番モードで起動
npm run start

# Prisma の DB 状態を確認
npx prisma studio

# DB スキーマを変更した後にマイグレーションを作成
npx prisma migrate dev --name describe_your_change
```

### データを初期状態に戻す

学習中に DB を初期化したい場合は、次のコマンドを実行します。

```bash
npx prisma migrate reset
```

このコマンドはローカル DB のデータを削除します。共有環境では実行しないでください。

## 4. ハンズオン：まず使ってみる

### Step 1：画面を観察する

1. `npm run dev` で開発サーバーを起動する
2. トップ画面でタスク一覧を確認する
3. 「未完了」「完了」フィルタを切り替える
4. タスクの丸いボタンをクリックする
5. タスクを追加する
6. ページを再読み込みして、データが残っていることを確認する
7. タスクを削除する

この時点で、画面操作と DB 更新が API を通じて連携しています。

### Step 2：コードを読む

次の順番でファイルを読みます。

1. `src/app/page.tsx`
2. `src/components/task-board.tsx`
3. `src/app/api/tasks/route.ts`
4. `src/app/api/tasks/[id]/route.ts`
5. `src/lib/tasks.ts`
6. `prisma/schema.prisma`
7. `src/types/task.ts`

見るポイントは次の通りです。

- `page.tsx` に `"use client"` がないこと
- `task-board.tsx` の先頭に `"use client"` があること
- `page.tsx` から `TaskBoard` に `initialTasks` が渡されていること
- `useState` が入力値と画面状態を保持していること
- `fetch` が HTTP API を呼び出していること
- Route Handler が `NextResponse.json()` を返していること
- Prisma の `findMany`、`create`、`update`、`delete` が DB 操作に対応していること

### Step 3：API を直接呼び出す

開発サーバーを起動した状態で、別のターミナルから実行します。

```bash
# 一覧取得
curl http://localhost:3000/api/tasks

# タスク作成
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"curl から追加する"}'

# ID 1 を完了にする
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"status":"done"}'

# ID 1 を削除する
curl -X DELETE http://localhost:3000/api/tasks/1
```

存在しないタイトルで POST し、HTTP 400 が返ることも確認してください。

```bash
curl -i -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":""}'
```

### Step 4：ブラウザの開発者ツールを使う

1. ブラウザで開発者ツールを開く
2. Network タブを選択する
3. タスクを追加する
4. `POST /api/tasks` のリクエストを選択する
5. Request、Response、Status Code を確認する
6. 完了切り替えで `PATCH`、削除で `DELETE` が送信されることを確認する

バックエンドの API デバッグと同じように、ブラウザから送られた HTTP 通信を観察できます。

## 5. React の基本概念

### Component

画面を責務ごとの部品に分割します。

```tsx
function TaskTitle({ title }: { title: string }) {
  return <h2>{title}</h2>;
}
```

### Props

親コンポーネントから子コンポーネントへデータを渡します。

```tsx
<TaskBoard initialTasks={tasks} />
```

Props は原則として子から直接変更しません。変更が必要な場合は、親が関数を渡す設計にします。

### State

ユーザー操作で変化する値を保持します。

```tsx
const [title, setTitle] = useState("");
```

入力欄の値、選択中のフィルタ、送信中かどうかなどが State の候補です。

### イベント

```tsx
<button onClick={() => toggleTask(task.id)}>完了</button>
```

React では DOM を直接書き換えるのではなく、イベントで State を更新し、その結果として UI が再描画されます。

```text
ユーザー操作
  ↓
イベントハンドラー
  ↓
State 更新
  ↓
React が UI を再描画
```

### 状態から UI を生成する

React の基本的な考え方は次の式で表せます。

```text
UI = f(state)
```

そのため、画面には少なくとも次の状態が存在します。

- データ取得前：ローディング
- データ取得成功：一覧表示
- データが 0 件：空状態
- API 失敗：エラー表示
- フォーム送信中：ボタンを無効化、または文言を変更

## 6. Server Component と Client Component

### Server Component

Next.js では、特別な指定がないコンポーネントは Server Component です。

Server Component に向いている処理：

- DB からのデータ取得
- 外部 API 呼び出し
- 秘密情報を使う処理
- 初期 HTML の生成
- ブラウザへ送る JavaScript の削減

このプロジェクトでは `src/app/page.tsx` が Server Component です。

### Client Component

ファイルの先頭に `"use client"` を書くと Client Component になります。

Client Component に向いている処理：

- `useState` や `useEffect`
- `onClick`、`onChange`
- フォーム入力
- `window`、`localStorage` などのブラウザ API
- ユーザー操作による即時更新

このプロジェクトでは `src/components/task-board.tsx` が Client Component です。

### 判断の目安

| 処理 | 推奨 |
| --- | --- |
| DB から初期データを取得 | Server Component |
| ボタンのクリック処理 | Client Component |
| 入力欄の値を保持 | Client Component |
| API キーを使う処理 | Server Component |
| `localStorage` の読み書き | Client Component |
| 静的な見出しやレイアウト | Server Component |

原則として Server Component を基本にし、インタラクションが必要な最小範囲だけ Client Component にします。

## 7. Next.js のルーティング

App Router では、`src/app` 以下のディレクトリ構成が URL になります。

```text
src/app/page.tsx                 → /
src/app/api/tasks/route.ts       → /api/tasks
src/app/api/tasks/[id]/route.ts  → /api/tasks/:id
```

ファイルの役割：

- `page.tsx`: ページ本体
- `layout.tsx`: 配下で共有するレイアウト
- `loading.tsx`: ページ読み込み中の UI
- `error.tsx`: エラー発生時の UI
- `route.ts`: HTTP API の処理

## 8. API と DB のハンズオン課題

### 課題 A：説明文を入力できるようにする

1. `Task` 型に `description` の入力要件を確認する
2. Client Component のフォームに説明欄を追加する
3. POST リクエストの JSON に `description` を追加する
4. Route Handler で説明文を検証する
5. Prisma の `create` に説明文を渡す
6. 一覧画面に説明文を表示する

### 課題 B：タスクのタイトルを編集する

1. `PATCH /api/tasks/:id` が title も受け取れるようにする
2. タイトルが空の場合は 400 を返す
3. 一覧の各タスクに編集ボタンを追加する
4. 編集中だけ input を表示する
5. 成功時に画面の State を更新する

### 課題 C：検索機能を URL と連動させる

目標 URL：

```text
/tasks?q=next&status=todo
```

実装の観点：

- 検索条件を URL の query parameter に保存する
- ページを再読み込みしても検索条件を維持する
- URL をコピーすれば同じ画面を共有できる
- DB 検索条件と画面表示条件を分ける

### 課題 D：DB に優先度を追加する

1. Prisma schema に `priority` を追加する
2. `npx prisma migrate dev --name add_task_priority` を実行する
3. TypeScript の型を更新する
4. API の入力検証を追加する
5. UI に優先度を表示する
6. 優先度順に並び替える

## 9. Prisma と SQLite

Prisma は TypeScript から DB を型安全に扱うための ORM です。

`prisma/schema.prisma` では次のモデルを定義しています。

```text
Task
├── id          主キー
├── title       タイトル
├── description 説明
├── status      todo / done
├── createdAt   作成日時
└── updatedAt   更新日時
```

SQLite のローカル DB はプロジェクト直下の `dev.db` です。Git の対象外にしているため、DB の構造は `prisma/migrations` で管理します。

DB 構造を変更した場合：

```bash
# schema.prisma を編集した後
npx prisma migrate dev --name describe_your_change

# Prisma Client を明示的に再生成したい場合
npx prisma generate
```

本番環境では SQLite のファイル運用ではなく、PostgreSQL などの共有 DB を利用する構成を検討します。

## 10. ディレクトリ構成

```text
src/
├── app/
│   ├── api/tasks/
│   │   ├── route.ts          # GET / POST /api/tasks
│   │   └── [id]/route.ts     # PATCH / DELETE /api/tasks/:id
│   ├── error.tsx             # 画面エラー
│   ├── globals.css           # グローバル CSS
│   ├── layout.tsx            # 全ページ共通レイアウト
│   ├── loading.tsx           # 読み込み中表示
│   └── page.tsx              # トップページ（Server Component）
├── components/
│   └── task-board.tsx        # 操作可能な Client Component
├── lib/
│   └── tasks.ts              # Prisma Client とデータ処理
└── types/
    └── task.ts               # Task 型
prisma/
├── migrations/               # DB 変更履歴
└── schema.prisma             # DB モデル定義
```

## 11. バックエンドとの対応関係

| バックエンドの概念 | Next.js での対応例 |
| --- | --- |
| Controller | Route Handler / Server Component |
| DTO | TypeScript の `type` / `interface` |
| Service | `src/lib` の処理 |
| Template / View | JSX コンポーネント |
| Request state | React の `useState` |
| URL routing | `src/app` のディレクトリ構成 |
| ORM | Prisma Client |
| Migration | Prisma Migrate |
| HTTP client | ブラウザの `fetch` |

## 12. トラブルシューティング

### `prisma migrate dev` が失敗する

`.env` に次の設定があることを確認します。

```env
DATABASE_URL="file:./dev.db"
```

必要であれば `.env.example` を参考に `.env` を作成し、もう一度実行します。

### 画面を変更したのに更新されない

- 開発サーバーが起動しているか確認する
- ブラウザを強制再読み込みする
- ターミナルにコンパイルエラーがないか確認する
- `npm run lint` を実行する

### API は 500 だが画面に理由が出ない

1. 開発サーバーのターミナルを見る
2. ブラウザの Network タブで Response を確認する
3. Prisma の DB 状態を `npx prisma studio` で確認する
4. DB を初期化してよい場合だけ `npx prisma migrate reset` を実行する

## 13. 完了チェックリスト

- [ ] `npm run dev` で画面を起動できる
- [ ] タスク一覧を表示できる
- [ ] タスクを追加できる
- [ ] 空のタイトルを拒否できる
- [ ] タスクを完了・未完了に変更できる
- [ ] タスクを削除できる
- [ ] 再読み込み後もデータが残る
- [ ] Network タブで API 通信を確認できる
- [ ] `npx prisma studio` で DB を確認できる
- [ ] `npm run lint` が成功する
- [ ] `npm run build` が成功する

最初は見た目の作り込みより、データ・状態・イベント・URL の責務をどこに置くかを意識してください。
