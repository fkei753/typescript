import { TaskBoard } from "@/components/task-board";
import { getInitialTasks } from "@/lib/tasks";
import Link from "next/link";

export default function Home() {
  const tasks = getInitialTasks();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Next.js study repo</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Frontend Lab
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            バックエンドエンジニア向けの、最小構成から学ぶ Next.js タスク管理アプリです。
            このページ自体は Server Component、下の操作部分は Client Component です。
          </p>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Server Component", "サーバーでデータを準備"],
            ["02", "Client Component", "ブラウザで状態を更新"],
            ["03", "Route Handler", "API エンドポイントを確認"],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-sm font-bold text-cyan-600">{number}</span>
              <h2 className="mt-2 font-bold">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>

        <TaskBoard initialTasks={tasks} />

        <p className="mt-8 text-center text-sm text-slate-500">
          API の確認先: <Link className="font-semibold text-cyan-700 underline" href="/api/tasks">/api/tasks</Link>
        </p>
      </div>
      </main>
  );
}
