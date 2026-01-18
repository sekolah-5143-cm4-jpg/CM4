import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
}

const TOTAL_STUDENTS = 33;

const ReportPreview: React.FC<Props> = ({ data }) => {
  const cleanlinessLabels = ['Sangat Lemah', 'Lemah', 'Memuaskan', 'Baik', 'Sangat Cemerlang'];

  return (
    <div className="max-w-[190mm] mx-auto text-black leading-relaxed text-sm">
      {/* Official Letterhead Header */}
      <div className="flex items-center justify-between mb-6 border-b-4 border-double border-black pb-6 gap-6">
        <div className="w-28 h-28 flex-shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/initials/svg?seed=SJKTLT" 
            alt="Logo SJKT Ladang Tebong" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold uppercase tracking-tighter leading-none mb-1">SJK (TAMIL) LADANG TEBONG</h1>
          <p className="text-[11px] font-bold">தோட்டத் தமிழ்ப்பள்ளி, மேலக்கா</p>
          <p className="text-[10px] uppercase font-medium mt-1">76460 TEBONG, MELAKA</p>
          <p className="text-[10px] font-medium uppercase mt-0.5">KOD SEKOLAH: MBD0070 | NO. TEL: 05-4914191</p>
          <div className="mt-4 inline-block px-8 py-1 border-2 border-black font-bold text-lg uppercase tracking-widest bg-slate-50">
            LAPORAN HARIAN GURU BERTUGAS
          </div>
        </div>
        <div className="w-28 h-28 opacity-0">
          {/* Empty spacer to center the text content */}
        </div>
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-3 border border-black mb-6 bg-slate-50 text-[11px]">
        <div className="p-2 border-r border-black">
          <span className="font-bold block uppercase text-[9px] text-slate-500">Tarikh</span>
          <p className="font-bold text-sm">
            {data.tarikh ? new Date(data.tarikh).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
          </p>
        </div>
        <div className="p-2 border-r border-black">
          <span className="font-bold block uppercase text-[9px] text-slate-500">Hari</span>
          <p className="font-bold text-sm">{data.hari}</p>
        </div>
        <div className="p-2">
          <span className="font-bold block uppercase text-[9px] text-slate-500">Guru Bertugas</span>
          <p className="font-bold text-sm">{data.namaGuru || '-'}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: PERHIMPUNAN */}
        <section>
          <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2">
            <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded">1</span>
            PENGURUSAN PERHIMPUNAN
          </h3>
          <div className="pl-7 space-y-3">
            {data.perhimpunanGuruBesar && (
              <div>
                <span className="font-bold text-[10px] uppercase block text-slate-500 underline mb-1">Ucapan Guru Besar:</span>
                <p className="text-justify leading-relaxed">{data.perhimpunanGuruBesar}</p>
              </div>
            )}
            {data.perhimpunanGuruBertugas && (
              <div>
                <span className="font-bold text-[10px] uppercase block text-slate-500 underline mb-1">Ucapan Guru Bertugas:</span>
                <p className="text-justify leading-relaxed">{data.perhimpunanGuruBertugas}</p>
              </div>
            )}
            {data.perhimpunanPengawas && (
              <div className="bg-slate-50 p-3 border-l-4 border-black rounded-r">
                <span className="font-bold text-[10px] uppercase block text-slate-500 mb-1">Nama Pengawas Bertugas:</span>
                <p className="font-medium">{data.perhimpunanPengawas}</p>
              </div>
            )}
            {!data.perhimpunanGuruBesar && !data.perhimpunanGuruBertugas && !data.perhimpunanPengawas && (
              <p className="italic text-slate-400">Tiada laporan perhimpunan direkodkan.</p>
            )}
          </div>
        </section>

        {/* SECTION 2: KEHADIRAN */}
        <section>
          <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2">
            <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded">2</span>
            KEHADIRAN MURID
          </h3>
          <div className="pl-7 space-y-2">
            <div className="flex gap-4 items-center">
              <span className="font-bold min-w-[120px]">Status Kehadiran:</span> 
              <span className="bg-slate-100 px-3 py-1 rounded font-bold border border-slate-200">
                {data.bilanganHadir} / {TOTAL_STUDENTS} Murid ({data.kehadiranPeratus}%)
              </span>
            </div>
            {data.namaMuridTidakHadir && (
              <div className="bg-slate-50 p-2 border border-slate-200 rounded mt-1 text-xs">
                <span className="font-bold block mb-1 uppercase text-[9px] text-slate-500">Senarai Murid Tidak Hadir:</span>
                <p className="italic">{data.namaMuridTidakHadir}</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: KEBERSIHAN */}
        <section>
          <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2">
            <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded">3</span>
            KEBERSIHAN, KECERIAAN & RMT
          </h3>
          <div className="pl-7 space-y-3">
            <div className="flex items-center gap-4">
              <span className="font-bold min-w-[120px]">Skala Kebersihan:</span>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-6 h-6 border flex items-center justify-center rounded text-[10px] font-bold ${i <= data.kebersihanSkor ? 'bg-black text-white' : 'bg-white text-slate-300 border-slate-200'}`}>
                    {i}
                  </div>
                ))}
                <span className="ml-3 text-xs font-bold uppercase text-slate-600">({cleanlinessLabels[data.kebersihanSkor - 1]})</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-black p-3 bg-amber-50 rounded">
                <span className="font-bold block text-[10px] uppercase underline mb-2">Menu RMT Harian:</span>
                <p className="italic font-medium leading-tight">{data.rmtMenu || 'Tiada menu direkodkan.'}</p>
              </div>
              <div className="space-y-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                <p><strong>Status Kawasan:</strong> <span className="uppercase font-bold">{data.kebersihanKawasan}</span></p>
                <p><strong>Laporan Kantin:</strong> {data.kebersihanKantin || '-'}</p>
                <p><strong>Laporan Tandas:</strong> {data.kebersihanTandas || '-'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: DISIPLIN */}
        <section>
          <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2">
            <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] rounded">4</span>
            DISIPLIN & KESELAMATAN
          </h3>
          <div className="pl-7">
            <p className="mb-2"><strong>Status Disiplin:</strong> <span className={data.disiplinStatus === 'Ada Kes' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{data.disiplinStatus}</span></p>
            {data.disiplinStatus === 'Ada Kes' && (
              <div className="bg-red-50 p-3 border border-red-200 rounded text-red-900 leading-relaxed italic">
                {data.disiplinPerihal}
              </div>
            )}
            {data.disiplinStatus === 'Tiada Kes' && <p className="italic text-slate-500">Semua dalam keadaan terkawal dan tiada sebarang isu disiplin dilaporkan.</p>}
          </div>
        </section>

        {/* GRID FOR KOKU & VISITORS */}
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2 text-xs">
              <span className="bg-black text-white w-4 h-4 flex items-center justify-center text-[9px] rounded">5</span>
              KOKURIKULUM
            </h3>
            <div className="pl-6">
              <span className="font-bold">Pelaksanaan:</span> {data.kokuStatus}
            </div>
          </section>

          <section>
            <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2 text-xs">
              <span className="bg-black text-white w-4 h-4 flex items-center justify-center text-[9px] rounded">6</span>
              PELAWAT / PEGAWAI
            </h3>
            <div className="pl-6">
              <p><strong>Status:</strong> {data.pelawatStatus}</p>
              {data.pelawatStatus === 'Ada' && (
                <div className="mt-2 text-[11px] italic p-2 border-l-2 border-slate-300 bg-slate-50">
                  {data.pelawatCatatan}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SECTION 7: OTHERS */}
        <section>
          <h3 className="font-bold uppercase border-b border-black mb-2 flex items-center gap-2 text-xs">
            <span className="bg-black text-white w-4 h-4 flex items-center justify-center text-[9px] rounded">7</span>
            HAL-HAL LAIN / PENGUMUMAN
          </h3>
          <p className="pl-6 italic text-slate-700">{data.halLain || '-'}</p>
        </section>
      </div>

      {/* Signatures Section */}
      <div className="mt-24 flex justify-between px-10">
        <div className="text-center w-56">
          <p className="font-bold mb-20 underline">Disediakan oleh:</p>
          <div className="border-b border-black mb-1"></div>
          <p className="font-bold uppercase text-[11px] leading-tight">{data.namaGuru || '.........................'}</p>
          <p className="text-[10px]">Guru Bertugas Mingguan</p>
        </div>
        <div className="text-center w-56">
          <p className="font-bold mb-20 underline">Disahkan oleh:</p>
          <div className="border-b border-black mb-1"></div>
          <p className="font-bold uppercase text-[11px] leading-tight">GURU BESAR / GPK</p>
          <p className="text-[10px]">SJKT Ladang Tebong</p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 pt-4 border-t border-slate-100 text-[8px] text-slate-300 text-center uppercase tracking-widest no-print">
        DIJANA MELALUI SISTEM E-LAPORAN GURU BERTUGAS SJKTLT | {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default ReportPreview;