/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
// import { showSuccess, showError } from "@/lib/toastHelper";

type Profile = {
  id?: string;
  full_name: string;
  address: string;
  gender: string;
  email: string;
  desc: string;
  birthdate: string;
  photo_profile: string;
};

interface Props {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function ProfileForm({ profile, setProfile }: Props) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 🖊️ Start editing specific field
  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(profile[field as keyof Profile] || "");
  };

 
const handleSave = async (field: string) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized");

    let fixValue: any = tempValue;

    // ✅ samain dengan ProfileStep
    if (field === "birthdate") {
      fixValue = tempValue ? new Date(tempValue).toISOString() : null;
    }

    await api.patch("/profile", { [field]: fixValue }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProfile((prev) => ({ ...prev, [field]: tempValue }));
    toast.success("Saved");
  } catch (err: any) {
    console.error("Error updating profile:", err);
    toast.error(err.response?.data?.message || "Update failed");
  } finally {
    setEditingField(null);
    setLoading(false);
  }
};



  return (
    <div className="space-y-5">
      {Object.entries(profile).map(([key, value]) =>
        key === "photo_profile" || key === "email" ? null : (
          <div key={key} className="flex flex-col gap-1 group">
            <label className="text-sm font-medium text-gray-600 capitalize">
              {key.replace(/_/g, " ")}
            </label>

            <div className="flex items-center gap-2">
              {editingField === key ? (
                <>
                  {key === "gender" ? (
                    <select
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={loading}
                      className="flex-1 border rounded-lg px-3 py-2 text-gray-900 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={loading}
                      className="flex-1 border rounded-lg px-3 py-2 text-gray-900 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      autoFocus
                      type={key === "birthdate" ? "date" : "text"}
                    />
                  )}
                  <button
                    onClick={() => handleSave(key)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700 transition disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-gray-800 bg-gray-50 border rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                    {value || (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </p>
                  <button
                    onClick={() => handleEdit(key)}
                    className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-700 transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
