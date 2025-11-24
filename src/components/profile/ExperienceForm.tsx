"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";



function formatDate(isoString: string): string {
  const date = new Date(isoString);

  // Pastikan tanggal valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


type Experience = {
  id?: string;
  place: string;
  position: string;
  start_at: string;
  end_at?: string;
  desc?: string;
  certificate?: string | null;
};

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState<Experience>({
    place: "",
    position: "",
    start_at: "",
    end_at: "",
    desc: "",
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Helper: konversi tanggal ke ISO format (untuk Prisma)
  const toISO = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString();
  };

  // Helper: tampilkan ISO date sebagai YYYY-MM-DD di input
  const formatForInput = (isoDate?: string) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/experience");
        setExperiences(res.data.data || []);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tambah Experience
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.place || !newExp.position || !newExp.start_at) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("place", newExp.place);
      formData.append("position", newExp.position);
      formData.append("start_at", toISO(newExp.start_at) || "");
      formData.append("end_at", toISO(newExp.end_at || "") || "");
      formData.append("desc", newExp.desc || "");
      if (certificateFile) formData.append("certificate", certificateFile);

      const res = await api.post("/experience", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newData = res.data.data?.new_experience || res.data.data;
      setExperiences([...experiences, newData]);
      setNewExp({
        place: "",
        position: "",
        start_at: "",
        end_at: "",
        desc: "",
      });
      setCertificateFile(null);
     
    } catch (err) {
      console.error("Error adding experience:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update inline
 const handleUpdate = async (id: string, field: keyof Experience, value: string) => {
  try {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;

    const updated = { ...exp, [field]: value };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("place", updated.place);
    formData.append("position", updated.position);
    formData.append("start_at", toISO(updated.start_at) || "");
    formData.append("end_at", toISO(updated.end_at || "") || "");
    formData.append("desc", updated.desc || "");

    const res = await api.patch("/experience", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const newData = res.data.data?.updated_experience || res.data.data;

    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...newData } : e))
    );

    toast.success("Success");
  } catch (err: any) {
    console.error("Error updating experience:", err);
    toast.error("Failed to update");
  }
};


  // Upload Certificate
  const handleUploadCertificate = async (id: string, file?: File) => {
    if (!file) return;
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("certificate", file);
    formData.append("place", exp.place);
    formData.append("position", exp.position);
    formData.append("start_at", toISO(exp.start_at) || "");
    formData.append("end_at", toISO(exp.end_at || "") || "");
    formData.append("desc", exp.desc || "");

    try {
      const res = await api.patch("/experience", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedCert = res.data?.data?.updated_experience?.certificate;
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, certificate: updatedCert || null } : e
        )
      );
    } catch (err) {
      console.error("Error uploading certificate:", err);
    }
  };

  //  Delete (pakai body.id)
  const handleDelete = async (id?: string) => {
  if (!id) return;
  try {
    await api.delete("/experience", { data: { id } });
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast.success("Deleted successfully ");
  } catch (err) {
    console.error("Error deleting experience:", err);
    toast.error("Failed to delete ");
  }
};


  if (loading) {
    return (
      <div className="flex justify-center py-8 text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading experiences...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
      </div>

      {/*  Form tambah */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6"
      >
        <input
          placeholder="Company / Place"
          value={newExp.place}
          onChange={(e) => setNewExp({ ...newExp, place: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 min-w-[00px] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          placeholder="Position"
          value={newExp.position}
          onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="date"
          value={formatForInput(newExp.start_at)}
          onChange={(e) => setNewExp({ ...newExp, start_at: e.target.value })}
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="date"
          value={formatForInput(newExp.end_at)}
          onChange={(e) => setNewExp({ ...newExp, end_at: e.target.value })}
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          placeholder="Description"
          value={newExp.desc}
          onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
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

      {/* List Experience */}
      <ul className="space-y-3 ">
        {experiences.length === 0 && (
          <p className="text-gray-500 text-sm italic">No experiences yet.</p>
        )}
        {experiences.map((exp, i) => (
          <li
            key={exp.id || `temp-${i}`}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-start"
          >
            <div className="flex-1">
              <input
                value={exp.place}
                onChange={(e) => handleUpdate(exp.id!, "place", e.target.value)}
                className="font-semibold text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none w-full"
              />
              <input
                value={exp.position}
                onChange={(e) => handleUpdate(exp.id!, "position", e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-none focus:ring-0 focus:outline-none w-full "
              />
              <p className="text-xs text-gray-500 mb-1">
                {formatForInput(exp.start_at)} - {formatForInput(exp.end_at)}
              </p>
              <textarea
                value={exp.desc || ""}
                onChange={(e) => handleUpdate(exp.id!, "desc", e.target.value)}
                placeholder="Description"
                className="w-full text-sm text-gray-700 bg-transparent editable-field focus:ring-0 focus:outline-none resize-none"
                rows={2}
              />

              {/*  Certificate */}
              <div className="mt-2">
                {exp.certificate &&
                  exp.certificate !== "null" &&
                  exp.certificate.trim() !== "" &&
                  !exp.certificate.endsWith("/uploads/") && (
                    <a
                      href={exp.certificate}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline break-words"
                    >
                      - {exp.certificate.split("/").pop()}
                    </a>
                  )}
                <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer mt-1">
                  <Upload className="w-4 h-4" />
                  {exp.certificate && exp.certificate !== "null"
                    ? "Replace Certificate"
                    : "Upload Certificate"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleUploadCertificate(exp.id!, e.target.files?.[0])
                    }
                  />
                </label>
              </div>
            </div>
            <button
              onClick={() => handleDelete(exp.id)}
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
