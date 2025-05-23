"use client";

import { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es"; // calendario en español
import dynamic from 'next/dynamic';

// Carga dinámica de FullCalendar y plugins (sin SSR)
const FullCalendar = dynamic(
  () => import("@fullcalendar/react").then((mod) => mod.default),
  { ssr: false }
);

interface Tarea {
  id: number;
  texto: string;
  categoria: string;
  fecha: string; // Formato ISO
  completada?: boolean;
}

export default function CalendarioPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(
    null
  );

  useEffect(() => {
    async function fetchTareas() {
      try {
        const res = await fetch("/api/obtenerTareas");
        const text = await res.text();
        const data: Tarea[] = text ? JSON.parse(text) : [];
        console.log(data);
        setTareas(data.filter((t) => t.fecha)); // Asegurarse de que tenga fecha
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    }

    fetchTareas();
  }, []);

  return (
    <main className="container-fluid px-4 py-2">
      <div className="row">
        {/* Panel de tarea seleccionada */}
        <div className="col-md-4 mb-4">
          <div
            className="p-4 d-flex flex-column vh-100"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(40px)",
              borderRadius: "20px",
            }}
          >
            <h3 className="text-white text-center fw-bold">
              Tarea seleccionada
            </h3>
            <hr className="text-white opacity-50" />

            {tareaSeleccionada ? (
              <div className="text-white mt-4">
                <h5 className="fw-bold mb-3">{tareaSeleccionada.texto} </h5>
                <p className="mb-3 mt-4">
                  <i className="bi bi-calendar2-event me-2 text-white"></i>
                  Fecha:{" "}
                  {new Date(tareaSeleccionada.fecha).toLocaleDateString(
                    "es-ES"
                  )}
                </p>

                <p className="mb-3">
                  <i className="bi bi-tag me-2"></i>
                  Categoría:{" "}
                  <span className="badge bg-primary">
                    {tareaSeleccionada.categoria}
                  </span>
                </p>

                <p className="mb-0">
                  {tareaSeleccionada.completada ? (
                    <>
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      Estado:{" "}
                      <span className="badge bg-success">Completada</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clock-fill me-2 text-warning"></i>
                      Estado:{" "}
                      <span className="badge bg-warning text-dark">
                        Pendiente
                      </span>
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="text-center mt-5">
                <i className="bi bi-journal-bookmark fs-1 text-white-50"></i>
                <p className="text-white mt-4 opacity-75">
                  Haz clic en una tarea para ver los detalles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Calendario */}
        <div className="col-md-8 mb-4">
          <div
            className="p-4 d-flex flex-column"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(100px)",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <div className="bg-transparent rounded" style={{ flexGrow: 1 }}>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                events={tareas.map((t) => ({
                  title: t.texto,
                  date: t.fecha,
                  id: t.id.toString(),
                }))}
                eventClick={(info) => {
                  const id = parseInt(info.event.id);
                  const tarea = tareas.find((t) => t.id === id);
                  if (tarea) setTareaSeleccionada(tarea);
                }}
                eventContent={(arg) => (
                  <div
                    style={{
                      fontWeight: "bold",
                      padding: "6px 4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      backgroundColor: "rgb(255, 255, 255, 255.1)",
                      borderRadius: "6px",
                      color: "#000",
                    }}
                    title={arg.event.title} // Tooltip completo
                  >
                    {arg.event.title}
                  </div>
                )}
                height="100%"
                contentHeight="auto"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .fc {
          background: transparent;
          color: white;
          cursor: pointer;
        }
        .fc-col-header-cell-cushion {
          color: white !important;
          font-weight: bold;
        }

        .fc-daygrid-event {
          background-color: rgb(206, 206, 206);
          border: none;
          border-radius: 6px;
          padding: 2px 4px;
          color: #000;
        }
        .fc-daygrid-event:hover {
          background-color: rgb(231, 231, 231);
        }

        .fc-toolbar-title {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .fc-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
        }

        .fc-button:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .fc-daygrid-day-number {
          color: #fff;
        }

        .fc-day-today {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </main>
  );
}
