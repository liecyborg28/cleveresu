
"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";

const jakarta = Plus_Jakarta_Sans({
  subsets:["latin"],
  weight: ["400", "500", "600", "700"],
});



export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);

  const  handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)


  try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.data.token; // ambil dari object data



      console.log("Login success:", res.data);
      
      
      localStorage.setItem("token", token);

      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message || "Gagal login, periksa kembali data Anda.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-jakarta">
      {/* Kiri */}
      <div className="hidden md:flex w-1/2  flex-col items-center justify-center p-10">
        <Image
          src="/CLeverResuLogoDepan.png" 
          alt="Lovebirds"
          width={600}
          height={600}
        />
        
        <p className="text-gray-700 text-center mt-2">
          Content copyright &#169; 2024 LieRa Company.
        </p>
      </div>

      {/* Kanan */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-green-200 text-black">
        <h1 className="text-3xl font-bold mb-2 text-black">Welcome to CleveResu</h1>
        <p className="text-gray-500 mb-6">Sign in to continue</p>
        <form 
          onSubmit={handleLogin}
          className="space-y-4 ">
          <div className="">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full  rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white "
              onChange={(e) => setEmail(e.target.value)}
           />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
            <div className="text-right mt-1">
              <Link href="#" className="text-sm text-green-600 hover:text-blue-600">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white rounded-md py-2 font-semibold hover:bg-gray-700"
            > 
            Sign in
          </button>
        </form>

       

        <p className="text-center text-sm text-gray-500 mt-6">
          New CleveResu ?{" "}
          <Link href="/register" className="text-green-600 font-medium hover:text-blue-600">
            Create Account
          </Link>
        </p>
      </div>
    </div>
    
  );
}
