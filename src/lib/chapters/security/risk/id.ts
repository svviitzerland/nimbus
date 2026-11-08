import type { ExperimentText } from '../../types';
export const id: ExperimentText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope: 'Model lokal dengan data latihan. Tidak ada request ke jaringan sungguhan.',
	title: 'Aset, ancaman, celah, dan risiko',
	intro: [
		'Sebelum berburu celah, tentukan apa yang ingin dijaga. Itu <b>aset</b>. Di toko Nimbus, asetnya bisa berupa data pelanggan, akun admin, atau kemampuan menerima pesanan.',
		'<b>Ancaman</b> adalah sesuatu yang bisa merugikan aset. Orang mencoba mencuri data adalah contoh ancaman. <b>Kerentanan</b> adalah kelemahan yang bisa dimanfaatkan, misalnya server mengirim dokumen tanpa memeriksa izin.',
		'<b>Exploit</b> adalah cara memanfaatkan celah itu. <b>Dampak</b> adalah akibatnya. Dalam lab ini, permintaan tanpa izin bisa membuka tagihan pribadi. Coba kirim permintaan dan lihat apa yang keluar.',
		'<b>Risiko</b> mempertimbangkan kemungkinan kejadian dan besarnya dampak dalam konteksmu. Data publik dan tagihan pelanggan tidak punya konsekuensi kebocoran yang sama.',
		'Batasi akses publik, lalu coba lagi. Itu mengurangi jangkauan ancaman ini, tetapi celahnya belum diperbaiki. Aktifkan pemeriksaan izin lalu buka akses kembali untuk menguji perbaikannya.',
		'[ingat] <b>Aset dijaga, ancaman datang, celah dimanfaatkan, dampak dirasakan.</b> Risiko membantu memilih tindakan. Kita petakan jalurnya di [[threat modeling|security/threats]].'
	],
	reactions: {
		privateLeak:
			'Tagihan pribadi keluar tanpa izin. Kita sudah melihat dampaknya, bukan hanya nama celahnya.',
		publicLeak:
			'Data produk memang untuk umum. Permintaan yang sama tidak membocorkan rahasia yang sama, tetapi kelemahan pemeriksaan izin tetap perlu ditinjau.',
		limited:
			'Pengunjung luar tidak punya jalur masuk dalam model ini. Orang dari jaringan yang diizinkan masih perlu diperiksa izinnya.',
		blocked:
			'Server memeriksa izin dan menolak permintaan ini. Menambal penyebabnya berbeda dari menyembunyikan pintunya.'
	},
	goal: 'Pisahkan celah dari konteks risikonya',
	tasks: ['Lihat dampak kebocoran', 'Batasi jangkauan', 'Perbaiki pemeriksaan izin'],
	hint: 'Kirim permintaan. Matikan akses publik dan kirim lagi. Nyalakan akses publik serta pemeriksaan izin, lalu uji ulang.',
	labels: {
		probe: 'Kirim permintaan tanpa izin',
		exposed: 'Endpoint dapat dijangkau publik',
		sensitive: 'Simpan tagihan pribadi',
		patched: 'Periksa izin sebelum mengirim data',
		threat: 'Pengunjung tanpa izin',
		fixed: 'Izin diperiksa',
		vulnerable: 'Izin belum diperiksa',
		asset: 'Aset di server',
		private: 'Tagihan pelanggan',
		public: 'Katalog produk publik',
		waiting: 'Belum ada percobaan',
		privateLeak: '200 OK, tagihan pribadi terbaca',
		publicLeak: '200 OK, katalog publik terbaca',
		limited: 'Koneksi dari luar tidak mencapai endpoint',
		blocked: '403 Forbidden, data tidak dikirim'
	}
};
