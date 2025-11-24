/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useState } from "react";
import { useCvData } from "@/redux/hooks";
import api from "@/lib/axios";
import { Pencil, Check } from "lucide-react";
import { toast } from "react-hot-toast";

//helper debounce
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => {
        callback(...args);
      }, delay);
      setTimeoutId(id);
    },
    [callback, delay, timeoutId]
  );

  return debouncedFn;
}

type Props = { onNext: () => void };

export default function ProfileStep({ onNext }: Props) {
  const cv = useCvData();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        cv.setProfile(res.data.data || res.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  // debounced patch to backend
  const debouncedSave = useDebounce(async (field: string, value: string) => {
    let fixValue: any = value;
    try {
      setSaving(true);
      if (field === "birthdate") {
        fixValue = new Date(value).toISOString();
      }

      await api.patch("/profile", { [field]: fixValue });

      toast.success("Saved");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }, 500);

  const handleChange = (field: string, value: string) => {
    cv.setProfile({ [field]: value });
    debouncedSave(field, value);
  };

  // const handleUpdate = async (field: string, value: string) => {
  //   cv.setProfile({ [field]: value });
  //   try {
  //     await api.patch("/profile", { [field]: value });
  //     toast.success("Saved");
  //   } catch {
  //     toast.error("Update failed");
  //   }
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );

  const { profile } = cv;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Personal <span className="text-blue-600">Information</span>
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Manage your work experience. Tap the{" "}
        <Pencil className="inline w-4 h-4 mx-1 text-blue-500" /> icon to edit.
      </p>

      {/* === Profile Card === */}
      <div
        className={`border rounded-xl p-6 transition relative ${
          isEditing
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-white hover:shadow-sm"
        }`}>
        {/* Header bar with edit toggle */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700 text-lg">
            Basic Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition">
            {isEditing ? (
              <Check className="w-5 h-5 text-blue-600" />
            ) : (
              <Pencil className="w-5 h-5 text-gray-500 hover:text-blue-600" />
            )}
          </button>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <input
            type="text"
            disabled={!isEditing}
            value={profile.full_name || ""}
            onChange={(e) => handleChange("full_name", e.target.value)}
            placeholder="Full Name"
            className="editable-field"
          />
          <input
            type="text"
            disabled={!isEditing}
            value={profile.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Address"
            className="editable-field"
          />
          <select
            disabled={!isEditing}
            value={profile.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="editable-field">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="date"
            disabled={!isEditing}
            value={profile.birthdate?.split("T")[0] || ""}
            onChange={(e) => handleChange("birthdate", e.target.value)}
            className="editable-field"
          />
        </div>

        <textarea
          disabled={!isEditing}
          value={profile.desc || ""}
          onChange={(e) => handleChange("desc", e.target.value)}
          placeholder="Description"
          rows={3}
          className="editable-field"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button onClick={onNext} className="btn-primary">
          Next → Experience
        </button>
      </div>
    </div>
  );
}
