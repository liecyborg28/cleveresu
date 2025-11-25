"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token")

    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-medium text-gray-800">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id); // tutup toast
                logout(router); // panggil fungsi logout kamu
                toast.success("Logged out successfully!");
                router.push("/"); // arahkan ke halaman landing page
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          padding: "16px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }
    );
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Image
          src="/cleveresubggg.png"
          width={200}
          height={100}
          alt="Cleveresu"
        />

        {/* Menu */}
        <div className="flex items-center gap-6">
          {menus.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`text-sm font-medium transition-colors ${
                pathname === m.href
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              {m.label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
