"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };

  // Variants animasi agar reusable
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-green-50 to-white">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl font-bold text-gray-900 leading-tight"
        >
          Buat <span className="text-green-600">CV Profesional</span>
          <br /> dalam hitungan menit
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="mt-6 text-lg text-gray-600 max-w-2xl"
        >
          CleveResu membantu kamu membuat CV otomatis yang rapi, modern, dan ATS-friendly.  
          Tinggal isi data → CV siap dipakai untuk apply kerja.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="mt-8 flex gap-4"
        >
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all flex items-center gap-2"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all">
            Lihat Demo
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 text-center">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900"
        >
          Kenapa pilih CleveResu?
        </motion.h2>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-gray-600"
        >
          Fitur-fitur yang memudahkan kamu bikin CV profesional:
        </motion.p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Template Modern",
              desc: "Pilih dari berbagai template CV ATS-friendly yang siap pakai.",
            },
            {
              title: "Mudah & Cepat",
              desc: "Isi data sekali, CV langsung dibuat otomatis tanpa ribet.",
            },
            {
              title: "Download Instan",
              desc: "CV bisa langsung di-download dalam format PDF berkualitas tinggi.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-green-600">{feature.title}</h3>
              <p className="mt-3 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-green-600 text-white text-center py-16"
      >
        <h2 className="text-3xl font-bold">Siap bikin CV yang standout?</h2>
        <p className="mt-4 text-lg">
          Gabung bersama ribuan pencari kerja yang sudah memakai CleveResu
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="mt-6 px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
        >
          Mulai Gratis
        </motion.button>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} CleveResu. All rights reserved.
      </footer>
    </main>
  );
}
