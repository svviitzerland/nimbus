import type { RenderingText } from './types';

export const id: RenderingText = {
	title: 'CSR, SSR, dan SSG',
	intro: [
		'Sebelum sebuah halaman muncul di layarmu, harus ada yang merakitnya dulu, header, gambar, tulisan, tombol, semuanya dijadikan [[HTML|web/html]] yang sudah jadi. Pekerjaan itu namanya <b>rendering</b>.',
		'Cuma ada dua tempat yang bisa mengerjakannya. <b>Server</b>, komputer jauh di sana yang menyimpan nimbus.com, atau <b>client</b>, yaitu HP atau laptopmu sendiri. Pertanyaan besarnya, di mana dan kapan itu terjadi.',
		'<b>CSR</b>, client side rendering. Server ngirim halaman kosong plus satu kotak besar [[JavaScript|web/js]]. HP kamu membuka kotaknya lalu membangun halamannya sendiri. Sebelum selesai, kamu cuma bengong lihat layar kosong.',
		'<b>SSR</b>, server side rendering. Server membangun halaman lengkap tepat saat kamu minta, lalu ngirim dalam keadaan siap dibaca. Habis itu sedikit JavaScript membangunkan tombol tombolnya, langkah ini namanya <b>hydration</b>.',
		'<b>SSG</b>, static site generation. Halamannya sudah dibangun sekali, jauh sebelum ada yang berkunjung, lalu nunggu di rak. Kunjunganmu tinggal ngambil salinan yang sudah jadi, sering dari [[CDN|traffic/cdn]] yang dekat denganmu. Cepat banget, tapi semua pengunjung lihat halaman yang sama.',
		'[fyi] Framework modern mencampur ketiganya. Next.js (buat React), Nuxt (buat Vue), dan SvelteKit (buat Svelte) membiarkan tiap halaman memilih caranya sendiri. Artikel blog bisa SSG, sementara keranjang belanjamu pakai SSR.',
		'[ingat] CSR itu lemari rakitan, kamu rakit sendiri di rumah. SSR itu warung yang baru masak pas kamu pesan. SSG itu roti di etalase, sudah jadi dari pagi, tinggal ambil.',
		'Kalau mau, giliran kamu. Pilih satu cara dan lihat halaman yang sama datang lagi.'
	],
	reactions: {
		csr: 'Kerasa kan nunggu layar kosongnya? HP kamu harus mengunduh kotaknya dan membangun semuanya sendiri. Di HP murah dengan sinyal lemah, nunggunya makin lama.',
		ssr: 'Jauh lebih cepat. Server yang membangun, jadi halamannya datang siap dibaca, dan tombolnya aktif sesaat kemudian.',
		ssg: 'Hampir instan. Halamannya sudah dibangun dari dulu, jadi tinggal diserahkan. Cocok buat halaman yang sama untuk semua orang.'
	},
	steps: [
		{
			title: 'Rendering',
			body: 'Merakit bagian bagian halaman jadi <b>HTML</b> yang sudah jadi dan bisa ditampilkan layar.'
		},
		{
			title: 'Server atau client',
			body: '<b>Server</b> itu komputer yang jauh. <b>Client</b> itu perangkatmu sendiri. Dua duanya bisa merakit.'
		},
		{
			title: 'CSR',
			body: '<b>Client side rendering.</b> Perangkatmu merakit halaman dari JavaScript. Kosong dulu, lalu hidup.'
		},
		{
			title: 'SSR',
			body: '<b>Server side rendering.</b> Server merakit tiap kali diminta. Cepat bisa dibaca, lalu <b>hydration</b> bikin tombolnya berfungsi.'
		},
		{
			title: 'SSG',
			body: '<b>Static site generation.</b> Dirakit duluan dan disimpan jadi file. Paling cepat, tapi sama untuk semua orang.'
		},
		{
			title: 'Campur sesukamu',
			tag: 'Info',
			body: '<b>Next.js</b>, <b>Nuxt</b>, dan <b>SvelteKit</b> membiarkan tiap halaman memilih. Lihat ketiga cara bergantian.'
		},
		{
			title: 'Lemari rakitan, warung, roti',
			tag: 'Biar nempel',
			body: 'CSR itu <b>lemari rakitan</b>, SSR itu <b>warung</b>, SSG itu <b>roti di etalase</b>.'
		}
	],
	modes: { csr: 'CSR', ssr: 'SSR', ssg: 'SSG' },
	youLabel: 'Kamu',
	serverLabel: 'Server',
	shelfLabel: 'Halaman siap',
	status: {
		build: 'Bagian bagiannya menyatu jadi satu halaman',
		where: 'Siapa yang merakit, server atau HP kamu?',
		ask: 'HP kamu minta nimbus.com',
		emptyHtml: 'Halaman kosong dan sekotak JavaScript datang',
		jsBuilds: 'HP kamu merakit halamannya sendiri',
		serverBuilds: 'Server merakit halamannya sekarang juga',
		fullHtml: 'Halaman lengkap datang, siap dibaca',
		hydrate: 'JavaScript membangunkan tombol (hydration)',
		prebuilt: 'Halaman jadi langsung diambil dari rak',
		ready: 'Siap'
	},
	readyAfter: 'Bisa dibaca setelah {s} detik'
};
