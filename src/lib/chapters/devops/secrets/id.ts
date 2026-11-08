import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Rahasia aplikasi dan rotasi kunci',
	intro: [
		'Sebuah API key memberi aplikasi izin memakai layanan. Jika kunci rahasia dimasukkan ke JavaScript browser, pengunjung bisa membacanya dari file yang diunduh. Coba periksa kode browser.',
		'Untuk layanan dengan kunci rahasia, browser memanggil backend kita. Backend membaca kunci dari environment atau secret manager, lalu memanggil layanan. Kunci tidak ikut dikirim ke browser.',
		'Pindahkan kunci ke server. Sekarang coba salinan lama yang sudah terlanjur bocor. Masih bisa dipakai! Memindahkan kode tidak mencabut kunci.',
		'<b>Rotasi</b> membuat kunci baru, memperbarui aplikasi, lalu mencabut kunci lama. Tombol lab merangkum proses ini. Setelahnya, salinan lama harus ditolak dan aplikasi tetap mendapat 200.',
		'[ingat] <b>Pindahkan tempatnya, ganti kuncinya.</b> Di aplikasi nyata, batasi izin kunci dan akses endpoint backend juga.'
	],
	reactions: {
		exposed:
			'Kunci terlihat di browser.js. Nama variabel yang aneh atau kode yang dipadatkan tidak membuatnya rahasia.',
		moved:
			'Periksa kode browser lagi. Backend seharusnya memegang kunci, browser hanya meminta hasilnya.',
		stillValid: 'Salinan lama masih mendapat 200. Kunci yang bocor tetap aktif sampai dicabut.',
		rotated:
			'Kunci baru dipasang untuk server dan kunci lama dicabut. Uji kedua jalur untuk memeriksanya.',
		revoked:
			'401. Salinan lama sudah tidak diterima. Sekarang pastikan aplikasi sah masih dapat bekerja.',
		works:
			'Aplikasi sah mendapat 200. Bandingkan dengan salinan kunci lama untuk memastikan perbaikannya lengkap.',
		broken:
			'Browser masih memakai kunci lama yang sudah dicabut. Pindahkan panggilan ke backend yang memegang kunci baru.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Tutup kebocoran tanpa mematikan aplikasi',
	tasks: [
		'Temukan kunci di browser',
		'Pindahkan ke server',
		'Cabut kunci lama',
		'Uji aplikasi tetap jalan'
	],
	hintLabel: 'Petunjuk',
	hint: 'Periksa kode, pindahkan kunci, coba salinan lama, lalu rotasi. Uji salinan lama dan aplikasi sekali lagi.',
	scope:
		'NIM_DEMO_V1 dan NIM_DEMO_V2 adalah kunci palsu untuk simulasi. Tidak ada layanan eksternal yang dipanggil.',
	labels: {
		inspect: 'Periksa kode browser',
		move: 'Simpan rahasia di server',
		rotate: 'Rotasi dan cabut kunci lama',
		hidden: 'Buka kode untuk melihat isinya',
		noServer: 'Layanan dipanggil langsung oleh browser',
		stolen: 'Coba salinan kunci lama',
		visit: 'Jalankan aplikasi',
		waiting: 'Belum ada panggilan'
	}
};
