"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const menus = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
  ];
  
 

  return (
    <nav className="w-full bg-white shadow-md ">
      <div className="container mx-auto flex items-center justify-between py-3 ">
        {/* Logo */}
       
          <Image
          src={"/cleveresubggg.png"}
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
          onClick={() => logout(router)}
          className="ml-4 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
