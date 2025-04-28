"use client";

export default function Tareas() {
  return (
    <div className="d-flex flex-column  overflow-hidden">
      {/* Encabezado fijo */}
      <header className="p-3 text-white">
        <h3 className="fw-bold text-shadow-custom">Tareas</h3>
        <p className="fs-6 text-shadow-custom">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* Centro de la pantalla con scroll si es necesario */}
      <main
        className="flex-grow-1 d-flex justify-content-center align-items-center overflow-auto"
        style={{ paddingBottom: "150px" }}
      >
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
          <p className="text-white">Agrega tareas y empieza a organizarlas.</p>
        </div>
      </main>

      {/* Barra inferior fija para agregar tarea */}
      <footer
        className="d-flex align-items-center text-white p-2 mt-3"
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
        />
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
      `}</style>
    </div>
  );
}
