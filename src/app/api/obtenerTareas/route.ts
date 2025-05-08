import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tareas = await prisma.tarea.findMany();
    return NextResponse.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return NextResponse.json(
      { error: "Error al obtener las tareas." },
      { status: 500 }
    );
  }
}
