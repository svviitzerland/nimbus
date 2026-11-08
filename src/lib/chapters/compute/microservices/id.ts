import type { MicroservicesText } from '../types';

export const id: MicroservicesText = {
	title: 'Monolith atau microservices',
	intro: [
		'Aplikasimu dipakai banyak orang sekaligus, masing masing kirim permintaan. Di dalam, aplikasi ini bisa dibangun dengan dua cara. Kita lihat dua duanya, dan apa bedanya kalau ada yang rusak.',
		'Pertama <b>monolith</b>. Semua fitur, lihat barang, cari, dan bayar, jalan di <b>satu program yang sama</b>. Tiap permintaan user dilayani program itu. Selama sehat, semua lancar.',
		'Sekarang pembayaran error. Tapi karena semua fitur ada di satu program yang sama, begitu programnya crash, <b>semuanya ikut mati</b>. Lihat, semua permintaan user gagal, bukan cuma yang bayar.',
		'Bentuk satunya <b>microservices</b>. Tiap fitur dipecah jadi <b>program sendiri sendiri</b>, terpisah, sering di container masing masing, dan saling ngobrol lewat API.',
		'Pembayaran error lagi. Tapi karena dia program terpisah, <b>cuma permintaan bayar yang gagal</b>. Yang lihat barang dan cari tetap dilayani, soalnya programnya beda dan nggak ikut kena.',
		'Jadi monolith itu satu program, simpel buat mulai tapi sekali crash semua mati. Microservices itu banyak program terpisah, tahan banting karena yang rusak nggak nyeret yang lain, tapi lebih ribet ngurusnya. Bukan yang satu selalu lebih baik, pilih sesuai kebutuhan.',
		'[ingat] Layanan kecil punya tugas jelas. Mereka tetap harus berkomunikasi dan menangani kegagalan.'
	],
	reactions: {},
	userLabel: 'User',
	devLabel: 'Developer',
	monoLabel: 'Toko Nimbus',
	oneProgram: 'satu program',
	sepPrograms: 'program terpisah',
	downTag: 'mati',
	okTag: 'ok',
	failTag: 'gagal',
	requests: [
		{ label: 'Lihat', service: 'Toko' },
		{ label: 'Cari', service: 'Pencarian' },
		{ label: 'Bayar', service: 'Pembayaran' }
	],
	recapMono: 'Satu program. Simpel, tapi sekali crash semua permintaan mati.',
	recapMicro: 'Program terpisah. Satu mati, yang lain tetap jalan, tapi lebih ribet.'
};
