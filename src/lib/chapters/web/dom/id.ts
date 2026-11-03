import type { DomText } from './types';

export const id: DomText = {
	title: 'DOM dan event',
	intro: [
		'Waktu browser membaca HTML kamu, dia nggak menyimpannya sebagai teks. Tiap tag diubah jadi sebuah objek, lalu semuanya digantung jadi satu pohon, namanya <b>DOM</b> (Document Object Model).',
		'Bayangin pohon silsilah keluarga. <b>html</b> ada di paling atas, <b>body</b> anaknya, dan di dalam body tinggal header, main, dan footer, masing masing punya anak sendiri. Tiap tag punya tepat satu orang tua.',
		'Ini bagian serunya. [[JavaScript|web/js]] nggak pernah menyentuh file HTML kamu. Yang dia ubah itu pohon yang hidup ini, menambah cabang, membuang cabang, atau mengganti tulisan di sebuah daun, dan browser langsung menggambar ulang halamannya biar sama.',
		'Hal hal yang terjadi di halaman namanya <b>event</b>. Pencetan itu event click, mengetik itu event input. Waktu kamu pencet tombol, eventnya mulai dari tombol itu, lalu naik melewati tiap orang tuanya sampai paling atas. Perjalanan ini namanya <b>bubbling</b> (menggelembung naik).',
		'Jadi listener nggak harus nempel di tombolnya. Listener di orang tuanya juga mendengar tiap pencetan yang naik dari dalamnya. Tapi listener di cabang yang nggak pernah dilewati event nggak mendengar apa apa.',
		'[fyi] Kata yang sama, dunia yang beda. [[Webhook|foundations/apiWebhook]] juga soal event, tapi antar server di internet. Event DOM nggak pernah keluar dari satu halaman yang lagi terbuka di browsermu.',
		'Giliran kamu! Pertama pencet beberapa bagian nimbus.com dan temukan di pohonnya. Lalu pencet tombolnya dan lihat klik itu naik. Terakhir, pasang listener di sebuah cabang dan bikin pohonnya tumbuh.'
	],
	reactions: {
		found:
			'Tiap bagian yang kamu pencet itu sebuah node di pohon, dan kamu bisa menelusuri silsilahnya sampai ke <b>html</b>. Halaman dan pohonnya itu hal yang sama, cuma digambar dengan dua cara.',
		bubble:
			'Lihat dia naik? Kliknya mulai dari yang kamu pencet, lalu mampir ke tiap orang tuanya sampai ke <b>document</b>. Listener mana pun di jalur itu dapat kesempatan buat bereaksi.',
		miss: 'Nggak terjadi apa apa. Kliknya naik dari yang kamu pencet, tapi nggak pernah lewat cabang itu, jadi listener di sana nggak dengar apa apa. Coba node yang ada di jalur menuju puncak.',
		grow: 'Pohonnya tumbuh cabang baru! Listenernya mendengar klik, lalu JavaScript menambah <b>li</b> ke daftar keranjang. Browser sadar pohonnya berubah dan langsung menggambar baris barunya.',
		anywhere:
			'[fyi] Dia bereaksi padahal kamu nggak pencet tombolnya! Listenermu nempel di cabang besar, jadi semua klik yang naik dari dalamnya ikut terhitung. Kode beneran biasanya ngecek dulu elemen mana yang dipencet, pakai <b>event.target</b>.'
	},
	steps: { find: 'Temukan', bubble: 'Naik', listen: 'Dengarkan' },
	prompts: {
		find: 'Pencet dua bagian halaman yang berbeda',
		bubble: 'Sekarang pencet apa aja di halaman dan lihat kliknya naik',
		listen: 'Pencet node di pohon buat pasang listener di situ, lalu pencet Tambah ke keranjang'
	},
	pageLabel: 'nimbus.com',
	treeLabel: 'Pohon DOM',
	page: {
		heading: 'nimbus.com',
		product: 'Boneka Nim',
		button: 'Tambah ke keranjang',
		help: 'Bantuan',
		added: 'Boneka Nim masuk keranjang'
	},
	trailLabel: 'Klik ini mampir ke',
	listening: 'mendengar',
	hit: 'Listener di {node} mendengar kliknya',
	miss: 'Kliknya nggak pernah lewat {node}',
	clear: 'Kosongkan keranjang'
};
