import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Kontrol akses dan IDOR',
	intro: [
		'Nim sudah login ke nimbus.com. Server tahu siapa dia. Itu <b>authentication</b>. Tapi apakah Nim boleh membaca semua tagihan di situs? Belum tentu.',
		'<b>Authorization</b> memeriksa izin untuk tindakan dan data tertentu. Tagihan 101 milik Nim, tagihan 102 milik Ari. Coba keduanya sebelum pemeriksaan pemilik dipasang.',
		'Mengganti nomor dalam request seharusnya tidak membuka data orang lain. Jika berhasil, salah satu kemungkinan bugnya adalah <b>IDOR</b>, akses objek tanpa pemeriksaan izin yang cukup.',
		'Pasang pemeriksaan di <b>server</b>. Bandingkan pemilik tagihan dengan pengguna dari session yang sudah diverifikasi. Menyembunyikan tombol di browser saja tidak cukup.',
		'[ingat] <b>Login menjawab siapa, izin menjawab boleh apa.</b> Uji lagi tagihan Ari, lalu pastikan tagihan Nim tetap bisa dibuka.'
	],
	reactions: {
		own: 'Tagihan 101 milik Nim. Request ini memang seharusnya mendapat 200.',
		leaked:
			'Tagihan Ari terlihat dari session Nim. Bugnya ada di pemeriksaan izin, bukan pada nomor tagihan yang mudah ditebak.',
		blocked:
			'403. Server mengenali Nim, tetapi menolak akses ke tagihan Ari. Ganti ke 101 untuk memastikan akses yang sah tetap berjalan.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Jaga tagihan Ari tetap milik Ari',
	tasks: ['Buka tagihan sendiri', 'Uji tagihan akun lain', 'Pasang pemeriksaan pemilik'],
	hintLabel: 'Petunjuk',
	hint: 'Minta 101 lalu 102. Aktifkan pemeriksaan pemilik dan minta 102 lagi. Terakhir, cek 101 tetap mendapat 200.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		invoice: 'Nomor tagihan',
		send: 'Minta tagihan',
		session:
			'Session terverifikasi sebagai Nim. Mengubah nomor tagihan tidak mengubah identitas ini.',
		guard: 'Periksa pemilik di server',
		request: 'Request browser',
		response: 'Response server',
		waiting: 'Kirim request untuk melihat hasil'
	}
};
