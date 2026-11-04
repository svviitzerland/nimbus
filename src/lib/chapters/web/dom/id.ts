import type { DomText } from './types';

export const id: DomText = {
	title: 'DOM dan event',
	intro: [
		'Waktu browser membaca HTML kamu, dia nggak menyimpannya sebagai teks. Tiap tag diubah jadi objek lalu digantung jadi satu pohon. Lihat pohonnya tumbuh. Pohon ini namanya <b>DOM</b> (Document Object Model).',
		'Bayangin pohon silsilah keluarga. <b>html</b> di paling atas, <b>body</b> anaknya, dan di dalam body tinggal header, main, dan footer, masing masing punya anak sendiri. Tiap tag punya tepat satu orang tua.',
		'Halaman yang kamu lihat dan pohon ini sebenarnya hal yang sama, cuma digambar dengan dua cara. Tiap kotak di halaman itu satu <b>node</b>, satu titik di pohon, dan browser menjaga keduanya selalu sama.',
		'Ini bagian serunya. [[JavaScript|web/js]] nggak pernah menyentuh file HTML kamu. Yang dia ubah itu pohon yang hidup ini. Lihat dia menggantung <b>li</b> baru di daftar keranjang, dan halamannya langsung menampilkan baris baru.',
		'Hal hal yang terjadi di halaman namanya <b>event</b>. Pencetan itu event click, mengetik itu event input. Waktu kamu pencet tombol, kliknya mulai tepat di situ, di tombolnya.',
		'Lalu dia jalan. Kliknya naik dari tombol ke orang tuanya, lalu ke orang tua dari orang tuanya, sampai ke html. Perjalanan ini namanya <b>bubbling</b> (menggelembung naik).',
		'Jadi listener nggak harus nempel di tombol. Nim pasang satu di <b>main</b>, lebih tinggi. Tiap klik yang naik keluar dari main pasti lewat situ, jadi main mendengar tombolnya dan menambah isi keranjang.',
		'[fyi] Kata yang sama, dunia yang beda. [[Webhook|foundations/apiWebhook]] juga soal event, tapi antar server di internet. Event DOM nggak pernah keluar dari satu halaman yang lagi terbuka di browsermu.',
		'[ingat] Bayangin gelembung di gelas es teh soda. Mulainya dari bawah, tempat kamu pencet, lalu naik ke atas. Listener cuma dengar kliknya kalau dia ada di jalur naiknya.',
		'Sekarang pencet bagian mana aja di halaman dan lihat kliknya naik di pohon. Pencetan di dalam main sampai ke listenernya, pencetan di header atau footer lewat begitu aja.'
	],
	reactions: {
		bubble:
			'Tuh dia naik, dari bagian yang kamu pencet sampai ke <b>html</b>. Listener di jalur itu dapat kesempatan bereaksi, sisanya nggak dengar apa apa.'
	},
	steps: [
		{
			tag: 'DOM',
			title: 'Dari teks jadi pohon',
			body: 'Browser membaca HTML dari atas ke bawah dan mengubah tiap tag jadi <b>node</b>, objek yang bisa dia olah.'
		},
		{
			title: 'Orang tua dan anak',
			body: 'Tiap node punya tepat satu orang tua. <b>html</b> itu akarnya di paling atas, sisanya menggantung di bawahnya.'
		},
		{
			title: 'Dua gambar, satu benda',
			body: 'Kotak yang menyala di halaman dan node yang menyala di pohon itu elemen yang sama persis.'
		},
		{
			title: 'JavaScript mengubah pohon',
			body: 'Kodenya menambah node <b>li</b> ke daftar. Browser melihat pohonnya berubah dan langsung menggambar ulang halaman.'
		},
		{
			title: 'Event',
			body: 'Pencetan itu <b>click event</b>. Dia mulai dari node yang persis kamu sentuh, namanya target.'
		},
		{
			title: 'Bubbling',
			body: 'Lalu eventnya mampir ke orang tuanya, lalu orang tua berikutnya, sampai ke <b>html</b> di puncak.'
		},
		{
			title: 'Mendengar dari atas',
			body: 'Listener di <b>main</b> mendengar tiap klik yang naik dari dalamnya, jadi dia bisa bereaksi ke tombol juga.'
		},
		{
			title: 'Cuma di halaman ini',
			body: 'Event DOM tetap di tab browsermu. Pesan antar server itu jenis event yang lain lagi.'
		},
		{
			tag: 'Biar nempel',
			title: 'Gelembung naik',
			body: 'Pencet di bawah, eventnya naik. Listener cuma dengar kalau dia ada di jalur naiknya.'
		},
		{
			title: 'Pencet apa aja',
			body: 'Pencet satu bagian halaman. Kliknya naik di pohon, dan main menambah isi keranjang waktu kliknya lewat.'
		}
	],
	pageLabel: 'nimbus.com',
	treeLabel: 'Pohon DOM',
	page: {
		heading: 'nimbus.com',
		product: 'Boneka Nim',
		button: 'Tambah ke keranjang',
		help: 'Bantuan',
		added: 'Boneka Nim masuk'
	},
	listening: 'mendengar'
};
