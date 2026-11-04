import type { LanWanText } from './types';

export const id: LanWanText = {
	title: 'LAN, WAN, dan internet',
	intro: [
		'Colokkan dua laptop ke kotak kecil yang sama pakai kabel, dan mereka sudah bisa saling kirim file. Kelompok kecil itu namanya <b>jaringan</b>.',
		'Kalau jaringannya muat di satu ruangan atau satu gedung, namanya <b>LAN</b>, Local Area Network. Kotak di tengahnya itu <b>switch</b>, tempat semua kabel di ruangan dicolokkan.',
		'Sekarang kantormu buka cabang di beberapa sudut kota. Tiap kantor tetap punya LAN sendiri, dan jalur panjang yang disewa dari perusahaan telekomunikasi menjahit mereka jadi satu. Jaringan yang menyebar seluas itu namanya <b>WAN</b>, Wide Area Network.',
		'Lalu <b>internet</b>? Dia bukan satu jaringan raksasa milik seseorang. Internet itu jutaan jaringan (rumah, kampus, perusahaan, penyedia internet) yang sepakat saling mengantar data. Jaringan dari jaringan jaringan.',
		'[ingat] LAN itu L buat Lokal, cukup satu gedung. WAN itu W buat Wilayah luas, satu kota bahkan satu negara. Internet itu gabungan semuanya. Kecil, besar, sedunia.',
		'[fyi] Coba lihat bagian belakang router rumah. Ada satu port berlabel <b>WAN</b>, yang menghadap dunia luar, dan sisanya berlabel <b>LAN</b>, menghadap ke dalam rumah. Kata yang sama, cuma dikecilkan jadi satu kotak. Kotak itu akan kamu kenal di [[perangkat jaringan|network/devices]].',
		'Mau terbang sendiri? Ketuk LAN, WAN, atau Internet, dan kameranya langsung zoom ke sana.'
	],
	reactions: {
		lan: 'Balik ke ruangan. Semua perangkat tercolok ke switch, jadi mereka bisa ngobrol langsung dengan cepat, tanpa butuh internet. Printer dan folder bersama tinggal di sini.',
		wan: 'Satu perusahaan, satu WAN. Tiap kantor tetap punya LAN sendiri di dalam, jalur panjang tadi cuma menjahit mereka jadi satu. Data antar kantor menempuh berkilo kilometer, jadi sedikit lebih lambat dibanding di dalam satu ruangan.',
		internet:
			'Seluruh dunia. Nggak ada pusatnya, nggak ada pemilik tunggal, cuma jaringan jaringan yang sepakat saling mengantar data. Kalau satu jalur putus, datanya cari jalan memutar. HP kamu yang membuka nimbus.com melompati beberapa jaringan seperti ini.'
	},
	steps: [
		{
			title: 'Jaringan',
			body: 'Dua perangkat atau lebih yang disambung supaya bisa saling kirim data. Beberapa kabel dan satu kotak sudah cukup.'
		},
		{
			title: 'LAN',
			body: '<b>Local Area Network</b>. Satu ruangan atau satu gedung, cepat dan pribadi. Semua kabel bertemu di switch.'
		},
		{
			title: 'WAN',
			body: '<b>Wide Area Network</b>. Beberapa LAN di tempat berbeda, disambung jalur panjang sewaan dari perusahaan telekomunikasi.'
		},
		{
			title: 'Internet',
			body: 'Jutaan jaringan yang sepakat saling meneruskan data. Nggak ada yang memiliki semuanya, dan data bisa memutar kalau satu jalur putus.'
		},
		{
			tag: 'Cara ingat',
			title: 'L itu Lokal, W itu Wilayah',
			body: '<b>LAN</b> satu gedung, <b>WAN</b> satu kota atau satu negara, <b>internet</b> gabungan semuanya.'
		},
		{
			tag: 'FYI',
			title: 'Ada di routermu juga',
			body: 'Port yang menghadap dunia luar berlabel WAN. Port yang menghadap ke dalam rumah berlabel LAN.'
		},
		{
			tag: 'Coba',
			title: 'Terbang sendiri',
			body: 'Ketuk salah satu level di atas, kameranya zoom ke sana. Perhatikan, ruangan tadi masih ada di dalam, cuma jadi kecil sekali.'
		}
	],
	levels: { lan: 'LAN', wan: 'WAN', net: 'Internet' },
	zoomLabel: 'Zoom ke',
	switchLabel: 'Switch',
	hqLabel: 'Kantor pusat',
	branchLabel: 'Cabang {n}',
	nets: ['Kantormu', 'ISP rumah', 'Kafe', 'nimbus.com', 'Kampus', 'Jaringan seluler']
};
