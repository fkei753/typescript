import type { Task } from "@/types/task";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const initialTasks: Task[] = [
  {
    id: 1,
    title: "Server Component を読む",
    description: "サーバー側でデータを取得して HTML を生成する流れを確認する",
    status: "done",
  },
  {
    id: 2,
    title: "Client Component を操作する",
    description: "フォーム入力、state 更新、イベント処理を体験する",
    status: "todo",
  },
  {
    id: 3,
    title: "Route Handler を確認する",
    description: "app/api/tasks/route.ts の GET API をブラウザから確認する",
    status: "todo",
  },
];

export function getInitialTasks() {
  return initialTasks;
}

export async function seedTasksIfEmpty() {
  const count = await prisma.task.count();

  if (count === 0) {
    await prisma.task.createMany({ data: initialTasks });
  }
}
