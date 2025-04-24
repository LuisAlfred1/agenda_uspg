"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import SignInCard from "@/components/SignInCard";
import Lottie from "lottie-react";
import loadingAnimation from "@/animations/puntosLoading.json";
import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Puedes subirlo si quieres que dure más la animación

    return () => clearTimeout(timeout);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: "200px", height: "200px" }}
        />
        <p className="mt-3 fs-5 text-white">Cargando tu experiencia...</p>
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
      <main className="p-3" style={{ marginLeft: "250px" }}>
        {children}
      </main>
    </>
  );
}
