"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6 text-center">
      <div>
        <p className="text-sm font-semibold text-rose-500">ERROR</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">画面の表示に失敗しました</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
