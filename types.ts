
export interface ReportData {
  tarikh: string;
  hari: string;
  namaGuru: string;
  perhimpunanGuruBesar: string;
  perhimpunanGuruBertugas: string;
  perhimpunanPengawas: string;
  bilanganHadir: number;
  kehadiranPeratus: string;
  namaMuridTidakHadir: string;
  kebersihanSkor: number;
  kebersihanKawasan: 'Bersih' | 'Memuaskan' | 'Perlu Tindakan';
  kebersihanKantin: string;
  kebersihanTandas: string;
  rmtMenu: string;
  disiplinStatus: 'Tiada Kes' | 'Ada Kes';
  disiplinPerihal: string;
  kokuStatus: 'Ada' | 'Tiada';
  pelawatStatus: 'Ada' | 'Tiada';
  pelawatCatatan: string;
  halLain: string;
}

export type SectionType = 
  | 'perhimpunanGuruBesar' 
  | 'perhimpunanGuruBertugas' 
  | 'perhimpunanPengawas'
  | 'namaMuridTidakHadir' 
  | 'kebersihanKantin' 
  | 'kebersihanTandas' 
  | 'rmtMenu'
  | 'disiplinPerihal' 
  | 'pelawatCatatan'
  | 'halLain';
