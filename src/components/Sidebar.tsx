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
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 vh-100 shadow-sm ${
          isOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{ width: "250px", position: "fixed", zIndex: 1040 }}
      >
        <h5 className="mb-4 text-center">{session.user.name}</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link href="/" className="nav-link text-white">
              Inicio <i className="bi bi-house"></i>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/dashboard" className="nav-link text-white">
              Dashboard <i className="bi bi-cart-dash"></i>
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <hr className="text-secondary" />
          <button
            className="btn btn-outline-light btn-md w-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
             Cerrar sesión <i className="bi bi-door-closed"></i>
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
