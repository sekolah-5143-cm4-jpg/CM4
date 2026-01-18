
import React, { useState } from 'react';
import { ReportData, SectionType } from '../types';
import { refineReportSection } from '../services/geminiService';
import { Sparkles, Loader2, Info, Users, Star, ClipboardList, ShieldAlert, UserPlus, GraduationCap, UserCheck, Search } from 'lucide-react';

interface Props {
  data: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
}

const TOTAL_STUDENTS = 33;

const ReportForm: React.FC<Props> = ({ data, onUpdate }) => {
  const [loadingSection, setLoadingSection] = useState<SectionType | null>(null);
  const [assemblyTab, setAssemblyTab] = useState<'besar' | 'tugas' | 'pengawas'>('besar');

  const handleAISuggest = async (section: SectionType) => {
    const currentContent = data[section] as string;
    if (!currentContent) return alert('Sila masukkan nota ringkas dahulu.');
    setLoadingSection(section);
    try {
      const refined = await refineReportSection(section, currentContent);
      onUpdate({ [section]: refined });
    } finally {
      setLoadingSection(null);
    }
  };

  const SegmentedControl = <T extends string>({ options, value, onChange }: { options: T[], value: T, onChange: (v: T) => void }) => (
    <div className="flex p-1 bg-slate-100 rounded-xl">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${
            value === opt ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const InputWrapper: React.FC<{ label: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ label, children, icon }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      </div>
      {children}
    </div>
  );

  const TextAreaWithAI: React.FC<{ label?: string; section: SectionType; placeholder: string; rows?: number }> = ({ label, section, placeholder, rows = 3 }) => (
    <InputWrapper label={label || ""}>
      <div className="relative group">
        <textarea
          value={data[section] as string}
          onChange={(e) => onUpdate({ [section]: e.target.value })}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm leading-relaxed"
        />
        <button
          onClick={() => handleAISuggest(section)}
          disabled={loadingSection === section || !(data[section] as string)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 disabled:opacity-50"
        >
          {loadingSection === section ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Bantu Tulis
        </button>
      </div>
    </InputWrapper>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputWrapper label="Tarikh">
          <input type="date" value={data.tarikh} onChange={(e) => onUpdate({ tarikh: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
        </InputWrapper>
        <InputWrapper label="Hari">
          <select value={data.hari} onChange={(e) => onUpdate({ hari: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
            {['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'].map(d => <option key={d}>{d}</option>)}
          </select>
        </InputWrapper>
        <InputWrapper label="Guru Bertugas">
          <input type="text" placeholder="Nama Guru" value={data.namaGuru} onChange={(e) => onUpdate({ namaGuru: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200" />
        </InputWrapper>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 1. Perhimpunan (TABBED) */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
           <GraduationCap className="w-4 h-4 text-blue-600" /> 1. Pengurusan Perhimpunan
        </label>
        
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'besar', label: 'Ucapan Guru Besar', icon: <Search className="w-3 h-3" /> },
            { id: 'tugas', label: 'Ucapan Guru Bertugas', icon: <UserCheck className="w-3 h-3" /> },
            { id: 'pengawas', label: 'Nama Pengawas', icon: <Users className="w-3 h-3" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAssemblyTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                assemblyTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ').pop()}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          {assemblyTab === 'besar' && (
             <TextAreaWithAI section="perhimpunanGuruBesar" placeholder="Nota ucapan Guru Besar..." rows={5} />
          )}
          {assemblyTab === 'tugas' && (
             <TextAreaWithAI section="perhimpunanGuruBertugas" placeholder="Nota ucapan Guru Bertugas..." rows={5} />
          )}
          {assemblyTab === 'pengawas' && (
             <TextAreaWithAI section="perhimpunanPengawas" placeholder="Senarai nama pengawas bertugas..." rows={3} />
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 2. Kehadiran */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <InputWrapper label={`Kehadiran (${data.bilanganHadir}/${TOTAL_STUDENTS})`} icon={<Users className="w-4 h-4" />}>
            <input type="number" min="0" max={TOTAL_STUDENTS} value={data.bilanganHadir} onChange={(e) => onUpdate({ bilanganHadir: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-blue-600" />
          </InputWrapper>
        </div>
        <TextAreaWithAI label="Nama Murid Tidak Hadir" section="namaMuridTidakHadir" placeholder="Senarai nama..." rows={2} />
      </div>

      <div className="h-px bg-slate-100" />

      {/* 3. Kebersihan & RMT */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWrapper label="3. Skala Kebersihan & Keceriaan (1-5)" icon={<Star className="w-4 h-4" />}>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdate({ kebersihanSkor: num })}
                  className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                    data.kebersihanSkor === num ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </InputWrapper>
          <TextAreaWithAI label="Menu RMT Harian" section="rmtMenu" placeholder="Sila masukkan menu hari ini..." rows={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextAreaWithAI label="Laporan Kantin" section="kebersihanKantin" placeholder="Keadaan kantin..." rows={2} />
          <TextAreaWithAI label="Laporan Tandas" section="kebersihanTandas" placeholder="Keadaan tandas..." rows={2} />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 4. Disiplin */}
      <div className="space-y-4">
        <InputWrapper label="4. Disiplin & Keselamatan" icon={<ShieldAlert className="w-4 h-4" />}>
          <SegmentedControl 
            options={['Tiada Kes', 'Ada Kes']} 
            value={data.disiplinStatus} 
            onChange={(v) => onUpdate({ disiplinStatus: v as any })} 
          />
        </InputWrapper>
        {data.disiplinStatus === 'Ada Kes' && (
          <TextAreaWithAI label="Perihal Kes Disiplin" section="disiplinPerihal" placeholder="Nyatakan kes yang berlaku..." rows={3} />
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* 5. Kokurikulum */}
      <InputWrapper label="5. Pelaksanaan Kokurikulum" icon={<ClipboardList className="w-4 h-4" />}>
        <SegmentedControl 
          options={['Ada', 'Tiada']} 
          value={data.kokuStatus} 
          onChange={(v) => onUpdate({ kokuStatus: v as any })} 
        />
      </InputWrapper>

      <div className="h-px bg-slate-100" />

      {/* 6. Pelawat */}
      <div className="space-y-4">
        <InputWrapper label="6. Pelawat / Pegawai Luar" icon={<UserPlus className="w-4 h-4" />}>
          <SegmentedControl 
            options={['Ada', 'Tiada']} 
            value={data.pelawatStatus} 
            onChange={(v) => onUpdate({ pelawatStatus: v as any })} 
          />
        </InputWrapper>
        {data.pelawatStatus === 'Ada' && (
          <TextAreaWithAI label="Catatan Nama / Jawatan Pelawat" section="pelawatCatatan" placeholder="Nama Pelawat & Tujuan..." rows={2} />
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* 7. Hal Lain */}
      <TextAreaWithAI label="7. Hal-hal Lain" section="halLain" placeholder="Maklumat tambahan..." rows={3} />
    </div>
  );
};

export default ReportForm;
