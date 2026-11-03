import type { WifiText } from './types';

export const id: WifiText = {
	title: 'Apa itu WiFi',
	intro: [
		'<b>WiFi</b> itu radio. Gelombang tak terlihat yang sejenis dengan yang membawa lagu FM ke mobil, cuma router memakainya buat mengantar data ke HP kamu, dan HP kamu membalas lewat gelombang yang sama.',
		'Kebanyakan router bicara di dua <b>band</b>. <b>2.4 GHz</b> yang lebih tua, gelombangnya lebih panjang, jadi lebih gampang menembus tembok dan jangkauannya lebih jauh, tapi datanya lebih sedikit. <b>5 GHz</b> jauh lebih cepat, tapi gelombangnya yang pendek gampang tertahan tembok dan lebih cepat melemah.',
		'Tiap band dibagi jadi jalur jalur yang disebut <b>channel</b>. Di 2.4 GHz sebenarnya cuma ada tiga jalur yang nggak saling tumpang tindih (1, 6, dan 11). Kalau router tetanggamu ada di jalur yang sama denganmu, keduanya harus gantian bicara, dan dua duanya jadi lebih lambat.',
		'[fyi] WiFi cuma menutup beberapa meter terakhir, antara HP dan router. Dari router ke luar, semuanya lewat [[kabel|network/cabling]]. Oh ya, microwave di dapur memanaskan makanan dengan gelombang sekitar 2.4 GHz juga, makanya WiFi bisa tersendat waktu microwave menyala.',
		'Ini sebuah rumah dengan router di ruang tamu. Geser HP ke mana mana dan perhatikan kecepatannya. Bikin 5 GHz kalah di balik tembok, selamatkan dengan 2.4 GHz, lalu pasang routermu di channel yang sama dengan tetangga.'
	],
	reactions: {
		near5:
			'Dekat router di 5 GHz, ngebut banget. Nggak ada yang menghalangi, jadi band yang cepat bisa pamer.',
		weak5:
			'5 GHz kepayahan di sini. Tiap tembok menelan sebagian besar gelombang pendeknya, sisanya dihabisi jarak. Coba ganti bandnya.',
		through24:
			'Nyambung lagi. 2.4 GHz memang lebih lambat di kondisi terbaiknya, tapi gelombangnya yang panjang bisa menembus tembok yang tadi menahan 5 GHz. Makanya kamar yang jauh sering terasa lebih enak di 2.4.',
		clash:
			'Aduh, kecepatannya anjlok. Routermu dan router tetangga sekarang teriak teriakan di channel 6, jadi harus gantian. Pindah ke channel 1 atau 11 supaya punya jalur sendiri.',
		clear:
			'Punya jalur sendiri lagi, nggak perlu gantian sama tetangga. Router sebenarnya bisa memilih channel yang sepi sendiri, tapi kadang perlu sedikit dibantu.'
	},
	routerLabel: 'Router',
	phoneLabel: 'HP',
	neighbourLabel: 'Tetangga, ch {n}',
	rooms: ['Ruang tamu', 'Dapur', 'Kamar', 'Ruang kerja', 'Halaman'],
	bandLabel: 'Band',
	bands: {
		b24: { name: '2.4 GHz', sub: 'jangkauan jauh' },
		b5: { name: '5 GHz', sub: 'cepat, jarak pendek' }
	},
	channelLabel: 'Channel',
	channel5Note: '5 GHz punya banyak jalur, nggak berdesakan',
	dragHint: 'Geser HP kamu, atau ketuk di mana saja di dalam rumah',
	noSignal: 'Nggak ada sinyal',
	walls: {
		none: 'nggak ada penghalang',
		one: '1 tembok menghalangi',
		many: '{n} tembok menghalangi'
	},
	goals: [
		'Bikin 5 GHz kalah di balik tembok',
		'Selamatkan dengan 2.4 GHz',
		'Samakan channel dengan tetangga'
	]
};
