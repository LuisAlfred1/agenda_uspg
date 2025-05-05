"use client";

import { useState } from "react";
import HeaderHome from "@/components/Home/headerHome";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  

  return (
    <>
      <HeaderHome />
      <main className="container-fluid px-3">
        <div className="row">
          {/* Tareas completadas */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "200px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <h1 className="display-4 fw-bold">0</h1>
                <p className="mb-0 fs-5">Tareas completadas</p>
              </div>
            </div>
          </div>
          {/* Tareas pendientes */}
          <div className="col-md-6 mb-4">
            <div
              className="p-4 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "200px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <h1 className="display-4 fw-bold">0</h1>
                <p className="mb-0 fs-5">Tareas pendientes</p>
              </div>
            </div>
          </div>
          {/* Se mostrara las tareas que estan pendientes, en formato de minicalendario (por ahora) */}
          <div className="col-md-12 mb-4">
            <div
              className="p-4 d-flex flex-column"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                minHeight: "280px",
                width: "100%",
              }}
            >
              <div className="text-white text-center mb-4">
                <p className="mb-0 fs-5">Tareas para los proximos 7 días ⬇️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estilos */}
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
