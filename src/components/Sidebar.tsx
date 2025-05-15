"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    async function obtenerNotificaciones() {
      try {
        const res = await fetch("/api/obtenerTareas");
        const data = await res.json();
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const tareasRelevantes = data.filter((t: any) => {
          const fecha = new Date(t.fecha);
          fecha.setHours(0, 0, 0, 0);
          return (
            !t.completada && (fecha.getTime() === hoy.getTime() || fecha < hoy)
          );
        });

        setNotificaciones(tareasRelevantes.length);
      } catch (error) {
        console.error("Error cargando tareas para notificación", error);
      }
    }

    obtenerNotificaciones(); // Cargar inicialmente

    const interval = setInterval(obtenerNotificaciones, 1000); // Cada minuto

    return () => clearInterval(interval); // Limpiar al desmontar
  }, [session]);

  if (!session?.user) return null;

  return (
    <div className="d-flex position-relative">
      {/* Sidebar */}
      <div
        className={`text-white p-3 vh-100 shadow-sm transition-all ${
          isOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{
          width: "250px",
          position: "fixed",
          zIndex: 1040,
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(20px)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="text-center mb-4 mt-5">
          <div
            className="d-flex justify-content-center align-items-center text-center mb-2"
            style={{
              fontSize: "3rem",
              color: "white",
            }}
            aria-label="User profile icon"
          >
            <i className="bi bi-person" aria-hidden="true"></i>
          </div>

          <h5 className="mb-0">{session.user.name}</h5>
          {session.user.email && (
            <small className="text-secondary">{session.user.email}</small>
          )}
        </div>

        <ul className="nav flex-column mt-3">
          <li className="nav-item mb-2">
            <Link
              href="/"
              className="nav-link text-white d-flex align-items-center justify-content-between"
            >
              <span>
                <i className="bi bi-house me-2"></i> Mi día
              </span>
              {notificaciones > 0 && (
                <span className="badge bg-danger ms-2">{notificaciones}</span>
              )}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/tareas" className="nav-link text-white">
              <i className="bi bi-list-task me-2"></i> Tareas
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/calendario" className="nav-link text-white">
              <i className="bi bi-calendar-event me-2"></i> Calendario
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/notas" className="nav-link text-white">
              <i className="bi bi-journals me-2"></i> Notas
            </Link>
          </li>
        </ul>
      </div>

      {/* Toggle button (mobile) */}
      <button
        className="btn btn-outline-dark m-3 d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 1050 }}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Main content with optional margin */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isOpen ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Aquí podrías renderizar children si usas layout */}
      </div>

      <style jsx>{``}</style>
    </div>
  );
}
