"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import  api  from "@/lib/axios";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { email, password });
      console.log("Register success:", res.data);

      // simpan token (kalau backend kirim)
      localStorage.setItem("token", res.data.token);

      alert("Register berhasil!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.message ||
        "Gagal register, periksa kembali data Anda.";
      alert(message);
    } finally {
      setLoading(false);
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
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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
