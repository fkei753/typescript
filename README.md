# Frontend Lab

バックエンドエンジニア向けの Next.js 学習用サンプルリポジトリです。
タスク管理画面を題材に、フロントエンドの一般的な概念と Next.js の構成を小さく学べるようにしています。

## 起動方法

```bash
npm install
npx prisma migrate dev
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

品質確認は次のコマンドで行います。

```bash
npm run lint
npm run build
```

## このリポジトリで学ぶこと

### フロントエンドの基本

- **コンポーネント**: UI を再利用可能な部品に分割する
- **Props**: 親から子へデータを渡す
- **State**: ユーザー操作によって変化する画面の状態
- **イベント**: クリックや入力など、ユーザー操作への反応
- **ローディング / エラー / 空状態**: API 通信がある画面に必要な状態
- **ルーティング**: URL と画面を対応させる仕組み

React の基本的な考え方は、状態から UI を生成することです。

```text
UI = f(state)
```

### Next.js の基本

- App Router
- Server Component
- Client Component
- Route Handler
- `layout.tsx` による共通レイアウト
- `loading.tsx` による読み込み中表示
- `error.tsx` によるエラー表示
- TypeScript によるデータ型の定義

## Server Component と Client Component

Next.js では、コンポーネントはデフォルトで Server Component です。

### Server Component

サーバーで実行されます。データ取得、DB アクセス、秘密情報を使う処理に向いています。このリポジトリでは `src/app/page.tsx` が該当します。

### Client Component

ファイルの先頭に `"use client"` を書くと、ブラウザで実行されるコンポーネントになります。`useState`、`onClick`、フォーム入力など、ユーザー操作を扱う場合に使用します。このリポジトリでは `src/components/task-board.tsx` が該当します。

原則として Server Component を基本にし、インタラクションが必要な部分だけ Client Component にします。

## ディレクトリ構成

```text
src/
├── app/
│   ├── api/tasks/route.ts  # Route Handler: GET /api/tasks
│   ├── error.tsx            # 画面エラー
│   ├── globals.css          # グローバル CSS
│   ├── layout.tsx           # 全ページ共通レイアウト
│   ├── loading.tsx          # 読み込み中表示
│   └── page.tsx             # トップページ（Server Component）
├── components/
│   └── task-board.tsx       # 操作可能な Client Component
├── lib/
│   └── tasks.ts             # データ取得ロジック
└── types/
    └── task.ts              # Task 型
```

## 学習の進め方

1. `src/app/page.tsx` を読み、サーバー側で初期データを準備する流れを確認する
2. `src/components/task-board.tsx` を読み、`useState` とイベント処理を確認する
3. タスクの追加・完了・削除をブラウザで操作する
4. `/api/tasks` を開き、Route Handler の JSON レスポンスを確認する
5. `initialTasks` の内容を変更し、Server Component から Client Component に Props が渡ることを確認する
6. 後から DB を追加し、メモリ上の配列を永続化処理に置き換える

## 次に追加するとよい機能

- タスク詳細ページ（動的ルーティング）
- DB への永続化
- POST / PATCH / DELETE API
- 入力バリデーション
- ログインと認証
- URL クエリによる検索・フィルタ
- テスト

## SQLite と API

Prisma + SQLite を使って、タスクをローカル DB に保存します。初回の `GET /api/tasks` で DB が空の場合は学習用の初期データを投入します。

```text
GET    /api/tasks       一覧取得
POST   /api/tasks       タスク作成（1〜100文字）
PATCH  /api/tasks/:id   完了・未完了の変更
DELETE /api/tasks/:id   タスク削除
```

SQLite の実体は `prisma/dev.db` です。ローカル専用ファイルとして Git の対象外にしています。DB 構造を変更した場合は、次のコマンドでマイグレーションを作成します。

```bash
npx prisma migrate dev --name describe_your_change
```

## バックエンドとの対応関係

| バックエンドの概念 | Next.js での対応例 |
| --- | --- |
| Controller | Route Handler / Server Component |
| DTO | TypeScript の `type` / `interface` |
| Service | `src/lib` の処理 |
| Template / View | JSX コンポーネント |
| Request state | React の `useState` |
| URL routing | `src/app` のディレクトリ構成 |

最初は見た目の作り込みより、データ・状態・イベント・URL の責務をどこに置くかを意識してください。
