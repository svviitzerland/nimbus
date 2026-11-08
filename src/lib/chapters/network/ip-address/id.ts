import type { IpAddressText } from './types';

export const id: IpAddressText = {
	title: 'Alamat IP',
	intro: [
		'Setiap perangkat yang masuk ke jaringan dapat <b>alamat IP</b>, empat angka yang disambung titik, misalnya 192.168.1.5. Anggap saja ini nomor rumah. Data butuh nomor ini supaya tahu harus ke mana.',
		'Di rumah, router yang membagikan nomor ini ke setiap HP dan laptop yang tersambung ke WiFi. Biasanya diawali 192.168, dan namanya <b>alamat privat</b>, karena cuma berlaku di dalam rumahmu.',
		'Tetanggamu mungkin juga punya laptop dengan alamat 192.168.1.5. Nggak masalah, sama seperti dua jalan berbeda yang sama sama punya rumah nomor 5. Orang di luar nggak pernah memakai nomor ini buat mencarimu.',
		'Routernya sendiri punya dua wajah. Ke dalam, dia punya alamat privat. Ke luar, penyedia internetmu memberinya <b>alamat publik</b>, alamat yang bisa dilihat seluruh internet. Semua perangkat di rumahmu keluar lewat satu pintu itu.',
		'[fyi] Di cloud idenya sama. [[VPC|networking/vpc]] memberi server kamu alamat privat, dan cuma server yang menyambut pengunjung yang dapat alamat publik. Situs seperti nimbus.com juga punya alamat publik, dan [[DNS|networking/dns]] yang menerjemahkan namanya jadi angka itu.',
		'[ingat] IP mengidentifikasi interface dalam jaringan. Alamat privat digunakan dalam jaringan privat dan tidak dirutekan langsung di internet publik.',
		'Ini sebuah rumah dengan HP, laptop, dan router. Ketuk satu satu buat melihat alamatnya, lalu biarkan orang asing di internet mencoba mengetuk mereka.'
	],
	reactions: {
		phone:
			'HP kamu alamatnya 192.168.1.7. Router memberinya nomor itu begitu dia tersambung ke WiFi, dan besok bisa saja dapat nomor lain.',
		laptop:
			'Laptopnya 192.168.1.5, tetangga si HP. Keduanya diawali 192.168.1, tanda mereka tinggal di jaringan rumah yang sama.',
		router:
			'Router punya dua nomor. Ke dalam dia 192.168.1.1, pintu yang diketuk semua perangkat kalau mau keluar. Ke luar dia 36.85.120.14, pemberian penyedia internetmu, dan nomor inilah yang dilihat dunia.',
		lost: 'Ketukannya nyasar entah ke mana. Jutaan rumah memakai nomor 192.168, jadi di internet alamat itu nggak menunjuk ke siapa pun. Alamat privat memang nggak bisa dijangkau dari luar.',
		public:
			'Kali ini kena, tepat di routermu. Alamat publik itu satu satunya yang bisa ditemukan orang asing. Apa yang boleh masuk setelah itu jadi urusan [[NAT|network/nat]] dan [[firewall|networking/firewall]].'
	},
	internetLabel: 'Internet',
	strangerLabel: 'Orang asing',
	houseLabel: 'Rumahmu',
	phoneLabel: 'HP',
	laptopLabel: 'Laptop',
	routerLabel: 'Router',
	ips: {
		phone: '192.168.1.7',
		laptop: '192.168.1.5',
		routerIn: '192.168.1.1',
		routerOut: '36.85.120.14'
	},
	insideTag: 'ke dalam',
	outsideTag: 'ke luar',
	privateTag: 'privat',
	publicTag: 'publik',
	tapHint: 'Ketuk HP, laptop, dan router',
	knockPrompt: 'Pilih alamat yang mau diketuk orang asing',
	knockLabel: 'Orang asing mengetuk',
	lostNote: 'Nggak ada yang menjawab {ip} di internet',
	hitNote: '{ip} langsung sampai ke routermu',
	lostTag: 'nggak ada orang',
	hitTag: 'tok tok'
};
