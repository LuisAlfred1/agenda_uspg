"use client";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Tareas() {
  const [texto, setTexto] = useState("");
  const [mostrarTareas, setMostrarTareas] = useState(false);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Tarea");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  interface Tarea {
    id: number;
    texto: string;
    categoria: string;
    fecha: string | null; // O Date dependiendo de cómo lo manejes
  }

  async function guardarTarea() {
    const tarea = {
      texto,
      categoria: categoriaSeleccionada,
      fecha: fechaSeleccionada,
    };

    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarea),
    });

    if (res.ok) {
      const nuevaTarea = await res.json();
      console.log("Tarea guardada:", nuevaTarea);
      alert("Tarea guardada con éxito");
      // Limpiar inputs
      setTexto("");
      setCategoriaSeleccionada("Tarea");
      setFechaSeleccionada(null);

      // Actualizar la lista de tareas
      fetchTareas();
      setMostrarTareas(true);
    }
  }

  async function fetchTareas() {
    try {
      const res = await fetch("/api/obtenerTareas");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];

      setTareas(data);
      setMostrarTareas(data.length > 0); // importante para mostrar lista si hay tareas
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTareas([]);
    }
  }

  useEffect(() => {
    fetchTareas();
  }, []);

  return (
    <div className="d-flex flex-column  overflow-hidden">
      {/* Encabezado fijo */}
      <header className="p-3 text-white">
        <h3 className="fw-bold text-shadow-custom">Tareas</h3>
        <p className="fs-6 text-shadow-custom">
          Agrega tus tareas y empieza a organizarlas.
        </p>
      </header>

      {/* Centro de la pantalla con scroll si es necesario */}
      <main
        className="flex-grow-1 d-flex justify-content-center align-items-center overflow-auto"
        style={{ paddingBottom: "150px" }}
      >
        {/* Condicionalmente mostrar la imagen o la lista */}
        {!mostrarTareas ? (
          <div
            className="text-center text-white p-2 mt-5"
            style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: "10px",
              backdropFilter: "blur(30px)",
              maxWidth: "220px",
            }}
          >
            <img
              src="./task.png"
              alt="tarea"
              style={{ width: "80px", marginBottom: "20px" }}
            />
            <h6>Concéntrate en tu día</h6>
            <p className="text-white">
              Agrega tareas y empieza a organizarlas.
            </p>
          </div>
        ) : (
          <div className="task-list overflow-auto">
            {tareas.map((tarea) => (
              <div className="task-item" key={tarea.id}>
                <div className="task-left">
                  <span className="circle"></span>
                  <div>
                    <h5>{tarea.texto}</h5>
                    <p className="meta">
                      {tarea.categoria} &bull;{" "}
                      {tarea.fecha
                        ? new Date(tarea.fecha).toLocaleDateString("es-MX", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })
                        : "Sin fecha"}
                    </p>
                  </div>
                </div>
                <span className="star">&#9734;</span> {/* estrella opcional */}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Barra inferior fija para agregar tarea */}
      <footer
        className="d-flex align-items-center justify-content-between text-white p-2 mt-1"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "5px",
        }}
      >
        <input
          type="text"
          className="form-control bg-transparent border-0 text-white custom-input"
          placeholder="+ Agregar una tarea nueva..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              guardarTarea();
              setMostrarTareas(true);
            }
          }}
        />

        {texto.trim() !== "" && (
          <div className="ms-2 gap-2 d-flex">
            <div style={{ position: "relative" }}>
              <button
                className="btn btn text-white"
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Fecha de vencimiento"
              >
                <div className="d-flex gap-1">
                  <i className="bi bi-calendar-event me-2"></i>
                  {fechaSeleccionada
                    ? fechaSeleccionada.toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Fecha"}
                </div>
              </button>

              {mostrarCalendario && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    zIndex: 999,
                    right: "0",
                  }}
                >
                  <DatePicker
                    selected={fechaSeleccionada}
                    onChange={(date) => {
                      setFechaSeleccionada(date);
                      setMostrarCalendario(false);
                    }}
                    inline
                  />
                </div>
              )}
            </div>
            <Tooltip id="my-tooltip" place="top" />{" "}
            {/* Tooltip muestra un mensaje al pasar el mouse por el boton */}
            <div className="dropup">
              <button
                className="btn btn text-white dropdown-toggle"
                type="button"
                id="dropdownCategoria"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-tooltip-id="tooltipCat"
                data-tooltip-content="Categoría"
              >
                <i className="bi bi-tags me-2"></i> {categoriaSeleccionada}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownCategoria">
                {["Tarea", "Laboral", "Importante"].map((cat) => (
                  <li className="listCat" key={cat}>
                    <button
                      className="dropdown-item"
                      onClick={() => setCategoriaSeleccionada(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <Tooltip id="tooltipCat" place="top" />
          </div>
        )}
      </footer>

      <style jsx>{`
        .custom-input::placeholder {
          color: white;
          opacity: 0.7;
        }
        .custom-input:focus {
          outline: none;
          box-shadow: none;
        }
        .btn {
          border: none;
          background: rgba(0, 0, 0, 0.2);
        }
        .btn:hover {
          border: none;
          background: rgba(0, 0, 0, 0.4);
        }
        .dropdown-item:hover {
          background: rgba(158, 158, 158, 0.6);
          color: black;
        }
        .task-list {
          padding: 1rem;
          font-family: "Segoe UI", sans-serif;
        }

        .task-item {
          width: 990px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #2d2d2d;
          color: white;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .task-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .circle {
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-radius: 50%;
        }

        .meta {
          font-size: 0.85rem;
          color: #bbb;
        }

        .star {
          font-size: 1.2rem;
          color: #777;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
