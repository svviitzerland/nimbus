import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'Mencari bug dengan DevTools',
	intro: [
		'Halaman toko terbuka, tapi produknya kosong. Jangan langsung menebak. <b>DevTools</b> adalah alat bawaan browser untuk melihat halaman, kode, dan lalu lintasnya.',
		'Di browser desktop, buka menu developer tools. Tab <b>Network</b> mencatat request. Muat ulang halaman saat tab itu terbuka agar perjalanan datanya tercatat.',
		'Tekan muat ulang di lab ini, lalu buka baris request. Status <b>404</b> berarti alamat yang diminta tidak ditemukan. Bandingkan path yang dikirim dengan nama route yang seharusnya.',
		'Ternyata tertulis <b>prodcut</b>, bukan <b>products</b>. Perbaiki path pada kode sumber lalu muat ulang. Response 200 dan produk yang muncul menjadi bukti perbaikannya.',
		'[ingat] <b>Ulangi, amati, ubah, uji lagi.</b> Console membantu membaca pesan error. Network membantu melihat apa yang dikirim dan diterima.'
	],
	reactions: {
		failed:
			'Masalahnya berhasil diulang. Buka request 404 di Network untuk melihat alamat yang benar benar diminta.',
		inspected:
			'Sekarang ada bukti. Path dari browser harus cocok dengan route server, termasuk ejaannya.',
		fixed: 'Produk muncul dan request mendapat 200. Perubahan kecil, tapi hasilnya bisa dibuktikan.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Temukan kenapa produk tidak muncul',
	tasks: ['Munculkan masalah', 'Baca request yang gagal', 'Perbaiki dan uji lagi'],
	hintLabel: 'Petunjuk',
	hint: 'Muat ulang, buka baris 404, lalu pilih /api/products pada kode sumber. Muat ulang sekali lagi.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		reload: 'Muat ulang toko',
		browser: 'Browser kamu',
		shop: 'Toko Nimbus',
		product: 'Buku catatan Nimbus, 25 koin',
		empty: 'Produk belum muncul',
		source: 'Path dalam kode sumber',
		inspect: 'Ketuk baris request untuk melihat detailnya',
		waiting: 'Belum ada request yang dicatat'
	}
};
