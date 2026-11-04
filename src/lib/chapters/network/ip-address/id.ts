import type { IpAddressText } from './types';

export const id: IpAddressText = {
	title: 'Alamat IP',
	intro: [
		'Setiap perangkat yang masuk ke jaringan dapat <b>alamat IP</b>. Bentuknya empat angka yang disambung titik, misalnya 192.168.1.5, dan gunanya memberi tahu data harus pergi ke mana.',
		'Bayangkan surat. Kalau amplopnya nggak ada alamat, pak pos bingung mau mengantar ke mana. Data juga begitu. Data dikirim dalam potongan kecil yang disebut <b>paket</b>, dan tiap paket membawa alamat tujuannya.',
		'Di dalam rumah, router membagikan alamat ke setiap HP dan laptop yang tersambung ke WiFi. Biasanya diawali 192.168, dan namanya <b>alamat privat</b>, karena cuma berlaku di dalam rumahmu.',
		'Rumahmu sendiri punya satu alamat lagi, yaitu <b>alamat publik</b>. Penyedia internetmu memberikannya ke router, dan cuma alamat inilah yang bisa dilihat seluruh internet.',
		'[ingat] Alamat IP itu alamat rumah. Alamat publik adalah nomor rumah di jalan, alamat privat adalah nomor kamar di dalamnya. Pak pos cuma tahu nomor rumah, yang hafal kamar kamarnya itu router.',
		'Makanya tetanggamu boleh saja punya laptop dengan alamat 192.168.1.5 juga. Dua rumah bisa sama sama punya kamar nomor 5, dan orang di luar nggak pernah mencarimu pakai nomor kamar.',
		'[fyi] Di cloud caranya sama. [[VPC|networking/vpc]] memberi server kamu alamat privat, dan cuma server yang menyambut pengunjung yang dapat alamat publik. Situs seperti nimbus.com juga punya alamat publik, dan [[DNS|networking/dns]] yang menerjemahkan namanya jadi angka itu.',
		'Mau coba sendiri? Kirim surat dari internet, sekali ke nomor kamar dan sekali ke nomor rumah, lalu lihat masing masing sampai di mana.'
	],
	reactions: {
		lost: 'Nyasar di jalan. Jutaan rumah memakai nomor kamar 192.168 yang sama, jadi di internet alamat itu nggak menunjuk ke siapa pun. Alamat privat memang nggak bisa dijangkau dari luar.',
		public:
			'Sampai! Suratnya menemukan rumahmu lewat alamat publik, lalu router mengantarnya ke kamar yang benar. Apa saja yang boleh masuk itu urusan [[NAT|network/nat]] dan [[firewall|networking/firewall]].'
	},
	steps: [
		{
			title: 'Alamat IP',
			body: 'Empat angka yang disambung titik, masing masing dari 0 sampai 255. Setiap perangkat di jaringan punya satu, supaya data tahu harus ke mana.'
		},
		{
			title: 'Paket',
			body: 'Data dipotong jadi bagian kecil yang disebut <b>paket</b>. Tiap paket membawa alamat tujuannya, persis seperti amplop surat.'
		},
		{
			title: 'Alamat privat',
			body: 'Dibagikan oleh router, biasanya diawali <b>192.168</b>. Cuma berlaku di dalam rumahmu.'
		},
		{
			title: 'Alamat publik',
			body: 'Satu untuk satu rumah, diberikan ke router oleh penyedia internetmu. Nomor inilah yang dilihat internet.'
		},
		{
			tag: 'Cara ingat',
			title: 'Rumah dan kamar',
			body: 'Alamat publik itu <b>nomor rumah</b> di jalan. Alamat privat itu <b>nomor kamar</b> di dalamnya.'
		},
		{
			title: 'Dipakai di mana mana',
			body: 'Hampir semua rumah memakai nomor 192.168 yang sama. Nggak apa apa, karena nomor itu nggak pernah keluar rumah.'
		},
		{
			tag: 'FYI',
			title: 'Di cloud juga sama',
			body: 'Jaringan cloud juga memberi server alamat privat, dan cuma server yang melayani pengunjung yang dapat alamat publik.'
		},
		{
			tag: 'Coba',
			title: 'Kirim surat',
			body: 'Pilih alamat di atas. Nomor kamar nyasar di luar, sedangkan nomor rumah sampai ke router, yang hafal semua kamarnya.'
		}
	],
	internetLabel: 'Internet',
	neighbourLabel: 'Tetangga',
	ips: {
		phone: '192.168.1.7',
		laptop: '192.168.1.5',
		routerIn: '192.168.1.1',
		routerOut: '36.85.120.14'
	},
	streetTag: 'nomor rumah',
	roomTag: 'nomor kamar',
	sendLabel: 'Kirim surat ke',
	lostTag: 'nggak ada orang',
	hitTag: 'sampai'
};
