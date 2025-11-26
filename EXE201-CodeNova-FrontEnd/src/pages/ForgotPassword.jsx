import React, { useState } from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API gửi mail reset sau
    console.log("Send reset link to:", email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <LanguageSwitcher />

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">ComicTranslator</h1>
        <h2 className="text-xl font-semibold mb-2">Forgot Password</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-blue-500 hover:underline"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
