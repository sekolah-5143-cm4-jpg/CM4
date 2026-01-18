import { GoogleGenAI } from "@google/genai";
import { SectionType } from "../types";

export const refineReportSection = async (section: SectionType, content: string): Promise<string> => {
  if (!content || content.trim().length < 2) return content;

  // Instantiate GoogleGenAI right before making an API call to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const sectionPrompts: Record<SectionType, string> = {
    perhimpunanGuruBesar: "Huraikan ucapan atau amanat yang disampaikan oleh Guru Besar semasa perhimpunan dengan nada formal and profesional.",
    perhimpunanGuruBertugas: "Huraikan ucapan atau laporan yang disampaikan oleh guru bertugas semasa perhimpunan.",
    perhimpunanPengawas: "Formatkan senarai nama pengawas yang bertugas semasa perhimpunan dengan kemas.",
    namaMuridTidakHadir: "Tuliskan senarai nama murid yang tidak hadir dalam format senarai yang kemas.",
    kebersihanKantin: "Tuliskan laporan ringkas tentang penyediaan makanan RMT dan kebersihan kantin secara formal.",
    kebersihanTandas: "Huraikan keadaan kebersihan tandas murid secara formal.",
    rmtMenu: "Tuliskan menu makanan RMT dengan cara yang menyelerakan dan formal (contoh: Nasi Lemak, Telur Rebus, Timun, Air Milo).",
    disiplinPerihal: "Huraikan isu disiplin yang berlaku with teliti dan profesional dalam Bahasa Melayu.",
    pelawatCatatan: "Formatkan nama pelawat dan tujuan lawatan mereka secara profesional.",
    halLain: "Tuliskan laporan tentang pengumuman atau pelawat secara formal."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tukarkan nota ringkas berikut menjadi ayat laporan sekolah yang formal dalam Bahasa Melayu. 
      Konteks: ${sectionPrompts[section]}
      Nota: ${content}
      Berikan teks laporan sahaja.`,
      config: { temperature: 0.7 }
    });
    // Extract the text content using the .text property from the response object.
    return response.text?.trim() || content;
  } catch (error) {
    console.error("Gemini API error:", error);
    return content;
  }
};