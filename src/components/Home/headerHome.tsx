import { useState, useEffect } from "react";

export default function HeaderHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval); // limpiar al desmontar
  }, []);

  return (
    <header
      className="text-white p-3 mb-5"
      style={{
        width: "100%", // Que abarque todo el ancho
        zIndex: 1000, // Para que esté por encima de otros elementos// Altura del header
        height: "80px" // Fondo semitransparente
      }}
    >
      <div className="mb-2">
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
    </header>
  );
}
