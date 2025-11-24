"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
// import { showSuccess } from "@/lib/toastHelper";

type Skill = {
  id?: string;
  name: string;
  desc: string;
  type: string;
};

export default function SkillSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    desc: "",
    type: "technical",
  });

  //  Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/skill");
        setSkills(res.data.data || []);
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  Tambah skill
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.desc) return;
    setSaving(true);
    try {
      const payload = {
        ...newSkill,
        name: newSkill.name.trim(),
        desc: newSkill.desc.trim(),
        type: newSkill.type.trim(),
      };
     const res = await api.post("/skill", payload);
const newData = res.data.data;

if (newData && newData.id) {
  setSkills((prev) => [...prev, newData]);
} else {
  // fallback kalau backend gak return data skill lengkap
  const refreshed = await api.get("/skill");
  setSkills(refreshed.data.data || []);
}

setNewSkill({ name: "", desc: "", type: "technical" });
// showSuccess("Saved");

      setNewSkill({ name: "", desc: "", type: "technical" });
      //  showSuccess("Saved");
    } catch (err) {
      console.error("Error adding skill:", err);
    } finally {
      setSaving(false);
    }
  };

  
  const handleUpdate = async (id: string, field: keyof Skill, value: string) => {
  try {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;

    const { user_id, created_at, updated_at, ...cleanData } = skill as any;
    const updated = { ...cleanData, [field]: value };

    
    await api.patch("/skill", { id, ...updated });

    setSkills((prev) =>
      prev.map((s) => (s.id === id ? updated : s))
    );
  } catch (err) {
    console.error("Error updating skill:", err);
  }
};


  //  Delete skill
 const handleDelete = async (id?: string) => {
  if (!id) return;
  try {
    await api.delete("/skill", { data: { id } });
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Deleted successfully");
  } catch (err: any) {
    console.error("Error deleting skill:", err);
    const message = err.response?.data?.message || "Failed to delete ";
    toast.error(message);
  }
};
  //  Loading UI
  if (loading) {
    return (
      <div className="flex justify-center py-8 text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading skills...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
      </div>

      {/*  Form tambah skill */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6"
      >
        <input
          placeholder="Skill name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 min-w-[200px] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={newSkill.type}
          onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
          className="border rounded-md px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="technical">Technical</option>
          <option value="softskill">Soft Skill</option>
        </select>
        <input
          placeholder="Description"
          value={newSkill.desc}
          onChange={(e) => setNewSkill({ ...newSkill, desc: e.target.value })}
          className="border rounded-md px-3 py-2 flex-[2] text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {/*  List skills */}
      <ul className="space-y-3">
        {skills.length === 0 && (
          <p className="text-gray-500 text-sm italic">No skills yet.</p>
        )}
        {skills.map((skill, index) => (
          <li
            key={skill.id || `temp-${index}`}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-start"
          >
            <div className="flex-1">
              <input
                value={skill.name}
                onChange={(e) => handleUpdate(skill.id!, "name", e.target.value)}
                className="font-semibold text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none w-full"
              />
              <select
                value={skill.type}
                onChange={(e) => handleUpdate(skill.id!, "type", e.target.value)}
                className="text-xs text-gray-500 capitalize bg-transparent border-none focus:ring-0 focus:outline-none mt-1"
              >
                <option value="technical">technical</option>
                <option value="softskill">softskill</option>
              </select>
              <textarea
                value={skill.desc}
                onChange={(e) => handleUpdate(skill.id!, "desc", e.target.value)}
                placeholder="Description"
                className="mt-2 w-full text-sm text-gray-700 bg-transparent border-none focus:ring-0 focus:outline-none resize-none"
                rows={2}
              />
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
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
