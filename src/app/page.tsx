"use client";

import HeaderHome from "@/components/Home/headerHome";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  return (
    <>
      <HeaderHome />
      <main className="container-fluid px-4 py-2" style={{ marginTop: "120px" }}>
        {/* Header */}

        {/* Contenido principal */}
        <div className="row">
          {/* Tareas */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 h-100"
              style={{
                background: "rgba(0,0,0,.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-white mb-3">Tareas de hoy</h3>
              <ul className="list-group">
                <li className="list-group-item bg-transparent text-white border-secondary">
                  Terminar proyecto
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  Llamar al cliente
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  Ir al gimnasio
                </li>
              </ul>
            </div>
          </div>

          {/* Notas rápidas */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 h-100 "
              style={{
                background: "rgba(0,0,0,.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-white mb-3 p-1">Notas creadas</h3>
              <textarea
                className="form-control bg-transparent text-white custom-input"
                placeholder="Escribe tus notas aquí..."
                style={{ height: "150px", border: "none" }}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <section
          className="p-4 mt-2 text-white"
          style={{
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(40px)",
            borderRadius: "20px",
          }}
        >
          <h3 className="mb-3">Checklist</h3>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="check1" />
            <label className="form-check-label" htmlFor="check1">
              Desayunar bien
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="check2" />
            <label className="form-check-label" htmlFor="check2">
              Estudiar React
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="check3" />
            <label className="form-check-label" htmlFor="check3">
              Organizar la semana
            </label>
          </div>
        </section>
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
