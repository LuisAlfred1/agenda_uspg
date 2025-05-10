"use client";

import HeaderHome from "@/components/Home/headerHome";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

interface Tarea {
  id: number;
  texto: string;
  categoria: string;
  fecha: string | null;
  completada?: boolean;
}

export default function HomePage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [completadas, setCompletadas] = useState(0);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    async function fetchTareas() {
      try {
        const res = await fetch("/api/obtenerTareas");
        const text = await res.text();
        const data: Tarea[] = text ? JSON.parse(text) : [];

        setTareas(data);
        setCompletadas(data.filter((t) => t.completada).length);
        setPendientes(data.filter((t) => !t.completada).length);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    }

    fetchTareas();
  }, []);

  return (
    <>
      <HeaderHome />
      <main className="container-fluid px-3">
        <div className="row">
          {/* Tareas completadas */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "200px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <h1 className="display-4 fw-bold">{completadas}</h1>
                <p className="mb-0 fs-5">Tareas completadas</p>
              </div>
            </div>
          </div>
          {/* Tareas pendientes */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "200px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <h1 className="display-4 fw-bold">{pendientes}</h1>
                <p className="mb-0 fs-5">Tareas pendientes</p>
              </div>
            </div>
          </div>
          {/* Se mostrara las tareas que estan pendientes, en formato de minicalendario (por ahora) */}
          <div className="col-md-12 mb-4">
            <div
              className="p-4 d-flex flex-column"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "280px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <p className="mb-0 fs-5">Tareas para los proximos 7 días ⬇️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estilos */}
        <style jsx>{`
          .custom-input::placeholder {
            color: white;
            opacity: 0.7;
          }
          .custom-input:focus {
            outline: none;
            box-shadow: none;
          }
        `}</style>
      </main>
    </>
  );
}
