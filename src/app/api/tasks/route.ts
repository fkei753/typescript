import { NextResponse } from "next/server";
import { prisma, seedTasksIfEmpty } from "@/lib/tasks";

export async function GET() {
  await seedTasksIfEmpty();
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title || title.length > 100) {
    return NextResponse.json({ message: "タイトルは1〜100文字で入力してください" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: "API 経由で追加したタスクです",
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
