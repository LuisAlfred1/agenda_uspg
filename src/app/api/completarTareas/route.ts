// /api/completarTarea.ts
import { NextResponse } from "next/server";
import {PrismaClient} from "@/generated/prisma"; // ajusta la ruta según tu proyecto

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { id, completada } = await req.json();

  if (typeof id !== "number") {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
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
