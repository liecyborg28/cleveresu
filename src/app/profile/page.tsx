/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import ExperienceSection from "@/components/profile/ExperienceForm";
import SkillForm from "@/components/profile/SkillForm";
import { User, Briefcase, Lightbulb, GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import { usePrivateRoute } from "@/lib/auth";
import ProfileEducation from "@/components/profile/ProfileEducation";

type Profile = {
  full_name: string;
  address: string;
  gender: string;
  email: string;
  desc: string;
  birthdate: string;
  photo_profile: string;
};

export default function ProfilePage() {
  // usePrivateRoute();
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    address: "",
    gender: "",
    email: "",
    desc: "",
    birthdate: "",
    photo_profile: "",
  });

  const [skills, setSkills] = useState<string[]>([
    "JavaScript",
    "React",
    "Tailwind CSS",
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found, user not logged in.");
          return;
        }

        const res = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(" Profile data dari backend:", res.data);

        const data = res.data.data;

        const mappedProfile: Profile = {
          full_name: data.full_name || "",
          address: data.address || "",
          gender: data.gender || "",
          email: data.email || "",
          desc: data.desc || "",
          birthdate: data.birthdate || "",
          photo_profile: data.photo_profile || "",
        };

        setProfile(mappedProfile);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        alert(
          err.response?.data?.message ||
            "Gagal mengambil data profile. Coba lagi nanti."
        );
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Account Profile
        </h1>

        {/* Profile Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8 md:p-10 mb-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="md:w-1/3 flex flex-col items-center">
          <ProfileAvatar
            photo={profile.photo_profile}
            setPhoto={(url) => setProfile({ ...profile, photo_profile: url })}
            profile={profile}
            setProfile={setProfile}
          />
            </div>
            <div className="md:w-2/3">
              <ProfileForm profile={profile} setProfile={setProfile} />
            </div>
          </div>
        </section>

        {/*Education Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8 md:p-10 mb-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Education</h2>
          </div>
          <ProfileEducation />
        </section>

        {/* Experience Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8 md:p-10 mb-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Work Experience
            </h2>
          </div>
          <ExperienceSection />
        </section>

        {/* Skill Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8 md:p-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          </div>
          <SkillForm/>
        </section>
      </main>
    </div>
  );
}
