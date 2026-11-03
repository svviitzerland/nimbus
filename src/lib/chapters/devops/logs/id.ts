import type { LogsText } from './types';

export const id: LogsText = {
	title: 'Logging terpusat',
	intro: [
		'Tiap program menulis buku harian sambil bekerja. Tiap kunjungan, tiap error, tiap momen lemot jadi satu baris lengkap dengan jamnya. Baris baris itu namanya <b>log</b>.',
		'Kalau servernya cuma satu, membaca log itu gampang. Login, buka filenya, gulir. Tapi nimbus.com sekarang jalan di dua puluh server di belakang [[load balancer|traffic/load-balancer]], dan yang rusak bisa yang mana saja.',
		'Makanya tim mengirim setiap baris log ke satu tempat begitu baris itu ditulis. Itulah <b>logging terpusat</b>, satu kotak pencarian untuk semua server, dan barisnya tetap tersimpan walau servernya sudah hilang.',
		'[fyi] Log bekerja bareng [[monitoring|compute/monitoring]]. Metrik bilang ada yang salah, log bilang persisnya apa yang terjadi. Tim keamanan juga menyisir log yang sama untuk menangkap penyerang, pakai alat yang disebut [[SIEM|security/detection]].',
		'Ada pembeli yang baru saja komplain. Cari checkout yang rusak. Coba login ke server satu per satu dulu, lalu coba log terpusat.'
	],
	reactions: {
		peek: 'Tiga server, enam menit, dan belum ketemu apa apa. Masih tujuh belas lagi, dan pembelinya masih menunggu. Pasti ada cara yang lebih cepat.',
		handFound:
			'Ketemu di web-14, tapi setelah login berkali kali. Di hari yang buruk servernya bisa seratus, dan sebagian mungkin sudah hilang bareng lognya. Sekarang coba log terpusat.',
		search:
			'Sekali cari, semua server sekaligus. Keramaiannya lenyap dan cuma baris yang cocok yang tersisa. Sekarang temukan baris yang kelihatan aneh.',
		found:
			'Itu dia. web-14 menyerah menunggu layanan pembayaran tepat di menit pembeli itu komplain. Satu pencarian, bukan dua puluh kali login, makanya setiap tim mengumpulkan lognya di satu tempat. Alat sungguhannya antara lain Elasticsearch dengan Kibana, Grafana Loki, dan alat log bawaan tiap cloud.'
	},
	ticketLabel: 'Tiket bantuan',
	ticket: 'Pembeli bilang checkout gagal sekitar jam 14.01, halamannya cuma menampilkan error',
	modes: ['Satu per satu', 'Log terpusat'],
	fleetLabel: 'Dua puluh server web',
	loginsTag: '{n} login, {m} menit',
	pickServer: 'Ketuk satu server untuk login dan membaca lognya',
	searchLabel: 'Cari di semua server',
	searchPlaceholder: 'ketik satu kata, misalnya error',
	quickLabel: 'Coba',
	resultsTag: '{n} dari {t} baris',
	noResults: 'Nggak ada baris yang cocok',
	tapHint: 'ketuk baris yang kelihatan aneh',
	foundTag: 'pelakunya web-14',
	noteHand: 'Tiap login makan waktu beberapa menit',
	noteHandFound: 'Ketemu, tapi harus login berkali kali',
	noteCentral: 'Semua baris dari dua puluh server, di satu tempat',
	noteFound: 'Ketemu dalam hitungan detik, bukan menit'
};
