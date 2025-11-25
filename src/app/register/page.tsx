"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // kalau masih error, hentikan proses register
    if (error || !password || !confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", { email, password });
      console.log("Register success:", res.data);

      localStorage.setItem("token", res.data.token);
      toast.success("Register successful, please check your email for verification");
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.message ||
        "Registration failed. Please check your input.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  //  trigger validasi real-time saat user mengetik di confirm password
  const handleConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setError("Password and confirm password do not match");
    } else {
      setError("");
    }
  };

  return (
    <div className={`${jakarta.className} min-h-screen flex font-jakarta`}>
      {/* Kiri */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10">
        <Image
          src="/CLeverResuLogoDepan.png"
          alt="Cleveresu Logo"
          width={600}
          height={600}
          priority
        />
        <p className="text-gray-700 text-center mt-2">
          Content copyright © 2024 LieRa Company.
        </p>
      </div>

      {/* Kanan */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-green-200 text-black">
        <h1 className="text-3xl font-bold mb-2 text-black">
          Welcome to CleveResu
        </h1>
        <p className="text-gray-500 mb-6">Create your account to get started</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setError("Password and confirm password do not match");
                } else {
                  setError("");
                }
              }}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                error
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-green-400 bg-white"
              }`}
              value={confirmPassword}
              onChange={(e) => handleConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-800 text-white rounded-md py-2 font-semibold hover:bg-gray-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 font-medium hover:text-blue-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
