"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const handleCreate = () => router.push("create-cv");

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your CVs and create new ones easily.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CREATE NEW CARD */}
          <div
            onClick={handleCreate}
            className="cursor-pointer flex flex-col items-center justify-center 
            rounded-2xl border border-gray-300 bg-white p-10
            hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg
            transition duration-200 ease-out"
          >
            <div className="bg-blue-100 text-blue-500 rounded-full p-4 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-blue-600 font-semibold text-lg">Create New</p>
          </div>

          {/* Placeholder CV Card 1 (optional) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-32 bg-gray-100 rounded-lg mb-4"></div>
            <h3 className="font-semibold text-gray-700">Your CV Here</h3>
            <p className="text-sm text-gray-500">Click to edit or preview</p>
          </div>

          {/* Placeholder CV Card 2 (optional) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-32 bg-gray-100 rounded-lg mb-4"></div>
            <h3 className="font-semibold text-gray-700">Your CV Here</h3>
            <p className="text-sm text-gray-500">Click to edit or preview</p>
          </div>

        </div>
      </div>
    </div>
  );
}
