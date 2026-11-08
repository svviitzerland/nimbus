import type { ServerlessText } from '../types';

export const id: ServerlessText = {
	title: 'Serverless',
	intro: [
		'Kadang kamu cuma butuh sepotong kode yang jalan sesekali, kirim email OTP, resize foto, terima webhook pembayaran. Kalau pakai server biasa, dia menyala 24 jam dan meterannya jalan terus, padahal kerjanya cuma sesekali.',
		'Dengan <b>serverless</b>, penyedia mengelola server dan lingkungan eksekusi. Pada contoh fungsi ini, sebuah request memicu kode untuk berjalan. Kapasitas dapat bertambah mengikuti permintaan.',
		'Fungsi berjalan dalam lingkungan terisolasi. Penyedia dapat memakai VM ringan atau teknologi sandbox lain, dan dapat memakai ulang lingkungan yang masih siap. Menyiapkan lingkungan baru membutuhkan waktu, disebut <b>cold start</b>.',
		'HP penggunanya sudah menunggu di samping alur tadi. Kirim sebuah permintaan dan amati fungsinya bangun, kerja, lalu tidur lagi. Ini baru kulit luarnya saja, nanti ada bab sendiri yang menyelam jauh lebih dalam ke dunia serverless.',
		'[ingat] Serverless mengurangi pekerjaan mengelola server. Servernya tetap ada di belakang layanan.'
	],
	reactions: {
		invoked:
			'Request memicu fungsi, lalu hasil dikirim ke pengguna. Biaya layanan fungsi biasanya mempertimbangkan jumlah request, waktu eksekusi, dan sumber daya yang digunakan.',
		zero: 'Tidak ada fungsi yang sedang berjalan dalam contoh ini. Tagihan nyata bergantung pada layanan dan konfigurasi, termasuk kapasitas yang dicadangkan, penyimpanan, serta transfer data.'
	},
	fnLabel: 'fungsi kirimOTP',
	sleepTag: 'tidur, nol biaya',
	wakeTag: 'bangun',
	runTag: 'kerja',
	send: 'Panggil fungsinya',
	callsLabel: 'Terpanggil {n}×, bayar per panggilan',
	userLabel: 'HP pengguna',
	reqTag: 'permintaan',
	resTag: 'OTP terkirim',
	alwaysName: 'Server biasa',
	alwaysTag: 'menagih 24 jam, kerja sesekali',
	archSteps: [
		'Permintaan datang',
		'Gerbang penyedia',
		'Sandbox menyala',
		'Fungsimu jalan',
		'Langsung dimatikan'
	],
	behindItems: ['Firecracker, micro VM punya AWS', 'gVisor, sandbox punya Google'],
	noteIdle: 'Fungsinya tidur, tidak menagih sepeser pun',
	noteRun: 'Bangun sekejap, kerja, lalu pamit',
	noteZero: 'Balik tidur ke nol lagi'
};
