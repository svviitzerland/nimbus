import type { WiresharkText } from './types';

export const id: WiresharkText = {
	title: 'Apa itu Wireshark',
	intro: [
		'Tiap kali kamu membuka halaman, puluhan paket keluar masuk laptopmu. Kamu nggak pernah melihatnya, browser menyembunyikan semua itu dan cuma menampilkan halamannya.',
		'<b>Wireshark</b> itu aplikasi gratis yang bikin kamu bisa melihatnya. Dia menguping di kartu jaringanmu dan merekam tiap paket yang lewat, namanya <b>capture</b>. Orang jaringan memakainya kalau perlu tahu apa yang benar benar terjadi, bukan yang mereka kira terjadi.',
		'Ingat [[lapisan dan paket|networking/layers]]? Tiap paket itu bingkisan yang dibungkus berlapis lapis. Wireshark membukakan bungkusnya buat kamu, satu lapisan per baris, dari sinyal di paling bawah sampai pesan di paling atas.',
		'[fyi] Versi mininya sebenarnya sudah kamu punya. Buka Developer Tools di browser dan lihat tab Network, di situ ada daftar semua permintaan yang dibuat sebuah halaman. Wireshark masuk lebih dalam, sampai ke tiap paket.',
		'[ingat] Wireshark menangkap paket yang terlihat oleh interface. Enkripsi membatasi isi yang dapat dibaca tanpa kunci yang sesuai.',
		'Yuk kita rekam kamu membuka nimbus.com. Mulai capture, lalu ketuk paketnya buat membuka bungkusnya. Coba satu paket DNS, satu paket TCP, dan data terenkripsi di bagian akhir.'
	],
	reactions: {
		capture:
			'Sembilan paket cuma buat membuka satu halaman, dan ini versi pendeknya. Warnanya mengelompokkan jenis paket. Ketuk baris mana saja buat membuka bungkusnya lapis demi lapis.',
		dns: 'Paket ini bertanya ke router di mana alamat nimbus.com. Dia naik UDP ke pintu 53, tanpa kunci sama sekali, jadi siapa pun di jaringanmu bisa melihat situs apa yang mau kamu buka.',
		tcp: 'Ini jabat tangan TCP, SYN, lalu SYN ACK, lalu ACK. Laptopmu dan server saling menyapa tiga kali sebelum data beneran bergerak. Lihat lapisan 4, pintu 443 itu pintu web yang aman.',
		hello:
			'Salam pembuka TLS. Di sini laptopmu dan nimbus.com sepakat soal kunci rahasia. Nama nimbus.com masih kelihatan, tapi mulai paket berikutnya, semuanya dikunci.',
		data: 'Terenkripsi. Wireshark masih bisa membaca lapisan luarnya, siapa pengirimnya, ke mana, lewat pintu berapa, tapi isi halamannya cuma acakan. Itulah [[HTTPS|security/tls]] yang melindungimu, bahkan dari alat seperti ini.'
	},
	captureBtn: 'Mulai capture',
	againBtn: 'Rekam lagi',
	capturing: 'Merekam di WiFi',
	captured: '{n} paket terekam',
	filterLabel: 'Tampilkan',
	filterAll: 'Semua',
	colNo: 'No.',
	colProto: 'Protokol',
	colInfo: 'Info',
	idleHint: 'Belum ada yang direkam',
	pickHint: 'Ketuk sebuah paket buat membuka lapisannya',
	layerLabel: 'Lapisan {n}',
	layerNames: { 1: 'Physical', 2: 'Data Link', 3: 'Network', 4: 'Transport', 7: 'Application' },
	packetNotes: [
		'Laptop meminta alamat IP untuk nimbus.com melalui DNS.',
		'Balasan DNS pada contoh ini berisi alamat 76.76.21.21.',
		'Jabat tangan langkah satu. Laptopmu mengetuk pintu 443 di server.',
		'Jabat tangan langkah dua. Server balas mengetuk.',
		'Jabat tangan langkah tiga. Sambungannya terbuka.',
		'Laptopmu mulai memasang kunci, dan menyebut situs yang dia mau.',
		'Server menjawab dengan sertifikatnya, bukti kalau dia memang nimbus.com.',
		'Permintaan halamanmu, terkunci rapat.',
		'Halamannya sendiri pulang, terkunci rapat juga.'
	]
};
