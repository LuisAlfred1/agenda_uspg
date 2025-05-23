"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const Tooltip = dynamic(
  () => import("react-tooltip").then((mod) => mod.Tooltip),
  { ssr: false }
);

export default function Tareas() {
  const [texto, setTexto] = useState("");
  const [mostrarTareas, setMostrarTareas] = useState(false);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Tarea");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroFecha, setFiltroFecha] = useState<Date | null>(null);

  interface Tarea {
    id: number;
    texto: string;
    categoria: string;
    fecha: string | null; // O Date dependiendo de cómo lo manejes
    creadaEn: string;
    completada?: boolean;
  }

  function normalizarFecha(fecha: Date) {
    const f = new Date(fecha);
    f.setHours(0, 0, 0, 0);
    return f;
  }

  async function guardarTarea() {
    const tarea = {
      texto,
      categoria: categoriaSeleccionada,
      fecha: fechaSeleccionada,
    };

    const res = await fetch("/api/guardarTareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarea),
    });

    if (res.ok) {
      const nuevaTarea = await res.json();
      console.log("Tarea guardada:", nuevaTarea);
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
      const data: Tarea[] = text ? JSON.parse(text) : [];

      const hoy = normalizarFecha(new Date());

      const tareasNoVencidas = data.filter((tarea) => {
        if (!tarea.fecha) {
          const creada = new Date(tarea.creadaEn);
          const ahora = new Date();
          const tiempoPasado = ahora.getTime() - creada.getTime();
          return tiempoPasado < 24 * 60 * 60 * 1000; // Menos de 24 horas
        }

        const fechaTarea = normalizarFecha(new Date(tarea.fecha));
        return fechaTarea >= hoy;
      });

      const tareasVencidas = data.filter((tarea) => {
        if (!tarea.fecha) {
          const creada = new Date(tarea.creadaEn);
          const ahora = new Date();
          const tiempoPasado = ahora.getTime() - creada.getTime();
          return tiempoPasado >= 24 * 60 * 60 * 1000;
        }

        const fechaTarea = normalizarFecha(new Date(tarea.fecha));
        return fechaTarea < hoy;
      });

      // Eliminar tareas vencidas
      for (const tarea of tareasVencidas) {
        await fetch("/api/eliminarTareas", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: tarea.id }),
        });
      }

      setTareas(tareasNoVencidas);
      setMostrarTareas(tareasNoVencidas.length > 0); // importante para mostrar lista si hay tareas
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTareas([]);
    }
  }

  useEffect(() => {
    fetchTareas();
  }, []);

  async function confirmarEdicion() {
    if (!tareaEditando) return;

    const res = await fetch("/api/editarTareas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...tareaEditando,
        fecha: tareaEditando.fecha ? new Date(tareaEditando.fecha) : null,
      }),
    });

    if (res.ok) {
      fetchTareas();
      setTareaEditando(null);
    } else {
      const error = await res.json();
      console.error("Error al editar tarea:", error);
    }
  }

  async function marcarCompletada(id: number, completada: boolean) {
    const res = await fetch("/api/completarTareas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completada }),
    });

    if (res.ok) {
      fetchTareas(); // Recarga tareas actualizadas

      // Reproduce el sonido si la tarea fue completada
      if (completada) {
        const audio = new Audio("/sounds/completado.wav");
        audio.play().catch((error) => {
          console.error("Error al reproducir el audio:", error);
        });
      }
    } else {
      console.error("Error al marcar como completada");
    }
  }

  async function eliminarTarea(id: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tarea de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/eliminarTareas", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          Swal.fire("¡Eliminada!", "La tarea ha sido eliminada.", "success");
          fetchTareas(); // Recargar lista
        } else {
          Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
        }
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        Swal.fire("Error", "Ocurrió un error al eliminar la tarea.", "error");
      }
    }
  }

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideCategoria =
      !filtroCategoria || tarea.categoria === filtroCategoria;

    const coincideFecha =
      !filtroFecha ||
      (tarea.fecha &&
        new Date(tarea.fecha).toDateString() === filtroFecha.toDateString());

    return coincideCategoria && coincideFecha;
  });

  return (
    <div className="d-flex flex-column ">
      {/* Encabezado fijo */}
      <header className="p-3 text-white">
        <h3 className="fw-bold text-shadow-custom">Tareas</h3>
        <p className="fs-6 text-shadow-custom">
          Agrega tus tareas y empieza a organizarlas.
        </p>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex gap-2">
            <label className="mb-0 text-shadow-custom" htmlFor="categoria">
              Categoría:
            </label>
            <select
              id="categoria"
              value={filtroCategoria || ""}
              onChange={(e) => setFiltroCategoria(e.target.value || null)}
              className="form-select form-select-sm"
            >
              <option value="">Todas</option>
              <option value="Tarea">Tarea</option>
              <option value="Laboral">Laboral</option>
              <option value="Importante">Importante</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <label className="mb-0 text-shadow-custom" htmlFor="fecha">
              Fecha:
            </label>
            <DatePicker
              id="fecha"
              selected={filtroFecha}
              onChange={(date) => setFiltroFecha(date)}
              placeholderText="Filtrar por fecha"
              className="form-control form-control-sm"
            />
          </div>

          <button
            onClick={() => {
              setFiltroFecha(null);
              setFiltroCategoria(null);
            }}
            className="btn btnFiltrar ms-3"
          >
            Limpiar filtros
          </button>
        </div>
      </header>

      {/* Centro de la pantalla con scroll si es necesario */}
      <main className="flex-grow-1 d-flex justify-content-center overflow-auto">
        {/* Condicionalmente mostrar la imagen o la lista */}
        {!mostrarTareas ? (
          <div
            className="text-center text-white p-2"
            style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: "10px",
              backdropFilter: "blur(30px)",
              maxWidth: "220px",
              marginTop: "80px",
            }}
          >
            <img
              src="./task.png"
              alt="tarea"
              style={{ width: "80px", marginBottom: "10px" }}
            />
            <h6>Concéntrate en tu día</h6>
            <p className="text-white">
              Agrega tareas y empieza a organizarlas.
            </p>
          </div>
        ) : (
          <div className="task-list overflow-auto">
            {tareasFiltradas.map((tarea) => (
              <div className="task-item" key={tarea.id}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    data-tooltip-id="tooltipCompletada"
                    data-tooltip-content="Marcar"
                    checked={tarea.completada}
                    onChange={() =>
                      marcarCompletada(tarea.id, !tarea.completada)
                    }
                  />
                  <Tooltip id="tooltipCompletada" place="top" />
                  <div>
                    <h5
                      style={{
                        textDecoration: tarea.completada
                          ? "line-through"
                          : "none",
                        color: tarea.completada ? "#aaa" : "white",
                      }}
                    >
                      {tarea.texto}
                    </h5>
                    <p className="meta">
                      <i className="bi bi-tag"></i> {tarea.categoria} &bull;{" "}
                      {tarea.fecha ? (
                        <>
                          <i className="bi bi-calendar"></i>{" "}
                          {new Date(tarea.fecha).toLocaleDateString("es-MX", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </>
                      ) : (
                        "Sin fecha"
                      )}
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn text-primary"
                    data-tooltip-id="tooltipEditar"
                    data-tooltip-content="Editar"
                    onClick={() => setTareaEditando(tarea)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                    <Tooltip id="tooltipEditar" place="top" />
                  </button>
                  <button
                    className="btn text-danger"
                    data-tooltip-id="tooltipEliminar"
                    data-tooltip-content="Eliminar"
                    onClick={() => eliminarTarea(tarea.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                    <Tooltip id="tooltipEliminar" place="top" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Barra inferior fija para agregar tarea */}
      <footer
        className="d-flex align-items-center justify-content-between text-white p-2 position-fixed"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "5px",
          zIndex: 1000,
          width: "78%",
          marginTop: "520px",
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
            <button
              className="text-white btn btn"
              data-tooltip-id="toolGuardar"
              data-tooltip-content={"Guardar"}
              onClick={() => {
                guardarTarea();
                setMostrarTareas(true);
              }}
            >
              <i className="bi bi-check2"></i>
            </button>
            <Tooltip id="toolGuardar" place="top" />
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
          max-height: calc(100vh - 290px);
        }
        .task-item {
          width: 999px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(40px);
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
        .form-check-input {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          cursor: pointer;
          background-color: rgb(238, 232, 232);
        }
        .form-check-input:hover {
          background-color: #28a745;
          border-color: #28a745;
        }
        .form-check-input:checked {
          background-color: #28a745;
          border-color: #28a745;
        }
        .btnFiltrar {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          color: white;
        }
        .btnFiltrar:hover {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          color: white;
        }
      `}</style>

      {tareaEditando && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar tarea</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setTareaEditando(null)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Texto</label>
                  <input
                    className="form-control"
                    value={tareaEditando.texto}
                    onChange={(e) =>
                      setTareaEditando({
                        ...tareaEditando,
                        texto: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    value={tareaEditando.categoria}
                    onChange={(e) =>
                      setTareaEditando({
                        ...tareaEditando,
                        categoria: e.target.value,
                      })
                    }
                  >
                    <option value="Tarea">Tarea</option>
                    <option value="Laboral">Laboral</option>
                    <option value="Importante">Importante</option>
                  </select>
                </div>

                <div className="mb-3 d-flex gap-2">
                  <label className="form-label">Fecha</label>
                  <DatePicker
                    className="form-control"
                    selected={
                      tareaEditando.fecha ? new Date(tareaEditando.fecha) : null
                    }
                    onChange={(date) =>
                      setTareaEditando({
                        ...tareaEditando,
                        fecha: date?.toISOString() ?? null,
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona una fecha"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary text-black"
                  onClick={() => setTareaEditando(null)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success text-black"
                  onClick={confirmarEdicion}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
