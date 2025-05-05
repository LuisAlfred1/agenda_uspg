import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function HeaderHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval); // limpiar al desmontar
  }, []);
  const [hover, setHover] = useState(false);

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
          <button className="btn btn" title="Notificaciones">
            <i className="bi bi-bell-fill fs-5"></i>
          </button>
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
