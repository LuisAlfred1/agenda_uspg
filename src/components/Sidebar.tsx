"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Sidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 vh-100 shadow-sm ${
          isOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{ width: "250px", position: "fixed", zIndex: 1040 }}
      >
        <h4 className="mb-4">Next Google</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link href="/" className="nav-link text-white">
              Inicio
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <hr className="text-secondary" />
          <p className="fw-semibold mb-1">{session.user.name}</p>
          <button
            className="btn btn-outline-light btn-sm w-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Botón toggle para responsive */}
      <button
        className="btn btn-outline-dark m-3 d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 1050 }}
      >
        ☰
      </button>

      {/* Contenido principal con margen para no chocar con el sidebar */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: isOpen ? "250px" : "0" }}
      >
        {/* Aquí puedes renderizar children si lo integras como layout */}
      </div>
    </div>
  );
}
