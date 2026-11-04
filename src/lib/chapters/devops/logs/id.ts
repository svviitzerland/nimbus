import type { LogsText } from './types';

export const id: LogsText = {
	title: 'Logging terpusat',
	intro: [
		'Tiap program menulis buku harian sambil bekerja. Tiap kunjungan, tiap error, tiap momen lemot jadi satu baris dengan jam ditulis di depannya. Baris baris itu namanya <b>log</b>. Lihat web-01 menulis buku hariannya.',
		'Kalau servernya cuma satu, membaca log itu gampang. Tapi nimbus.com sekarang jalan di dua puluh server di belakang [[load balancer|traffic/load-balancer]], dan yang rusak bisa yang mana saja. Login ke satu per satu buat membaca buku hariannya makan waktu lama banget.',
		'Makanya tim mengirim setiap baris ke satu tempat begitu baris itu ditulis. Itulah <b>logging terpusat</b>. Lihat baris dari dua puluh server mengalir turun ke satu log, berjejer rapi, urut sesuai jam.',
		'Ada bonusnya. Server di cloud datang dan pergi sepanjang hari. Barusan web-07 dimatikan, tapi baris barisnya tetap aman di log terpusat, siap dibaca.',
		'Ada pembeli bilang checkout gagal sekitar jam 14.01. Daripada dua puluh kali login, log terpusat cukup dicari sekali. Lihat Nim mengetik <b>error</b> di kotak pencarian, dan semua baris lain lenyap.',
		'Itu dia. <b>web-14</b> menyerah menunggu layanan pembayaran jam 14.01, tepat di menit pembeli itu komplain. Ketemu dalam hitungan detik, bukan sejam login sana sini.',
		'[ingat] <b>Banyak server, satu tempat cari.</b> Log itu buku harian server, dan logging terpusat menaruh semua buku harian di satu rak, jadi kamu cukup mencari di satu tempat.',
		'[fyi] Log bekerja bareng [[monitoring|compute/monitoring]]. Metrik bilang ada yang salah, log bilang persisnya apa yang terjadi. Tim keamanan juga menyisir log yang sama untuk menangkap penyerang, pakai alat yang disebut [[SIEM|security/detection]]. Alat sungguhannya antara lain Elasticsearch dengan Kibana dan Grafana Loki.',
		'Mau cari sendiri? Ketuk satu kata dan lihat dua puluh server menyempit jadi baris yang cocok saja. Atau santai menonton lognya mengalir, itu juga boleh.'
	],
	reactions: {
		error:
			'Tinggal baris error saja, dan dua di antaranya dari web-14 jam 14.01. Itulah checkout yang dikeluhkan pembeli tadi.',
		checkout:
			'Semua checkout dari semua server, urut sesuai jam. Kebanyakan bilang 200, artinya beres, sampai web-14 mulai kehabisan waktu. Mencari nama halaman itu cara jitu buat mengikuti satu fitur.',
		slow: 'Peringatan lambat memperlihatkan masalah yang menumpuk sebelum benar benar rusak. web-14 sudah menunggu layanan pembayaran berdetik detik tepat sebelum errornya muncul.'
	},
	steps: [
		{
			tag: 'Buku harian',
			title: 'Log',
			body: 'Satu baris per kejadian, selalu diawali <b>jam</b>, lalu server mana, seberapa gawat, dan apa yang terjadi.'
		},
		{
			tag: 'Masalahnya',
			title: 'Dua puluh buku harian',
			body: 'Dua puluh server berarti dua puluh log terpisah. Membacanya satu login demi satu login itu lambat, dan kamu nggak tahu harus buka yang mana.'
		},
		{
			tag: 'Solusinya',
			title: 'Logging terpusat',
			body: 'Tiap server mengirim barisnya ke satu log pusat begitu terjadi, digabung dan diurutkan sesuai jam.'
		},
		{
			tag: 'Tetap aman',
			title: 'Baris lebih awet dari server',
			body: 'Server bisa hilang, barisnya tetap tertinggal di log pusat.'
		},
		{
			tag: 'Sekali cari',
			title: 'Cari di semua server',
			body: 'Ketik satu kata, dan cuma baris yang cocok yang tersisa, dari dua puluh server sekaligus.'
		},
		{
			tag: 'Ketemu',
			title: 'Pelakunya',
			body: '<b>web-14</b>, jam 14.01, kehabisan waktu menunggu pembayaran. Server, jam, dan alasannya di satu baris.'
		},
		{
			tag: 'Biar nempel',
			title: 'Banyak server, satu tempat cari',
			body: 'Log itu buku harian. Taruh semua buku harian di satu rak, dan kamu cukup mencari di satu tempat.'
		},
		{
			tag: 'Rekan kerja',
			title: 'Log dan metrik',
			body: 'Metrik membunyikan alarm, log menjelaskannya. Tim keamanan membaca baris yang sama untuk mencari penyerang.'
		},
		{
			tag: 'Opsional',
			title: 'Cari sendiri',
			body: 'Ketuk satu kata. Log pusat cuma menyisakan baris yang memuatnya.'
		}
	],
	fleetLabel: 'Dua puluh server web',
	centralLabel: 'Log pusat',
	serverLog: 'Log {s}',
	allLog: 'Semua dua puluh server',
	loginTag: 'sudah {n} kali login',
	goneTag: 'mati',
	searchPlaceholder: 'cari',
	noResults: 'Belum ada baris yang cocok',
	foundTag: 'web-14',
	pickLabel: 'Cari kata'
};
