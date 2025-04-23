"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="text-center mb-4 mt-2">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Foto de perfil"
              className="rounded-circle mb-2"
              width="70"
              height="70"
              style={{ objectFit: "cover", border: "2px solid white" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center rounded-circle mb-2 bg-secondary"
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid white",
                fontSize: "2.5rem",
                color: "white",
              }}
            >
              <i className="bi bi-person-circle"></i>
            </div>
          )}
          <h5 className="mb-0">{session.user.name}</h5>
          {session.user.email && (
            <small className="text-secondary">{session.user.email}</small>
          )}
        </div>

        <ul className="nav flex-column mt-3">
          <li className="nav-item mb-2">
            <Link href="/" className="nav-link text-white">
              <i className="bi bi-calendar me-2"></i> Mi día
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/dashboard" className="nav-link text-white">
              <i className="bi bi-view-list me-2"></i> Tareas
            </Link>
          </li>
        </ul>

        <div className="mt-auto">
          <hr className="text-secondary" />
          <button
            className="btn btn-outline-light w-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <i className="bi bi-door-closed me-2"></i> Cerrar sesión
          </button>
        </div>
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
    </div>
  );
}