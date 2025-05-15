// /api/completarTarea.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // ajusta la ruta según tu proyecto
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("No autorizado", { status: 401 });
  }

  const { id, completada } = await req.json();

  if (typeof id !== "number") {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!tarea || tarea.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes permiso para modificar esta tarea." },
        { status: 403 }
      );
    }
    // Actualizar la tarea
    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: { completada },
    });

    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
