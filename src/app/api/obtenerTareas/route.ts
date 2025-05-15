import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("No autorizado", { status: 401 });
  }
  try {
    const tareas = await prisma.tarea.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });
    return NextResponse.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return NextResponse.json(
      { error: "Error al obtener las tareas." },
      { status: 500 }
    );
  }
}
