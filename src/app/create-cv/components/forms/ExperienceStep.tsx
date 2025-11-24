/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useCvData } from "@/redux/hooks";
import api from "@/lib/axios";
import { Pencil, Check, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = { onNext: () => void; onPrev?: () => void };

export default function ExperienceStep({ onNext, onPrev }: Props) {
  const cv = useCvData();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState({
    place: "",
    position: "",
    start_at: "",
    end_at: "",
    desc: "",
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.get("/experience");
        cv.setExperiences(res.data.data || []);
      } catch {
        toast.error("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.place || !newExp.position)
      return toast.error("Fill all fields");

    setSaving(true);
    try {
      let start_at = newExp.start_at;
      let end_at = newExp.end_at;

      newExp.start_at = new Date(start_at).toISOString();
      newExp.end_at = new Date(end_at).toISOString();

      const res = await api.post("/experience", newExp);
      const newData = res.data?.data;

      if (newData?.id) {
        cv.addExperience(newData);
      } else {
        // fallback refetch kalau backend gak return objek lengkap
        const refreshed = await api.get("/experience");
        cv.setExperiences(refreshed.data.data || []);
      }

      setNewExp({
        place: "",
        position: "",
        start_at: "",
        end_at: "",
        desc: "",
      });
      toast.success("Added new experience");
    } catch (err: any) {
      console.error("Error adding experience:", err.response?.data || err);
      toast.error("Failed to add experience");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    const updatedList = cv.experiences.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    cv.setExperiences(updatedList);
    try {
      await api.patch("/experience", { id, [field]: value });
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete("/experience", { data: { id } });
      cv.removeExperience(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading experiences...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Work <span className="text-blue-600">Experience</span>
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Manage your work experience. Tap the{" "}
        <Pencil className="inline w-4 h-4 mx-1 text-blue-500" /> icon to edit.
      </p>

      {/* === Add New Experience === */}
      <form
        onSubmit={handleAdd}
        className="grid gap-4 mb-8 border-2 border-gray-300 bg-gray-50 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Company / Place"
            value={newExp.place}
            onChange={(e) => setNewExp({ ...newExp, place: e.target.value })}
            className="input-clean bg-white"
          />
          <input
            placeholder="Position"
            value={newExp.position}
            onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
            className="input-clean bg-white"
          />
          <input
            type="date"
            value={newExp.start_at}
            onChange={(e) => setNewExp({ ...newExp, start_at: e.target.value })}
            className="input-clean bg-white"
          />
          <input
            type="date"
            value={newExp.end_at}
            onChange={(e) => setNewExp({ ...newExp, end_at: e.target.value })}
            className="input-clean bg-white"
          />
        </div>
        <textarea
          placeholder="Description"
          value={newExp.desc}
          onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
          className="input-clean bg-white"
          rows={3}
        />
        <button type="submit" disabled={saving} className="btn-primary w-fit">
          <Plus className="inline w-4 h-4 mr-1" />
          {saving ? "Saving..." : "Add Experience"}
        </button>
      </form>

      {/* === Saved Experiences === */}
      <div className="space-y-5">
        {cv.experiences.map((exp, index) => {
          const isEditing = editingId === exp.id;
          return (
            <div
              key={exp.id || `exp-${index}`}
              className={`border rounded-xl p-5 transition ${
                isEditing
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:shadow-sm"
              }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {exp.place || "Untitled Company"}
                  </p>
                  <p className="text-sm text-gray-600">{exp.position}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingId(isEditing ? null : exp.id!)}
                  className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
                  title={isEditing ? "Save" : "Edit"}>
                  {isEditing ? (
                    <Check className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Pencil className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                  )}
                </button>
              </div>
              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  disabled={!isEditing}
                  value={exp.place}
                  onChange={(e) =>
                    handleUpdate(exp.id!, "place", e.target.value)
                  }
                  className="input-clean disabled:bg-transparent disabled:text-gray-800"
                />
                <input
                  disabled={!isEditing}
                  value={exp.position}
                  onChange={(e) =>
                    handleUpdate(exp.id!, "position", e.target.value)
                  }
                  className="input-clean disabled:bg-transparent disabled:text-gray-800"
                />
              </div>
              <textarea
                disabled={!isEditing}
                value={exp.desc || ""}
                onChange={(e) => handleUpdate(exp.id!, "desc", e.target.value)}
                className="input-clean mt-3 disabled:bg-transparent w-full"
                rows={2}
              />
              <button
                onClick={() => handleDelete(exp.id)}
                className="text-red-600 text-sm flex items-center gap-1 mt-3 hover:text-red-700">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-10">
        {onPrev && (
          <button onClick={onPrev} className="btn-secondary">
            ← Back
          </button>
        )}
        <button onClick={onNext} className="btn-primary">
          Next → Education
        </button>
      </div>
    </div>
  );
}
