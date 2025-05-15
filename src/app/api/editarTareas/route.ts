import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // o desde dónde lo tengas
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("No autorizado", { status: 401 });
  }

  try {
    const { id, texto, categoria, fecha } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // Verificar que la tarea pertenezca al usuario actual
    const tarea = await prisma.tarea.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!tarea || tarea.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta tarea." },
        { status: 403 }
      );
    }

    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: {
        texto,
        categoria,
        fecha,
      },
    });

    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error("Error al editar tarea:", error);
    return NextResponse.json({ error: "Error al editar" }, { status: 500 });
  }
}
