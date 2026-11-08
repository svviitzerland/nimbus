import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Burp Suite',
	intro: [
		'Browser biasanya mengirim [[HTTP|web/http]] tanpa memperlihatkan pesannya. <b>Burp Suite</b> membantu penguji keamanan melihat dan menguji pesan itu pada aplikasi yang diizinkan.',
		'Di Burp asli, buka <b>Proxy</b>, lalu <b>Open browser</b>. Browser bawaan sudah diarahkan melewati Burp. Untuk HTTPS, browser pengujian perlu mempercayai sertifikat proxy agar pesan dapat diperiksa.',
		'Aktifkan <b>Intercept</b> lalu buka produk. Request berhenti di meja periksa. Browser menunggu karena server belum menerima pertanyaannya.',
		'<b>Forward</b> meneruskan request. <b>Repeater</b> menyimpan salinannya supaya kamu bisa mengubah satu bagian dan mengirim ulang. Coba ganti /products/1 menjadi /products/2.',
		'Bandingkan nama produk dan harga di response. Path yang berubah meminta barang berbeda. Dalam pengujian sungguhan, catat request, response, dan kondisi yang membuat hasil berubah.',
		'[ingat] <b>Proxy melihat perjalanan, Repeater mengulang percobaan.</b> Ubah satu hal agar penyebabnya jelas.'
	],
	reactions: {
		captured:
			'Request tertahan di Proxy. Ini pesan asli dalam model kita, sebelum server membacanya.',
		forwarded:
			'Request sampai. Server mengirim produk nomor 1. Sekarang kirim salinannya ke Repeater.',
		changed:
			'Produk dan harga berubah setelah path diganti. Kamu membandingkan dua percobaan dengan satu perubahan.',
		same: 'Request ini masih meminta produk yang sama. Ganti angka terakhir pada path menjadi 2 untuk membandingkan.',
		invalid:
			'Baca status dan isi balasannya. Model ini menerima GET untuk /products/1 atau /products/2 dengan Host nimbus.com.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Ikuti satu request sampai jawabannya',
	tasks: ['Tangkap request', 'Teruskan ke server', 'Ubah lalu kirim ulang'],
	hintLabel: 'Petunjuk',
	hint: 'Buka produk, Forward, lalu kirim ke Repeater. Edit path saja dan tekan Send.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		open: 'Buka produk di browser',
		intercept: 'Intercept aktif',
		tool: 'Alat Burp',
		forwarded: 'Request sudah diteruskan',
		held: 'Request tertahan, browser menunggu',
		empty: 'Buka produk untuk menangkap request',
		forward: 'Forward',
		repeat: 'Kirim ke Repeater',
		request: 'Request yang bisa kamu edit',
		edit: 'Ganti /products/1 menjadi /products/2, lalu kirim.',
		send: 'Send',
		response: 'Response server',
		waiting: 'Belum ada response'
	}
};
