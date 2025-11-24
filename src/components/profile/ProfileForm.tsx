/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import api from "@/lib/axios";
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

  // 💾 Save field update safely
  const handleSave = async (field: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Pastikan hanya update field tertentu, tapi kirim semua field agar tidak null
      const payload: any = {
        full_name: profile.full_name || "",
        address: profile.address || "",
        gender: profile.gender || "",
        desc: profile.desc || "",
        birthdate:
          profile.birthdate && !isNaN(Date.parse(profile.birthdate))
            ? new Date(profile.birthdate).toISOString()
            : null,
      };

      // Update field yang sedang diedit dengan nilai baru
      payload[field] = tempValue;

      const res = await api.patch("/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setProfile((prev) => ({ ...prev, [field]: tempValue }));
        // showSuccess("Profile updated successfully ");
      } else {
        // showError("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      // showError("Failed to save");
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
