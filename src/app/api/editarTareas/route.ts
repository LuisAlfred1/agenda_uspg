import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // o desde dónde lo tengas

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const { id, texto, categoria, fecha } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
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
