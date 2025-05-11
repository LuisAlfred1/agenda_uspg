"use client";

import HeaderHome from "@/components/Home/headerHome";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
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
                <div className="d-flex justify-content-between align-items-center">
                  <p className="fs-5">
                    Tareas para los proximos 6 días{" "}
                    <i className="bi bi-caret-down-fill"></i>
                  </p>
                  <Link
                    href="/calendario"
                    className="btn text-white"
                    style={{ border: "none", background: "rgba(0, 0, 0, 0.2)" }}
                  >
                    <i className="bi bi-calendar-event"></i> Ver calendario
                  </Link>
                </div>

                <div className="row text-white mt-4">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const fecha = new Date();
                    fecha.setDate(fecha.getDate() + i);
                    const tareasDelDia = tareas.filter((t) => {
                      if (!t.fecha) return false;
                      const fechaTarea = new Date(t.fecha);
                      return (
                        fechaTarea.getDate() === fecha.getDate() &&
                        fechaTarea.getMonth() === fecha.getMonth() &&
                        fechaTarea.getFullYear() === fecha.getFullYear()
                      );
                    });

                    return (
                      <div key={i} className="col-md-4 mb-3">
                        <div
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "10px",
                            padding: "10px",
                            minHeight: "100px",
                          }}
                          className="text-center d-flex flex-column  align-items-center"
                        >
                          <h6 className="fw-bold">
                            {fecha.toLocaleDateString("es-MX", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </h6>

                          {tareasDelDia.length > 0 ? (
                            tareasDelDia.map((t) => (
                              <div
                                key={t.id}
                                style={{
                                  textDecoration: t.completada
                                    ? "line-through"
                                    : "none",
                                  color: t.completada ? "#aaa" : "#66d9ef",
                                  fontWeight: t.completada ? "normal" : "bold",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {t.texto}
                              </div>
                            ))
                          ) : (
                            <div
                              className=""
                              style={{ fontSize: "1rem", color: "#b0bec5" }}
                            >
                              No hay tareas
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
          .boton {
            border: none;
            background: rgba(0, 0, 0, 0.2);
          }
          .boton:hover {
            border: none;
            background: rgba(0, 0, 0, 0.4);
          }
        `}</style>
      </main>
    </>
  );
}
