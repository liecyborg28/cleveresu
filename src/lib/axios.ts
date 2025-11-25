"use client";
import axios from "axios";

//  Buat instance axios agar bisa dipakai di semua file
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
 // ganti sesuai URL backend tim kamu
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
