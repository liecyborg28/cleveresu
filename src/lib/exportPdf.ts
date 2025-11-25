export async function exportCvToPdf(
  filename = "Cleveresu_CV.pdf",
  iframeSelector = "iframe"
) {
  // ---  Cegah error saat SSR ---
  if (typeof window === "undefined") return;

  // ---  Dynamic import agar tidak dijalankan saat SSR ---
  const { default: rasterizeHTML } = await import("rasterizehtml");
  const { default: jsPDF } = await import("jspdf");

  const iframe = document.querySelector(
    iframeSelector
  ) as HTMLIFrameElement | null;

  if (!iframe) throw new Error("Iframe not found");

  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) throw new Error("Iframe document not accessible");

  const htmlContent = iframeDoc.documentElement.outerHTML;

  const canvas = document.createElement("canvas");
  canvas.width = 794; // A4 width @ 96 dpi
  canvas.height = 1123; // A4 height @ 96 dpi

  await rasterizeHTML.drawHTML(htmlContent, canvas, {});
  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [794, 1123],
  });

  pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
  pdf.save(filename);
}
