/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/reset", { email });
      toast.success(res.data.message || "Password reset email has been sent!");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to send reset email.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-black">
        <h1 className="text-black text-2xl font-semibold mb-4 text-center">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your email address and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-gray-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-green-600 hover:text-blue-600"
          >
            login
          </button>
        </p>
      </div>
    </div>
  );
}
