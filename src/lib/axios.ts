"use client";
import axios from "axios";

//  Buat instance axios agar bisa dipakai di semua file
const api = axios.create({
  baseURL: "https://api-cleveresu.liera.my.id/api/v1", // ganti sesuai URL backend tim kamu
  headers: {
    "Content-Type": "application/json",
  },
});

//  Interceptor optional — otomatis pasang token kalau ada di localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
