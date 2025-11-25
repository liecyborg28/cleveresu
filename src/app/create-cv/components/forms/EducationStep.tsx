
"use client";
import { useEffect, useState } from "react";
import { useCvData } from "@/redux/hooks";
import api from "@/lib/axios";
import { Pencil, Check, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = { onNext: () => void; onPrev?: () => void };

export default function EducationStep({ onNext, onPrev }: Props) {
  const cv = useCvData();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newEdu, setNewEdu] = useState({
    place: "",
    type: "formal",
    start_at: "",
    end_at: "",
    desc: "",
  });

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const res = await api.get("/education");
        cv.setEducations(res.data.data || []);
      } catch {
        toast.error("Failed to load education");
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      newEdu.start_at = new Date(newEdu.start_at).toISOString();
      newEdu.end_at = new Date(newEdu.end_at).toISOString();

      const res = await api.post("/education", newEdu);
      const newData = res.data?.data;

      if (newData?.id) {
        cv.addEducation(newData);
      } else {
        const refreshed = await api.get("/education");
        cv.setEducations(refreshed.data.data || []);
      }

      setNewEdu({
        place: "",
        type: "formal",
        start_at: "",
        end_at: "",
        desc: "",
      });

      toast.success("Education added");
    } catch {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    const updated = cv.educations.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    cv.setEducations(updated);
    try {
      await api.patch("/education", { id, [field]: value });
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete("/education", { data: { id } });
      cv.removeEducation(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading education...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Education <span className="text-blue-600">Background</span>
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Manage your education records. Tap{" "}
        <Pencil className="inline w-4 h-4 mx-1 text-blue-500" /> to edit.
      </p>

      {/* === Add New Education Form === */}
      <form
        onSubmit={handleAdd}
        className="grid gap-4 mb-8 border-2 border-gray-300 bg-gray-50 rounded-xl p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Institution / School
            </label>
            <input
              value={newEdu.place}
              onChange={(e) =>
                setNewEdu({ ...newEdu, place: e.target.value })
              }
              className="input-clean bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Type
            </label>
            <select
              value={newEdu.type}
              onChange={(e) =>
                setNewEdu({ ...newEdu, type: e.target.value })
              }
              className="input-clean bg-white"
            >
              <option value="formal">Formal</option>
              <option value="non-formal">Non-Formal</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={newEdu.start_at}
              onChange={(e) =>
                setNewEdu({ ...newEdu, start_at: e.target.value })
              }
              className="input-clean bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={newEdu.end_at}
              onChange={(e) =>
                setNewEdu({ ...newEdu, end_at: e.target.value })
              }
              className="input-clean bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={newEdu.desc}
            onChange={(e) =>
              setNewEdu({ ...newEdu, desc: e.target.value })
            }
            className="input-clean bg-white"
            rows={3}
          />
        </div>

        <button type="submit" disabled={adding} className="btn-primary w-fit">
          <Plus className="inline w-4 h-4 mr-1" />
          {adding ? "Saving..." : "Add Education"}
        </button>
      </form>

      {/* === Saved Education Cards === */}
      <div className="space-y-5">
        {cv.educations.map((edu) => {
          const isEditing = editingId === edu.id;
          return (
            <div
              key={edu.id}
              className={`border rounded-xl p-5 transition ${
                isEditing
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  {edu.place || "Unnamed Institution"}
                </h3>
                <button
                  onClick={() => setEditingId(isEditing ? null : edu.id!)}
                  className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
                >
                  {isEditing ? (
                    <Check className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Pencil className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Institution
                  </label>
                  <input
                    disabled={!isEditing}
                    value={edu.place}
                    onChange={(e) =>
                      handleUpdate(edu.id!, "place", e.target.value)
                    }
                    className="input-clean disabled:bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    disabled={!isEditing}
                    value={edu.type}
                    onChange={(e) =>
                      handleUpdate(edu.id!, "type", e.target.value)
                    }
                    className="input-clean disabled:bg-transparent"
                  >
                    <option value="formal">Formal</option>
                    <option value="non-formal">Non-Formal</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={edu.start_at?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleUpdate(edu.id!, "start_at", e.target.value)
                    }
                    className="input-clean disabled:bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={edu.end_at?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleUpdate(edu.id!, "end_at", e.target.value)
                    }
                    className="input-clean disabled:bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col mt-3">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  disabled={!isEditing}
                  value={edu.desc || ""}
                  onChange={(e) =>
                    handleUpdate(edu.id!, "desc", e.target.value)
                  }
                  className="input-clean disabled:bg-transparent w-full"
                  rows={2}
                />
              </div>

              <button
                onClick={() => handleDelete(edu.id)}
                className="text-red-600 text-sm flex items-center gap-1 mt-3 hover:text-red-700"
              >
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
          Next → Skills
        </button>
      </div>
    </div>
  );
}
