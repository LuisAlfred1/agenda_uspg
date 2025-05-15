import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("No autorizado", { status: 401 });
  }
  const body = await req.json();

  try {
    const tarea = await prisma.tarea.create({
      data: {
        texto: body.texto,
        categoria: body.categoria,
        fecha: body.fecha ? new Date(body.fecha) : null,
        user: { connect: { email: session.user.email } },
      },
    });

    return NextResponse.json(tarea);
  } catch (error) {
    console.error("Error al guardar tarea:", error);
    return NextResponse.json({ error: "Error al guardar tarea" }, { status: 500 });
  }
}