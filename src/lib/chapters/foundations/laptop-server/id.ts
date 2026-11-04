import type { LaptopServerText } from '../../types';

export const id: LaptopServerText = {
	title: 'Laptopmu juga bisa jadi server',
	intro: [
		'Ini rahasia kecil, server itu bukan barang ajaib. Laptop yang kamu pakai sekarang juga bisa jadi server. Jalankan aplikasimu di situ, dan komputer lain bisa membukanya.',
		'Di rumah itu gampang banget. Selama satu WiFi, HP temanmu bisa buka situs yang jalan di laptopmu. Developer kerja begini tiap hari, istilahnya jalan secara <b>local</b>, cuma di jaringan rumah sendiri.',
		'Masalah muncul kalau situsnya mau dibuka orang seluruh dunia. Alamat <b>IP</b> rumahmu (nomor alamatnya di internet) itu pinjaman dari ISP, penyedia internetmu, dan bisa diganti kapan saja, jadi alamat situsmu ikut berubah. Laptop juga harus nyala 24 jam nonstop, dan jatah unggah internet rumah kecil, langsung keteteran begitu pengunjung ramai.',
		'Di sini sudah ada laptopmu di rumah, dan HP temanmu nyambung di WiFi yang sama. Mulai dari situ, lalu buka laptopmu untuk internet dan lihat masalahnya datang satu per satu.'
	],
	reactions: {
		lan: 'Lihat, jalan. Di WiFi yang sama, laptopmu beneran jadi server buat HP temanmu. Sesimpel itu.',
		public:
			'Sekarang orang dari mana mana bisa masuk ke laptopmu. Keren sebentar, sampai masalah masalahnya mulai datang. Datangkan saja satu per satu.',
		ip: 'ISP baru saja mengganti IP rumahmu, dan alamat situsmu ikut berubah. Semua pengunjung yang pegang alamat lama langsung nyasar.',
		sleep:
			'Laptop ketutup, situs mati total. Server itu harus nyala terus menerus, dan laptop memang tidak dirancang buat itu.',
		slow: 'Jatah unggah internet rumah itu kecil. Begitu pengunjung ramai, semuanya kebagian lemot.'
	},
	laptopLabel: 'Laptopmu',
	friendLabel: 'HP teman',
	worldLabel: 'Pengunjung internet',
	houseLabel: 'Rumahmu',
	lanLabel: 'satu WiFi',
	ipLabel: 'IP rumah',
	tryLan: 'Coba dari HP teman',
	goPublic: 'Buka untuk internet',
	probIp: 'IP diganti ISP',
	probSleep: 'Laptop ketutup',
	probSlow: 'Pengunjung ramai',
	recover: 'Pulihkan',
	statusLocal: 'Jalan di WiFi rumah',
	statusOk: 'Situs jalan',
	statusLost: 'Pengunjung nyasar',
	statusDown: 'Situs mati',
	statusSlow: 'Situs lemot',
	noteIdle: 'HP temanmu nyambung di WiFi yang sama',
	noteLan: 'Satu WiFi, langsung kebuka. Berikutnya, buka untuk internet.',
	notePublic: 'Dunia bisa mampir ke laptopmu, dan masalahnya tinggal menunggu.',
	noteIp: 'Alamat berubah, pengunjung lama kehilangan jejak',
	noteSleep: 'Tutup laptop sebentar saja, semua pengunjung terputus',
	noteSlow: 'Unggahan rumah kecil, antrian numpuk'
};
