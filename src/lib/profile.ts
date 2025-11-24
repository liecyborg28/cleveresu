// src/lib/profile.ts
"use client";
import  api  from "./axios";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data?.data || res.data; // tergantung backend kamu
};
