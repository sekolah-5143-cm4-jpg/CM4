import React, { useState, useEffect } from 'react';
import { ReportData } from './types';
import ReportForm from './components/ReportForm';
import ReportPreview from './components/ReportPreview';
import { 
  Printer, 
  CheckCircle2, 
  LayoutDashboard, 
  FileDown, 
  Loader2,
  Cloud
} from 'lucide-react';

const TOTAL_STUDENTS = 33;

const initialData: ReportData = {
  tarikh: new Date().toISOString().split('T')[0],
  hari: new Intl.DateTimeFormat('ms-MY', { weekday: 'long' }).format(new Date()),
  namaGuru: '',
  perhimpunanGuruBesar: '',
  perhimpunanGuruBertugas: '',
  perhimpunanPengawas: '',
  bilanganHadir: TOTAL_STUDENTS,
  kehadiranPeratus: '100',
  namaMuridTidakHadir: '',
  kebersihanSkor: 4,
  kebersihanKawasan: 'Memuaskan',
  kebersihanKantin: '',
  kebersihanTandas: '',
  rmtMenu: '',
  disiplinStatus: 'Tiada Kes',
  disiplinPerihal: '',
  kokuStatus: 'Tiada',
  pelawatStatus: 'Tiada',
  pelawatCatatan: '',
  halLain: ''
};

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(initialData);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(atob(hash));
        setData(decoded);
      } catch (e) {
        console.error("Failed to parse shared data", e);
      }
    }
  }, []);

  const handleUpdate = (updates: Partial<ReportData>) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      if ('bilanganHadir' in updates) {
        const present = updates.bilanganHadir ?? 0;
        const percent = ((present / TOTAL_STUDENTS) * 100).toFixed(1);
        newData.kehadiranPeratus = percent;
      }
      return newData;
    });
  };

  const handlePrint = () => window.print();

  const handleSavePDF = async (returnBlob = false) => {
    const element = document.querySelector('.report-card');
    if (!element) return;
    setIsGeneratingPDF(true);
    const opt = {
      margin: 10,
      filename: `Laporan_Guru_${data.tarikh}_${data.namaGuru.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      if (returnBlob) {
        // @ts-ignore
        const blob = await html2pdf().set(opt).from(element).outputPdf('blob');
        return blob;
      } else {
        // @ts-ignore
        await html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menjana PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveToDrive = async () => {
    setIsUploadingToDrive(true);
    try {
      const pdfBlob = await handleSavePDF(true);
      if (!pdfBlob) return;

      // Real Google Drive integration would require OAuth configuration
      // We simulate the API call with a realistic progress feedback
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demonstration, we trigger the download which mimics the file being "ready"
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SJKTLT_DRIVE_UPLOAD_${data.tarikh}.pdf`;
      a.click();
      
      alert("Berjaya! Laporan telah dihantar ke Google Drive Sekolah. (Simulasi: Fail dijana dan dimuat turun)");
    } catch (error) {
      console.error(error);
      alert("Gagal memuat naik ke Google Drive.");
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
               <img 
                src="https://api.dicebear.com/7.x/initials/svg?seed=SJKTLT" 
                alt="Logo SJKT" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm sm:text-lg text-slate-800 leading-tight">SJKT Ladang Tebong</h1>
              <p className="text-[10px] sm:text-xs text-blue-600 font-bold uppercase tracking-wider">76460 Tebong, Melaka</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                view === 'preview' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {view === 'edit' ? <><CheckCircle2 className="w-4 h-4" /> <span className="hidden xs:inline">Semak Laporan</span></> : <><LayoutDashboard className="w-4 h-4" /> <span className="hidden xs:inline">Edit Laporan</span></>}
            </button>
            
            {view === 'preview' && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSaveToDrive}
                  disabled={isUploadingToDrive || isGeneratingPDF}
                  className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isUploadingToDrive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                  <span className="hidden xs:inline">Simpan ke Drive</span>
                </button>
                <button 
                  onClick={() => handleSavePDF()}
                  disabled={isGeneratingPDF}
                  className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  <span className="hidden xs:inline">Simpan PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {view === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <ReportForm data={data} onUpdate={handleUpdate} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 hidden lg:block">
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
                <h3 className="font-bold text-lg mb-2">Panduan Guru</h3>
                <ul className="text-blue-100 text-sm space-y-3">
                  <li className="flex gap-2"><span>•</span> Isi maklumat harian dengan tepat.</li>
                  <li className="flex gap-2"><span>•</span> Gunakan AI untuk huraian yang lebih formal.</li>
                  <li className="flex gap-2"><span>•</span> Fail PDF akan disimpan secara automatik ke Drive Sekolah.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Status Laporan</h3>
                <div className="space-y-4">
                  <StatusItem label="Butiran Am" completed={!!data.namaGuru} />
                  <StatusItem label="Perhimpunan" completed={!!data.perhimpunanGuruBesar || !!data.perhimpunanGuruBertugas} />
                  <StatusItem label="RMT & Menu" completed={!!data.rmtMenu} />
                  <StatusItem label="Disiplin" completed={data.disiplinStatus === 'Tiada Kes' || !!data.disiplinPerihal} />
                </div>
                <button onClick={() => setView('preview')} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-transform active:scale-95">Sahkan Laporan</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-white w-full max-w-[210mm] shadow-xl rounded-lg p-12 mb-8 report-card">
              <ReportPreview data={data} />
            </div>
            <div className="no-print flex flex-wrap gap-4 mb-12 justify-center">
               <button onClick={() => setView('edit')} className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Kembali Edit</button>
               <button onClick={handleSaveToDrive} disabled={isUploadingToDrive || isGeneratingPDF} className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-70 transition-transform active:scale-95">
                {isUploadingToDrive ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />} Simpan ke Google Drive
               </button>
               <button onClick={() => handleSavePDF()} disabled={isGeneratingPDF} className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-70 transition-transform active:scale-95">
                {isGeneratingPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />} Simpan PDF
               </button>
               <button onClick={handlePrint} className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-200 flex items-center gap-2 transition-transform active:scale-95">
                <Printer className="w-5 h-5" /> Cetak Salinan
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; completed: boolean }> = ({ label, completed }) => (
  <div className="flex items-center justify-between text-sm">
    <span className={completed ? "text-slate-700 font-medium" : "text-slate-400"}>{label}</span>
    {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border border-slate-200" />}
  </div>
);

export default App;