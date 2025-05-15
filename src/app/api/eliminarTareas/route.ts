import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return new Response("No autorizado", { status: 401 });

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID de la tarea es requerido." },
        { status: 400 }
      );
    }

    // Verificamos que la tarea pertenezca al usuario actual
    const tarea = await prisma.tarea.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!tarea || tarea.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta tarea." },
        { status: 403 }
      );
    }

    await prisma.tarea.delete({
      where: { id },
    });

    return NextResponse.json({ mensaje: "Tarea eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return NextResponse.json(
      { error: "Error al eliminar la tarea." },
      { status: 500 }
    );
  }
}
