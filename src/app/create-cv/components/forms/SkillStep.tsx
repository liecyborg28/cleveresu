"use client";
import { useEffect, useState } from "react";
import { useCvData } from "@/redux/hooks";
import api from "@/lib/axios";
import { Pencil, Check, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = { onNext: () => void; onPrev?: () => void };

export default function SkillStep({ onNext, onPrev }: Props) {
  const cv = useCvData();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    type: "technical",
    desc: "",
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skill");
        cv.setSkills(res.data.data || []);
      } catch {
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return toast.error("Please enter a skill name");

    setAdding(true);
    try {
      const res = await api.post("/skill", newSkill);
      const newData = res.data?.data;

      if (newData?.id) {
        cv.addSkill(newData);
      } else {
        const refreshed = await api.get("/skill");
        cv.setSkills(refreshed.data.data || []);
      }

      toast.success("Skill added successfully");
      setNewSkill({ name: "", type: "technical", desc: "" });
    } catch {
      toast.error("Failed to add skill");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    const updated = cv.skills.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    cv.setSkills(updated);
    try {
      await api.patch("/skill", { id, [field]: value });
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete("/skill", { data: { id } });
      cv.removeSkill(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading skills...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Your <span className="text-blue-600">Skills</span>
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Add and manage your skills. Tap{" "}
        <Pencil className="inline w-4 h-4 mx-1 text-blue-500" /> to edit.
      </p>

      {/* === Add New Skill Form === */}
      <form
        onSubmit={handleAdd}
        className="grid gap-4 mb-8 border-2 border-gray-300 bg-gray-50 rounded-xl p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Skill Name
            </label>
            <input
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="input-clean bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Type
            </label>
            <select
              value={newSkill.type}
              onChange={(e) =>
                setNewSkill({ ...newSkill, type: e.target.value })
              }
              className="input-clean bg-white"
            >
              <option value="technical">Technical</option>
              <option value="softskill">Soft Skill</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={newSkill.desc}
            onChange={(e) =>
              setNewSkill({ ...newSkill, desc: e.target.value })
            }
            className="input-clean bg-white"
            rows={3}
          />
        </div>

        <button type="submit" disabled={adding} className="btn-primary w-fit">
          <Plus className="inline w-4 h-4 mr-1" />
          {adding ? "Saving..." : "Add Skill"}
        </button>
      </form>

      {/* === Saved Skills === */}
      <div className="space-y-5">
        {cv.skills.map((skill) => {
          const isEditing = editingId === skill.id;
          return (
            <div
              key={skill.id}
              className={`border rounded-xl p-5 transition ${
                isEditing
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  {skill.name || "Unnamed Skill"}
                </h3>
                <button
                  onClick={() => setEditingId(isEditing ? null : skill.id!)}
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
                    Skill Name
                  </label>
                  <input
                    disabled={!isEditing}
                    value={skill.name}
                    onChange={(e) =>
                      handleUpdate(skill.id!, "name", e.target.value)
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
                    value={skill.type}
                    onChange={(e) =>
                      handleUpdate(skill.id!, "type", e.target.value)
                    }
                    className="input-clean disabled:bg-transparent"
                  >
                    <option value="technical">Technical</option>
                    <option value="softskill">Soft Skill</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col mt-3">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  disabled={!isEditing}
                  value={skill.desc || ""}
                  onChange={(e) =>
                    handleUpdate(skill.id!, "desc", e.target.value)
                  }
                  className="input-clean disabled:bg-transparent w-full"
                  rows={2}
                />
              </div>

              <button
                onClick={() => handleDelete(skill.id)}
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
        <button  className="btn-secondary">
          Finish
        </button>
      </div>
    </div>
  );
}
