import { NextResponse } from "next/server";
import { prisma } from "@/lib/tasks";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const id = Number((await params).id);
  const body = await request.json();

  if (!Number.isInteger(id) || !["todo", "done"].includes(body.status)) {
    return NextResponse.json({ message: "不正なリクエストです" }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ task });
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number((await params).id);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "不正な ID です" }, { status: 400 });
  }

  await prisma.task.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}