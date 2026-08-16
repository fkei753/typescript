"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/types/task";

type TaskBoardProps = {
  initialTasks: Task[];
};

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => filter === "all" || task.status === filter),
    [filter, tasks],
  );

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle.length > 100) {
      setError("タイトルは1〜100文字で入力してください");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks((currentTasks) => [...currentTasks, data.task]);
      setTitle("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "追加に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: task.status === "done" ? "todo" : "done" }),
    });
    if (!response.ok) return;
    const data = await response.json();
    setTasks((currentTasks) => currentTasks.map((item) => (item.id === id ? data.task : item)));
  }

  async function removeTask(id: number) {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (response.ok) setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
              Tasks
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">学習タスク</h2>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
            {(["all", "todo", "done"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-2 transition ${filter === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                {value === "all" ? "すべて" : value === "todo" ? "未完了" : "完了"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visibleTasks.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
              表示するタスクはありません。
            </p>
          ) : (
            visibleTasks.map((task) => (
              <article
                key={task.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-300 hover:bg-cyan-50/30"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${task.title}を${task.status === "done" ? "未完了" : "完了"}にする`}
                  className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 text-xs ${task.status === "done" ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-300"}`}
                >
                  {task.status === "done" ? "✓" : ""}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold ${task.status === "done" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                    {task.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{task.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="text-sm text-slate-400 transition hover:text-rose-500"
                >
                  削除
                </button>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Client Component</p>
        <h2 className="mt-2 text-xl font-bold">タスクを追加</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          このフォームはブラウザ上で動きます。入力値は <code>useState</code> で管理しています。
        </p>
        <form onSubmit={addTask} className="mt-5 space-y-3">
          <label htmlFor="task-title" className="block text-sm font-medium text-slate-200">
            タイトル
          </label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例: useState を調べる"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
          <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            {isSubmitting ? "追加中..." : "タスクを追加する"}
          </button>
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </form>
      </div>
    </section>
  );
}
