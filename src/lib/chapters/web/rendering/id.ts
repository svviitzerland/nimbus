import type { RenderingText } from './types';

export const id: RenderingText = {
	title: 'CSR, SSR, dan SSG',
	intro: [
		'Di suatu tempat, harus ada yang mengubah data dan komponenmu jadi [[HTML|web/html]] final yang bisa ditampilkan layar. Pekerjaan itu namanya <b>rendering</b>. Pertanyaan besarnya, di mana dan kapan itu terjadi.',
		'<b>CSR</b>, client side rendering. Server ngirim halaman yang hampir kosong plus satu paket besar [[JavaScript|web/js]]. HP kamu (si client) mengunduhnya, menjalankannya, lalu membangun halamannya sendiri. Sebelum itu, kamu cuma bengong lihat layar kosong.',
		'<b>SSR</b>, server side rendering. Server membangun halaman lengkap tepat saat kamu memintanya, lalu ngirim dalam keadaan siap dibaca. Habis itu sedikit JavaScript membangunkan tombol tombolnya, langkah ini namanya <b>hydration</b>.',
		'<b>SSG</b>, static site generation. Halamannya dibangun sekali, jauh sebelum ada yang berkunjung. Tiap kunjungan cuma ngambil file yang udah jadi, sering dari [[CDN|traffic/cdn]] yang dekat denganmu, jadi cepat banget. Kekurangannya, isinya nggak bisa beda beda per pengunjung.',
		'[fyi] Framework modern mencampur ketiganya. Next.js (buat React), Nuxt (buat Vue), dan SvelteKit (buat Svelte) membiarkan tiap halaman memilih caranya sendiri. Artikel blog bisa SSG, sementara keranjang belanjamu pakai SSR.',
		'Saatnya merasakan sendiri. Buka halaman nimbus.com yang sama dengan tiga cara di HP yang lambat, dan perhatikan kapan isinya pertama kali muncul.'
	],
	reactions: {
		csr: 'Kerasa kan nunggunya? Halamannya datang kosong, jadi HP kamu harus mengunduh semua JavaScript dan membangun semuanya sendiri. Di HP yang lambat, layar kosong itu lumayan lama.',
		ssr: 'Jauh lebih cepat! Server yang membangun, jadi halaman jadinya datang siap dibaca. Tombolnya aktif sesaat kemudian, setelah hydration selesai.',
		ssg: 'Hampir instan. Halamannya udah dibangun jauh sebelum kamu minta, jadi server tinggal nyerahin file yang siap. Cocok buat halaman yang sama untuk semua orang, kayak artikel blog.',
		all: 'Lihat papan skornya. Halaman yang sama, tiga waktu tunggu yang beda jauh. Coba matikan HP lambat lalu buka CSR lagi juga.',
		fast: '[fyi] Di HP yang kencang dan sinyal yang kuat, bedanya jauh mengecil. Makanya CSR terasa oke di laptopmu, tapi bisa nyiksa buat orang yang pakai HP murah dengan sinyal lemah.'
	},
	modes: {
		csr: { label: 'CSR', sub: 'HP kamu yang membangun' },
		ssr: { label: 'SSR', sub: 'Server membangun saat diminta' },
		ssg: { label: 'SSG', sub: 'Dibangun dari awal' }
	},
	slow: 'HP lambat',
	youLabel: 'Kamu',
	serverLabel: 'Server',
	shelfLabel: 'File siap',
	steps: {
		ask: 'HP kamu minta nimbus.com',
		emptyHtml: 'Halaman kosong datang, belum ada yang bisa ditampilkan',
		downloadJs: 'Mengunduh paket JavaScript yang besar',
		jsBuilds: 'HP kamu menjalankan JavaScript dan membangun halamannya',
		serverBuilds: 'Server membangun halamannya sekarang juga',
		fullHtml: 'Halaman lengkap datang, sudah bisa dibaca',
		hydrate: 'JavaScript membangunkan tombol (hydration)',
		prebuilt: 'Halamannya sudah dibangun dari tadi, tinggal diserahkan',
		ready: 'Siap'
	},
	idle: 'Pilih cara memuat halamannya',
	scoreLabel: 'Isi pertama muncul setelah',
	firstPaint: '{s} detik',
	fastTag: 'HP cepat',
	notYet: 'belum dicoba'
};
