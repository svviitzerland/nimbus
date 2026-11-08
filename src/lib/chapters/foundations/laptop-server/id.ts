import type { LaptopServerText } from '../../types';

export const id: LaptopServerText = {
	title: 'Laptopmu juga bisa jadi server',
	intro: [
		'Laptop juga bisa menjadi server. Jalankan aplikasi yang menerima request, lalu perangkat lain di jaringan dapat mengaksesnya jika alamat dan pengaturan aksesnya sesuai.',
		'Di rumah itu gampang banget. Selama satu WiFi, HP temanmu bisa buka situs yang jalan di laptopmu. Developer kerja begini tiap hari, istilahnya jalan di <b>local</b>.',
		'Untuk menerima pengunjung dari internet, kamu perlu mengatur akses jaringan dan menjaga aplikasi tetap aktif. IP rumah dapat berubah, koneksi unggah memiliki kapasitas terbatas, dan laptop yang tidur akan berhenti melayani.',
		'Di sini sudah ada laptopmu di rumah, dan HP temanmu nyambung di WiFi yang sama. Mulai dari situ, lalu buka laptopmu untuk internet dan lihat masalahnya datang satu per satu.',
		'[ingat] Laptop bisa melayani request. Menjadi server adalah pekerjaan, bukan bentuk kotaknya.'
	],
	reactions: {
		lan: 'Lihat, jalan. Di WiFi yang sama, laptopmu beneran jadi server buat HP temanmu. Sesimpel itu.',
		public:
			'Laptop sekarang menerima request dari internet pada simulasi ini. Uji perubahan alamat IP, mode tidur, dan batas kecepatan unggah.',
		ip: 'ISP baru saja mengganti IP rumahmu, dan alamat situsmu ikut berubah. Semua pengunjung yang pegang alamat lama langsung nyasar.',
		sleep:
			'Laptop masuk mode tidur dan aplikasi tidak melayani request. Server perlu tetap aktif selama layanannya diharapkan tersedia.',
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
	statusLost: 'Alamat lama tidak terjangkau',
	statusDown: 'Situs mati',
	statusSlow: 'Situs lemot',
	noteIdle: 'HP temanmu nyambung di WiFi yang sama',
	noteLan: 'Satu WiFi, langsung kebuka. Berikutnya, buka untuk internet.',
	notePublic: 'Situs kini dapat diakses dari internet. Coba gangguan di bawah.',
	noteIp: 'IP berubah, alamat lama tidak dapat dipakai',
	noteSleep: 'Laptop masuk mode sleep, layanan berhenti',
	noteSlow: 'Kapasitas unggah terbatas, request mengantre'
};
