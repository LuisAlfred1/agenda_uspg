"use client";

import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar bg-dark p-1">
      <Link href="/">
        <h4>Next Google</h4>
      </Link>

      {session?.user ? (
        <div className="me-5 d-flex">
          <Link href="/dashboard" className="me-2">
            Dashboard
          </Link>
          <p className="text-white me-2">{session.user.name}</p>
          <button
            className="btn btn-warning"
            onClick={async () => {
              await signOut({
                callbackUrl: `/`,
              });
            }}
          >
            logout
          </button>
        </div>
      ) : (
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => {
              signIn();
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
