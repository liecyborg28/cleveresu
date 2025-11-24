"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import api from "@/lib/axios";
// import { showSuccess, showError } from "@/lib/toastHelper";
import toast from "react-hot-toast";

type Education = {
  id?: string;
  place: string;
  start_at: string;
  end_at: string;
  desc: string;
  type: "formal" | "nonformal";
  certificate?: string | null;
};

export default function ProfileEducation() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEdu, setNewEdu] = useState<Education>({
    place: "",
    start_at: "",
    end_at: "",
    desc: "",
    type: "formal",
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/education");
        setEducations(res.data.data || []);
      } catch (err) {
        console.error("Error fetching educations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tambah Education
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.place || !newEdu.start_at || !newEdu.desc) 
      
      return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("place", newEdu.place);
      formData.append("start_at", newEdu.start_at);
      formData.append("end_at", newEdu.end_at || "");
      formData.append("desc", newEdu.desc);
      formData.append("type", newEdu.type);
      if (certificateFile) formData.append("certificate", certificateFile);

      const res = await api.post("/education", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newData = res.data.data?.new_education || res.data.data;
      setEducations([...educations, newData]);
      setNewEdu({
        place: "",
        start_at: "",
        end_at: "",
        desc: "",
        type: "formal",
      });
      setCertificateFile(null);
      //  showSuccess("Saved");
    } catch (err) {
      console.error("Error adding education:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update inline
 const handleUpdate = async (id: string, field: keyof Education, value: string) => {
  try {
    const edu = educations.find((e) => e.id === id);
    if (!edu) return;

    const updated = { ...edu, [field]: value };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("place", updated.place);
    formData.append("start_at", updated.start_at);
    formData.append("end_at", updated.end_at);
    formData.append("desc", updated.desc);
    formData.append("type", updated.type);

    // hanya tambahkan certificate kalau ada file baru
    if (updated.certificate && typeof updated.certificate !== "string") {
      formData.append("certificate", updated.certificate);
    }

    console.log(" PATCH FormData:", Object.fromEntries(formData.entries()));

    const res = await api.patch("/education", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const newData = res.data.data?.updated_education || res.data.data;
    setEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...newData } : e))
    );

    // showSuccess("Saved");
  } catch (err: any) {
    console.error("Error updating education:", err);
    const msg =
      err.response?.data?.message || "Gagal memperbarui data pendidikan ❌";
    // showError(msg);
  }
};

  // Upload Certificate
  const handleUploadCertificate = async (id: string, file?: File) => {
    if (!file) return;
    const edu = educations.find((e) => e.id === id);
    if (!edu) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("certificate", file);
    formData.append("place", edu.place);
    formData.append("start_at", edu.start_at);
    formData.append("end_at", edu.end_at);
    formData.append("desc", edu.desc);
    formData.append("type", edu.type);

    try {
      const res = await api.patch("/education", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedCert = res.data?.data?.updated_education?.certificate;
      setEducations((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, certificate: updatedCert || null } : e
        )
      );
    } catch (err) {
      console.error("Error uploading certificate:", err);
    }
  };

  // Delete (pakai body.id)
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete("/education", { data: { id } });
      setEducations((prev) => prev.filter((e) => e.id !== id));
       toast.success("Deleted successfully ");
    } catch (err) {
      console.error("Error deleting education:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8 text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading educations...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Education</h2>
      </div>

      {/* Form tambah */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6"
      >
        <input
          placeholder="Institution / Place"
          value={newEdu.place}
          onChange={(e) => setNewEdu({ ...newEdu, place: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 min-w-[200px] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="date"
          value={newEdu.start_at}
          onChange={(e) => setNewEdu({ ...newEdu, start_at: e.target.value })}
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="date"
          value={newEdu.end_at}
          onChange={(e) => setNewEdu({ ...newEdu, end_at: e.target.value })}
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={newEdu.type}
          onChange={(e) =>
            setNewEdu({ ...newEdu, type: e.target.value as "formal" | "nonformal" })
          }
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="formal">Formal</option>
          <option value="nonformal">Non Formal</option>
        </select>
        <input
          placeholder="Description"
          value={newEdu.desc}
          onChange={(e) => setNewEdu({ ...newEdu, desc: e.target.value })}
          className="border rounded-md px-3 py-2 flex-[2] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
          <Upload className="w-4 h-4" />
          Upload Certificate
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {/*  List Education */}
      <ul className="space-y-3">
  {educations.length === 0 && (
    <p className="text-gray-500 text-sm italic">No educations yet.</p>
  )}

  {educations.map((edu, index) => (
    <li
      key={edu.id || `temp-${index}`}
      className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-start"
    >
      <div className="flex-1">
        {/* Institution / Place */}
        <input
          value={edu.place}
          onChange={(e) => handleUpdate(edu.id!, "place", e.target.value)}
          placeholder="Institution"
          className="font-semibold text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none w-full"
        />

        {/* Type (formal / nonformal) */}
        <select
          value={edu.type}
          onChange={(e) => handleUpdate(edu.id!, "type", e.target.value)}
          className="text-xs text-gray-500 capitalize bg-transparent border-none focus:ring-0 focus:outline-none mt-1"
        >
          <option value="formal">formal</option>
          <option value="nonformal">nonformal</option>
        </select>

        {/* Dates */}
        <div className="text-xs text-gray-500 mt-1">
          <span>
            {edu.start_at} - {edu.end_at}
          </span>
        </div>

        {/* Description */}
        <textarea
          value={edu.desc}
          onChange={(e) => handleUpdate(edu.id!, "desc", e.target.value)}
          placeholder="Description"
          className="mt-2 w-full text-sm text-gray-700 bg-transparent border-none focus:ring-0 focus:outline-none resize-none"
          rows={2}
        />

        {/* Certificate Section */}
        <div className="mt-2 flex flex-col gap-1">
          {edu.certificate &&
            edu.certificate !== "null" &&
            edu.certificate.trim() !== "" &&
            !edu.certificate.endsWith("/uploads/") && (
              <a
                href={edu.certificate}
                target="_blank"
                className="text-blue-600 text-sm hover:underline break-words"
              >
                📄 {edu.certificate.split("/").pop()}
              </a>
            )}

          <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
            <Upload className="w-4 h-4" />
            {edu.certificate && edu.certificate !== "null"
              ? "Replace Certificate"
              : "Upload Certificate"}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) =>
                handleUploadCertificate(edu.id!, e.target.files?.[0])
              }
            />
          </label>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => handleDelete(edu.id)}
        className="text-red-600 hover:text-red-800 flex items-center gap-1 ml-3"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </li>
  ))}
      </ul>

    </section>
  );
}
