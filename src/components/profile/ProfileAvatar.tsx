/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Upload, User } from "lucide-react";
import api from "@/lib/axios";

interface Props {
  photo: string;
  setPhoto: (url: string) => void;
  profile: {
    full_name: string;
    address: string;
    gender: string;
    desc: string;
    birthdate: string;
  };
  setProfile: (p: any) => void;
}

export default function ProfileAvatar({
  photo,
  setPhoto,
  profile,
  setProfile,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview dulu
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);

    // kirim semua field (biar backend gak overwrite null)
    const formData = new FormData();
    formData.append("photo_profile", file);
    formData.append("full_name", profile.full_name || "");
    formData.append("address", profile.address || "");
    formData.append("gender", profile.gender || "");
    formData.append("desc", profile.desc || "");
    formData.append("birthdate", profile.birthdate || "");

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await api.patch("/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(" Foto berhasil diupload:", res.data);

      if (res.data?.data?.photo_profile) {
        // update state global di FE
        setPhoto(res.data.data.photo_profile);
        setProfile({
          ...profile,
          photo_profile: res.data.data.photo_profile,
        });
      }
    } catch (err: any) {
      console.error(" Upload gagal:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-75 h-75 rounded-4xl overflow-hidden bg-gray-200 flex justify-center items-center mt-20 shadow-inner mb-3">
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="w-12 h-12 text-gray-400" />
        )}
      </div>

      <label className="cursor-pointer bg-blue-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
        <Upload className="w-4 h-4" />
        {uploading ? "Uploading..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
