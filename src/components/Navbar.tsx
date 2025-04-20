"use client";

import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar navbar-expand-lg bg-dark bg-opacity-75 shadow-sm">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand text-white fw-bold fs-4">
          Next Google
        </Link>

        {session?.user ? (
          <div className="d-flex align-items-center gap-3">
            <Link href="/dashboard" className="btn btn-outline-light">
              Dashboard
            </Link>
            <span className="text-white fw-semibold">{session.user.name}</span>
            <button
              className="btn btn-outline-warning"
              onClick={async () => {
                await signOut({ callbackUrl: `/` });
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => {
              signIn();
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
