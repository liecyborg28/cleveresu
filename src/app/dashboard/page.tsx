"use client"

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { usePrivateRoute } from "@/lib/auth";

export default function DashboardPage() {
  // usePrivateRoute();
  const router = useRouter();
  const handleCreate = () => {
    router.push("create-cv");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar/>

      {/* Isi Dashboard */}
      {/* <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Statistik</h2>
            <p className="mt-2 text-gray-500">Some stats here...</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Projects</h2>
            <p className="mt-2 text-gray-500">List of projects...</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Activities</h2>
            <p className="mt-2 text-gray-500">Recent activities...</p>
          </div>
        </div>
      </div> */}

       <h1 className="text-3xl font-bold mb-6 text-gray-500 m-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-10">
        {/* Card Create New */}
        <div
          onClick={handleCreate}
          className=" cursor-pointer p flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-xl p-10 shadow-md hover:shadow-xl hover:bg-blue-50 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          
          <p className="text-blue-600 font-semibold">CREATE NEW</p>
        </div>
      </div>
    </div>
  );
}
