import type { WhyFrameworkText } from './types';

export const id: WhyFrameworkText = {
	title: 'Apa itu framework',
	intro: [
		'nimbus.com awalnya kecil, cuma satu halaman depan yang ditulis manual pakai [[HTML|web/html]]. Lalu dia tumbuh. Ada halaman toko, halaman mug, keranjang, checkout, dan struk. Masing masing file sendiri, dan semuanya menampilkan harga mug.',
		'Sekarang mug Nim lagi diskon, dari 12 turun jadi 9. Harus ada yang membuka tiap file, mencari harganya, lalu mengubahnya satu per satu. Enam halaman sih oke, enam ratus halaman ya tepar.',
		'Dan manusia bisa capek. Lupa satu aja, keranjang bilang 12 sementara checkout bilang 9. Pembelinya bingung, dan kamu punya <b>bug</b>, kesalahan di dalam program.',
		'<b>Framework</b> itu struktur siap pakai buat membangun aplikasi, biar kamu nggak mengulang ulang hal yang sama. Harganya disimpan di <b>satu tempat</b>, tiap halaman membacanya dari situ, dan kalau harganya berubah, semua halaman ikut berubah sendiri.',
		'Buat halaman di browser, nama nama besarnya <b>React</b> (dari Facebook), <b>Vue</b>, <b>Svelte</b>, dan <b>Angular</b> (dari Google). Semuanya jalan di atas [[JavaScript|web/js]] dan menyelesaikan masalah yang sama, cuma gayanya beda beda.',
		'[fyi] Halaman yang lagi kamu buka ini dibangun pakai Svelte. Tiap pelajaran memakai ulang Nim yang sama, balon bicara yang sama, dan tombol yang sama, persis trik yang bakal kamu lihat di [[komponen|web/components]].',
		'[ingat] Satu data, satu tempat. Kayak pengumuman di grup kelas, sekali kirim semua tahu, nggak perlu japri tiga puluh teman satu satu.',
		'Kalau mau, giliran kamu. Ubah harga di satu tempat itu dan lihat semua halaman ikut berubah.'
	],
	reactions: {
		price:
			'Sekali ubah, keenam halaman langsung ikut. Nggak ada file yang dibuka satu satu, dan nggak ada halaman yang bisa kelupaan.'
	},
	steps: [
		{
			title: 'Situs yang tumbuh',
			body: 'Tiap halaman punya file sendiri, dan data yang sama (kayak harga) <b>disalin</b> ke banyak file.'
		},
		{
			title: 'Cara manual',
			body: 'Buat mengubah data yang disalin, kamu harus <b>mendatangi tiap salinan</b>. Lambat, dan makin lambat kalau situsnya makin besar.'
		},
		{
			title: 'Satu salinan terlewat',
			body: 'Dua halaman sekarang nggak kompak. Kesalahan kayak gini di program namanya <b>bug</b>.'
		},
		{
			title: 'Framework',
			body: 'Datanya disimpan di <b>satu tempat</b>. Halaman nggak menyalin, tapi <b>membaca</b>, jadi perubahan sampai ke semuanya sekaligus.'
		},
		{
			title: 'Nama nama besar',
			body: '<b>React</b>, <b>Vue</b>, <b>Svelte</b>, dan <b>Angular</b>. Gayanya beda, idenya sama, semuanya ditulis pakai JavaScript.'
		},
		{
			title: 'Kamu ada di dalamnya',
			tag: 'Info',
			body: 'Nimbus dibangun pakai <b>Svelte</b>. Nim dan balon bicaranya ditulis sekali lalu dipakai ulang di tiap pelajaran.'
		},
		{
			title: 'Satu data, satu tempat',
			tag: 'Biar nempel',
			body: '<b>Satu data, satu tempat.</b> Kayak pengumuman di grup kelas, sekali kirim semua tahu.'
		}
	],
	pages: ['Beranda', 'Toko', 'Mug', 'Keranjang', 'Checkout', 'Struk'],
	money: '${n}',
	storeLabel: 'harga',
	bugNote: 'Keranjang $12, checkout $9',
	lower: 'Turunkan harga',
	raise: 'Naikkan harga'
};
