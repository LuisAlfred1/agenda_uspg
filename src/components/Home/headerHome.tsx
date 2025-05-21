"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

interface Tarea {
  id: number;
  texto: string;
  categoria: string;
  fecha: string; // Formato ISO
  completada?: boolean;
}

export default function HeaderHome() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMostrarDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setMostrarDropdown(!mostrarDropdown);
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval); // limpiar al desmontar
  }, []);
  const [hover, setHover] = useState(false);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const tareasVencidas = tareas.filter((t) => {
    const fechaTarea = new Date(t.fecha);
    fechaTarea.setHours(0, 0, 0, 0);
    return fechaTarea < hoy && !t.completada;
  });

  const tareasDeHoy = tareas.filter((t) => {
    const fechaTarea = new Date(t.fecha);
    fechaTarea.setHours(0, 0, 0, 0);
    return fechaTarea.getTime() === hoy.getTime() && !t.completada;
  });

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
    <header
      className="text-white p-3 mb-5"
      style={{
        width: "100%",
        zIndex: 1000,
        height: "80px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        {/* Información de la fecha y hora */}
        <div>
          <h3 className="mb-1 text-shadow-custom fw-bold">Mi día</h3>
          <p className="fs-6 text-shadow-custom mb-1">
            {currentTime.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="fs-6 mt-2 text-shadow-custom">
            <i className="bi bi-clock"></i>{" "}
            {currentTime.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Botones a la derecha */}
        <div className="d-flex align-items-center gap-3">
          {/*Boton de notificaciones de recordatiorios de tareas */}
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn"
              title="Notificaciones"
              onClick={toggleDropdown}
            >
              <i className="bi bi-bell-fill fs-5"></i>
              {tareasVencidas.length + tareasDeHoy.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {tareasVencidas.length + tareasDeHoy.length}
                </span>
              )}
            </button>

            {mostrarDropdown && (
              <div
                className="dropdown-menu show p-3"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  minWidth: "250px",
                }}
              >
                <h6 className="dropdown-header">Tareas de Hoy</h6>
                {tareasDeHoy.length > 0 ? (
                  tareasDeHoy.map((t) => (
                    <div key={t.id} className="dropdown-item text-wrap">
                      {t.texto}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item text-muted">
                    Ninguna tarea para hoy
                  </div>
                )}
                <div className="dropdown-divider"></div>
                <h6 className="dropdown-header">Tareas Vencidas</h6>
                {tareasVencidas.length > 0 ? (
                  tareasVencidas.map((t) => (
                    <div
                      key={t.id}
                      className="dropdown-item text-wrap text-danger"
                    >
                      {t.texto}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item text-muted">
                    No hay tareas vencidas
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Botón de cerrar sesión*/}
          <button
            className="btn btn-toogle w-100"
            onClick={() => signOut({ callbackUrl: "/" })}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <i
              className={`bi ${
                hover ? "bi-door-open fs-5" : "bi-door-closed fs-5"
              } me-2`}
            ></i>
            Salir
          </button>
        </div>
      </div>

      <style jsx>
        {`
          .btn{
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(40px);
            color: white;
            border:none;
          }
          .btn:hover{
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(40px);}
            border: none;
          }
        `}
      </style>
    </header>
  );
}
