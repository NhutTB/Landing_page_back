import React from "react";
import { Link } from "react-router-dom";

export default function HeaderPublic() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black/80 text-white">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        ComicTranslator
      </Link>

      {/* Menu */}
      <nav className="flex items-center gap-6">
        <Link to="/login" className="hover:text-blue-400 transition">
          Login
        </Link>
        <Link to="/register" className="hover:text-blue-400 transition">
          Register
        </Link>
      </nav>
    </header>
  );
}
