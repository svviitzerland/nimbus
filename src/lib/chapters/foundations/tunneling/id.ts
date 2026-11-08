import type { TunnelingText } from '../../types';

export const id: TunnelingText = {
	title: 'Tunneling',
	intro: [
		'Laptop gugur jadi server publik. Tapi sebelum pindah ke solusi besar, ada trik yang dipakai banyak developer, namanya <b>tunneling</b>.',
		'Idenya begini. Laptopmu yang menyambung duluan ke server milik pihak ketiga, paling sering orang pakai <b>ngrok</b>. Sambungan keluar itu jadi terowongan pribadi antara laptopmu dan server mereka.',
		'Pihak ketiga itu lalu meminjamkan alamat publik. Siapa pun yang membukanya diteruskan lewat terowongan tadi sampai ke laptopmu. IP rumah berubah pun tidak masalah, karena laptopmulah yang menyambung keluar, bukan orang yang mencari masuk.',
		'Ini pas banget buat demo ke klien atau nyoba dari HP tanpa harus upload ke mana mana. Tapi tetap pintu pinjaman. Alamatnya acak dan ganti tiap dinyalakan, semua trafik lewat server orang, dan begitu laptop ketutup, mati juga.',
		'Laptopmu sudah nyala dengan aplikasi yang jalan di local. Nyalakan tunnel-nya, ajak temanmu mampir, lalu tutup laptopnya dan lihat apa yang terjadi.',
		'[ingat] Tunnel membuka jalur ke layanan lokal. Layanannya tetap berjalan di komputermu.'
	],
	reactions: {
		tunnel:
			'Tunnel nyala. Laptopmu yang menyambung keluar ke relay, makanya tembus walau IP rumah berubah ubah. Kamu dikasih alamat publik pinjaman.',
		visited:
			'Permintaan temanmu masuk ke relay, menyusuri terowongan ke laptopmu, dan jawabannya balik lewat jalan yang sama. Itulah tunneling.',
		closed:
			'Laptop ketutup dan terowongannya ikut runtuh, alamat publiknya mati seketika. Buat demo oke banget, buat situs beneran jelas bukan. Nah, dari sinilah kita butuh cloud.'
	},
	laptopLabel: 'Laptopmu',
	localChip: 'aplikasi jalan di local',
	relayLabel: 'Relay ngrok',
	relaySub: 'pihak ketiga',
	friendLabel: 'HP teman',
	publicUrl: 'abc123.ngrok.app',
	startTunnel: 'Nyalakan tunnel',
	visit: 'Buka dari HP teman',
	closeLaptop: 'Tutup laptop',
	reset: 'Ulangi',
	tunnelOff: 'Tunnel mati',
	tunnelOn: 'Tunnel nyala',
	noteIdle: 'Laptopmu belum bisa dibuka dari luar',
	noteOn: 'Relay meminjamkan alamat publik untukmu',
	noteVisit: 'Request melewati relay menuju aplikasi di laptop',
	noteClosed: 'Laptop tidak aktif, aplikasi tidak dapat diakses lewat tunnel'
};
