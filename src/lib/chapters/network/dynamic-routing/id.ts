import type { DynamicRoutingText } from './types';

export const id: DynamicRoutingText = {
	title: 'Routing dinamis',
	intro: [
		'Di [[Router dan routing|network/routing]] tiap papan penunjuk jalan ditulis pakai tangan. Buat tiga router sih aman. Provider internet punya ribuan, dan hampir tiap hari ada aja kabel yang kepotong alat berat.',
		'Kayak sekarang ini. Jalan yang lagi dipakai paket barusan putus. Kalau papannya ditulis manual, harus ada orang yang bangun jam tiga pagi buat benerin semuanya satu satu.',
		'Makanya router saling ngobrol. Tiap router terus ngasih tahu tetangganya jalan mana aja yang bisa dia capai. Begitu ada jalan putus, kabarnya nyebar dari router ke router dalam sekitar satu detik. Itulah <b>routing dinamis</b>.',
		'Tiap router ngegambar ulang petanya sendiri dan milih jalan baru sendiri. Di dalam satu perusahaan, obrolan ini biasanya pakai <b>OSPF</b>, yang selalu milih jalan terpendek yang masih tersambung. Nggak ada yang perlu dibangunin.',
		'[ingat] Cukup ingat dua nama dulu. OSPF ngobrol di dalam satu jaringan, kayak lorong lorong di satu gedung. BGP ngobrol antar jaringan, B itu Batas (Border).',
		'Internet itu ribuan jaringan (provider kamu, Google, Facebook) yang dijahit pakai <b>BGP</b>. Tiap jaringan ngumumin "alamat alamat ini ada di aku", dan yang lain langsung percaya. Nih, ada cerita nyata soal kepercayaan itu.',
		'4 Oktober 2021. Waktu maintenance rutin, satu perintah di Facebook nggak sengaja motong semua jalur di backbone mereka sendiri. Server DNS mereka (buku alamat dari [[DNS|networking/dns]]) sadar kalau mereka kepotong, dan sesuai desainnya, berhenti ngumumin.',
		'Dalam hitungan menit Facebook hilang dari semua peta di internet, Instagram dan WhatsApp ikut hilang. Servernya padahal masih nyala. Miliaran HP terus nanya, dan tiap router jawab "nggak tahu itu di mana".',
		'Engineernya sampai harus datang langsung ke data center, dan butuh sekitar enam jam buat naruh Facebook balik ke peta. Kalau mau, coba cabut sendiri pengumumannya dan lihat internet jadi lupa.'
	],
	reactions: {
		withdraw:
			'Pengumumannya hilang, jadi provider ngehapus Facebook dari petanya. Semua paket sekarang berhenti di situ, padahal servernya baik baik aja.',
		announce:
			'Diumumin lagi. Provider langsung tahu jalannya dalam hitungan detik, dan HP kamu nyambung lagi. Segitu rapuh sekaligus kuatnya satu baris BGP.'
	},
	steps: [
		{
			title: 'Banyak jalan',
			body: 'Jaringan beneran punya banyak router dan lebih dari satu jalan di antaranya, jadi hampir selalu ada jalan lain.'
		},
		{
			title: 'Jalan putus',
			body: 'Kabel bisa kepotong, router bisa mati. Papan yang masih nunjuk ke jalan putus bakal ngirim paket ke antah berantah.'
		},
		{
			title: 'Router ngobrol',
			body: 'Tiap router ngasih tahu tetangganya jalan mana yang bisa dia capai. Kabar jalan putus nyebar dalam sekitar satu detik.'
		},
		{
			title: 'Jalan baru',
			body: 'Tiap router ngitung sendiri jalan terbaik yang tersisa. Di dalam satu perusahaan ini namanya <b>OSPF</b> (Open Shortest Path First).'
		},
		{
			tag: 'Pegangan',
			title: 'O di dalam, B di batas',
			body: '<b>OSPF</b> di dalam satu jaringan. <b>BGP</b> (Border Gateway Protocol) antar jaringan.'
		},
		{
			title: 'Pengumuman BGP',
			body: 'Tiap jaringan ngasih tahu dunia alamat mana aja yang dia punya. Provider nyatet itu di petanya dan ngarahin kamu ke sana.'
		},
		{
			tag: '4 Oktober 2021',
			title: 'Pengumumannya berhenti',
			body: 'Backbone di dalam Facebook mati, jadi server DNS mereka berhenti ngumumin. Internet lainnya ngehapus jalannya.'
		},
		{
			tag: '4 Oktober 2021',
			title: 'Hilang dari peta',
			body: 'Tanpa pengumuman, nggak ada router yang tahu Facebook di mana. Servernya sehat, cuma nggak ada yang bisa nemuin.'
		},
		{
			tag: 'Sekitar enam jam kemudian',
			title: 'Balik ke peta',
			body: 'Backbone dibenerin langsung di lokasi, pengumumannya balik, dan Facebook, Instagram, serta WhatsApp ikut balik.'
		}
	],
	officeLabel: 'Kantor',
	dcLabel: 'Data center',
	brokenTag: 'putus',
	phoneLabel: 'HP kamu',
	providerLabel: 'Provider kamu',
	fbLabel: 'Facebook',
	dnsLabel: 'DNS',
	fbDcLabel: 'Data center',
	mapTitle: 'Peta provider',
	mapKnown: 'Facebook, lewat sini',
	mapGone: 'Facebook, nggak dikenal',
	announce: 'Facebook ada di sini',
	lostTag: 'di mana?',
	pullBtn: 'Cabut pengumumannya',
	backBtn: 'Umumin lagi'
};
