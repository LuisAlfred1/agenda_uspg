"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import SignInCard from "@/components/SignInCard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        />
        <p className="mt-3 fs-5 text-muted">Cargando tu experiencia...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="d-flex justify-content-center align-items-center vh-100">
        <SignInCard />
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="p-2" style={{ marginLeft: "250px" }}>
        {children}
      </main>
    </>
  );
}
