import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const tarea = await prisma.tarea.create({
      data: {
        texto: body.texto,
        categoria: body.categoria,
        fecha: body.fecha ? new Date(body.fecha) : null,
      },
    });

    return NextResponse.json(tarea);
  } catch (error) {
    console.error("Error al guardar tarea:", error);
    return NextResponse.json({ error: "Error al guardar tarea" }, { status: 500 });
  }
}