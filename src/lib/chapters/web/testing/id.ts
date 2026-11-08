import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Pengujian aplikasi',
	intro: [
		'Aturan toko kita sederhana. Belanja <b>100 koin atau lebih</b> mendapat potongan 10. Tapi seorang pembeli yang pas membayar 100 tidak mendapat diskon.',
		'<b>Test</b> membandingkan hasil kode dengan hasil yang kita harapkan. Jalankan tiga contoh di meja ini. Ada belanja di bawah, tepat pada, dan di atas batas.',
		'Tanda <b>&gt;</b> artinya lebih besar, jadi 100 tidak ikut. Pilih perbandingan yang cocok dengan aturan, lalu jalankan lagi. Jangan mengubah hasil harapan hanya untuk membuat tes hijau.',
		'Ini contoh <b>unit test</b>, menguji satu fungsi kecil. Integration test memeriksa beberapa bagian bersama. Tes end to end mencoba alur pengguna, misalnya masuk toko sampai membayar.',
		'[ingat] <b>Uji bawah, pas, atas.</b> Nilai batas sering menyimpan bug. Tes yang lolos menambah bukti, tetapi tidak membuktikan semua kemungkinan sudah aman.'
	],
	reactions: {
		failed:
			'Lihat baris FAIL. Hasil aktual berbeda dari aturan toko. Ubah operatornya, bukan jawaban yang diharapkan.',
		passed:
			'Ketiga contoh cocok. Simpan kasus tepat 100 sebagai tes regresi agar bug ini ketahuan kalau muncul lagi.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Diskon tepat di batasnya',
	tasks: ['Temukan tes yang gagal', 'Perbaiki sampai semua lolos'],
	hintLabel: 'Petunjuk',
	hint: 'Jalankan dengan > dulu. Coba >= lalu jalankan lagi. Perhatikan kasus 100.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		rule: 'Belanja minimal 100 koin mendapat potongan 10 koin.',
		run: 'Jalankan tes',
		operator: 'Perbandingan dalam kode',
		results: 'Hasil pengujian',
		waiting: 'Jalankan tes untuk membandingkan hasil',
		expected: 'Diharapkan'
	}
};
