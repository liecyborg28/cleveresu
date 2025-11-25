"use client";

import { useCvData } from "@/redux/hooks";
import { useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportCvToPdf } from "@/lib/exportPdf";

export default function LivePreview() {
  const { profile, experiences, educations, skills } = useCvData();
  const [exporting, setExporting] = useState(false);

  const htmlString = useMemo(() => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          background: white;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
        }
        #cv-content {
          width: 794px; /* A4 width @96 dpi */
          height: 1123px; /* A4 height @96 dpi */
          padding: 40px 50px;
          box-sizing: border-box;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          margin-top: 16px;
          margin-bottom: 6px;
          font-size: 13px;
        }
        .entry { margin-top: 6px; }
        .entry span, .entry p { font-size: 11px; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div id="cv-content" class="text-gray-800 leading-relaxed">
        <div class="text-center mb-4">
          <h1 class="text-[20px] font-bold">${profile.full_name || ""}</h1>
          <p class="text-[11px] text-gray-600">${profile.address || ""} | ${profile.email || ""}</p>
          <p class="text-[11px] mt-1">${profile.desc || ""}</p>
        </div>

        <div class="mt-4">
          <h2 class="section-title">Experience</h2>
          ${experiences.map(e=>`
            <div class="entry">
              <span class="font-semibold">${e.position}</span>
              <span> | ${e.place}</span><br/>
              <span class="text-gray-500">${e.start_at?.split("T")[0]} – ${e.end_at?.split("T")[0]}</span>
              <p>${e.desc || ""}</p>
            </div>`).join("")}
        </div>

        <div class="mt-4">
          <h2 class="section-title">Education</h2>
          ${educations.map(e=>`
            <div class="entry">
              <span class="font-semibold">${e.place}</span>
              <span> (${e.start_at?.split("T")[0]} – ${e.end_at?.split("T")[0]})</span>
              <p>${e.desc || ""}</p>
            </div>`).join("")}
        </div>

        <div class="mt-4">
          <h2 class="section-title">Skills</h2>
          <ul class="grid grid-cols-2 list-disc pl-5">
            ${skills.map(s=>`<li>${s.name}</li>`).join("")}
          </ul>
        </div>
      </div>
    </body>
    </html>`;
  }, [profile, experiences, educations, skills]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportCvToPdf(`${profile.full_name || "Cleveresu_CV"}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-200 min-h-screen py-10 relative">
      <div className="shadow-xl border bg-white rounded-md overflow-hidden">
        <iframe
          srcDoc={htmlString}
          className="w-[794px] h-[1123px]"
          title="cv-preview"
        />
      </div>

      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className={`mt-8 flex items-center gap-2 px-6 py-3 rounded-lg shadow-md font-semibold transition-all ${
          exporting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {exporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Exporting...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Export PDF
          </>
        )}
      </button>

      {exporting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-3" />
          <p className="text-white font-medium text-sm">Generating PDF...</p>
        </div>
      )}
    </div>
  );
}
