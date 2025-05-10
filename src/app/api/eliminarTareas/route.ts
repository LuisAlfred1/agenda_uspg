import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID de la tarea es requerido." },
        { status: 400 }
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
