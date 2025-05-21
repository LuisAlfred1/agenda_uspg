"use client";

export default function Notas() {
  return (
    <div className="d-flex" style={{ height: "600px" }}>
      {/* Sidebar de notas */}
      {/* Sidebar de notas */}
      <div
        className="p-4 d-flex flex-column justify-content-between"
        style={{
          width: "300px",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          backdropFilter: "blur(70px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div>
          <h4 className="mb-4 text-white" style={{ letterSpacing: "1px" }}>
            <i className="bi bi-journal"></i> Mis notas
          </h4>

          <ul className="list-unstyled">
            <li
              className="mb-2 d-flex align-items-center gap-2 p-2 rounded"
              style={{
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <i className="bi bi-clock-history"></i>
              <span>Próximamente</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className="flex-grow-1 d-flex justify-content-center align-items-center p-4 overflow-auto"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(70px)",
          color: "white",
        }}
      >
        <div className="text-center">
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              letterSpacing: "2px",
              textShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
            }}
          >
            🚧 PRÓXIMAMENTE...
          </h1>
          {/* Puedes eliminar la imagen si ya usas Lottie */}
          {/* <img src="./notes.png" alt="notas" style={...} /> */}
        </div>

        <style>
          {`
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `}
        </style>
      </div>
    </div>
  );
}
