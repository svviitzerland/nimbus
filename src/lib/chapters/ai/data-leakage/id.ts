import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Data leakage',
	intro: [
		'Nilai ujian tinggi terasa menyenangkan. Tapi bagaimana kalau soal ujian sudah ada di buku latihan? Model pun bisa terlihat pintar hanya karena mengingat contoh yang sama.',
		'Di sini ada model hafalan sederhana. Ia mengingat ID A, B, dan C beserta labelnya. Untuk ID baru ia selalu menebak kucing. Jalankan evaluasi dan lihat contoh mana yang pernah ia lihat.',
		'A dan B muncul lagi dalam data ujian. Nilai 75 persen ikut menghitung hafalan itu. <b>Data leakage</b> terjadi ketika informasi yang seharusnya terpisah bocor ke proses belajar atau evaluasi.',
		'Buang duplikat dan ukur lagi. Kini tersisa dua contoh baru, satu benar dan satu salah. Angka 50 persen lebih jujur untuk dua contoh ini, tetapi sampelnya terlalu kecil untuk kesimpulan besar.',
		'[ingat] <b>Ujian harus membawa contoh baru.</b> Pisahkan data sebelum belajar. Jika banyak baris milik orang atau kejadian yang sama, pisahkan menurut kelompok atau waktu yang sesuai.'
	],
	reactions: {
		leak: '3 dari 4 benar, tetapi dua contoh sudah dihafal. Nilai ini belum menunjukkan kemampuan menghadapi contoh baru.',
		clean:
			'Sekarang 1 dari 2 benar. Modelnya tetap sama. Yang berubah adalah kualitas pengujiannya.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Bedakan hafalan dan kemampuan baru',
	tasks: ['Ukur dengan data bocor', 'Buang duplikat lalu ukur lagi'],
	hintLabel: 'Petunjuk',
	hint: 'Ukur tanpa membuang duplikat. Aktifkan kotaknya, lalu ukur lagi. Bandingkan contoh yang dihitung.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		run: 'Jalankan evaluasi',
		clean: 'Buang ID yang ada di latihan',
		train: 'Data latihan',
		test: 'Jawaban asli lalu prediksi',
		model: 'Model menghafal ID latihan. ID baru selalu ditebak kucing.',
		cat: 'Kucing',
		dog: 'Anjing',
		seen: 'Sudah dilihat',
		new: 'Contoh baru',
		waiting: 'Jalankan untuk melihat prediksi'
	}
};
