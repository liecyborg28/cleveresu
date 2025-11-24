"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function CertificateUpload() {
  const [certificates, setCertificates] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setCertificates([...certificates, ...files]);
  };

  return (
    <div className="mt-8 w-full">
      <h3 className="font-semibold text-gray-800 mb-2">Certificates</h3>
      <label className="border border-dashed border-gray-400 rounded-md py-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
        <UploadCloud className="w-6 h-6 mb-1" />
        <span>Upload Certificate</span>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
      <ul className="mt-3 space-y-1 text-sm text-gray-600">
        {certificates.map((file, idx) => (
          <li key={idx}> {file.name}</li>
        ))}
      </ul>
    </div>
  );
}
