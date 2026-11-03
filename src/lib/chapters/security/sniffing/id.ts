import type { SniffingText } from './types';

export const id: SniffingText = {
	title: 'Sniffing dan MITM',
	intro: [
		'Kamu duduk di kafe, pesan kopi, lalu sambung ke WiFi gratisnya. Praktis, kan? Tapi WiFi itu ibarat satu ruangan bersama. HP kamu, orang asing di meja sebelah, dan semua pengunjung lain ngobrol lewat udara yang sama.',
		'Gelombang radio nggak peduli ditujukan ke siapa. Siapa pun di dekatmu yang punya aplikasi yang pas bisa diam diam merekam setiap paket yang lewat. Namanya <b>sniffing</b>, kayak anjing yang mengendus semua bau di ruangan.',
		'Biasanya nggak ada yang iseng. Tapi kalau datamu jalan sebagai teks biasa yang bisa dibaca (<b>HTTP</b> polos), si pengendus bisa membacanya seperti kartu pos, alamatnya, isinya, bahkan password kamu.',
		'Obatnya adalah amplop yang dikunci. Dengan <b>HTTPS</b> semuanya diacak sebelum keluar dari HP kamu, jadi si pengendus cuma dapat acakan. Cara kunci itu dibuat ada di [[SSL dan TLS|security/tls]].',
		'Ada trik yang lebih licik. Bukan cuma menguping, penyerangnya berdiri <b>di tengah</b> percakapan, misalnya dengan membuat hotspot palsu yang namanya mirip WiFi kafe. Semua yang kamu kirim lewat laptopnya dulu. Ini namanya serangan <b>man in the middle</b>, disingkat MITM.',
		'[fyi] Kata yang sama, dunia yang beda. Merekam lalu lintas jaringan bukan cuma trik penyerang. Orang jaringan sengaja melakukannya buat membereskan masalah, pakai alat seperti [[Wireshark|network/wireshark]]. Alatnya sama, yang penting lalu lintas siapa dan apakah pemiliknya sudah setuju.',
		'Semua di sini terjadi di kafe pura pura, nggak ada orang sungguhan yang dirugikan. Coba login ke nimbus.com lewat HTTP, lalu lewat HTTPS, dan lihat apa yang didapat si pengintip di meja sebelah.'
	],
	reactions: {
		http: 'Aduh. Si pengintip bisa lihat username dan password kamu sebagai teks biasa, persis seperti yang kamu ketik. Siapa pun di WiFi ini yang punya aplikasi gratis bisa melakukan hal yang sama.',
		https:
			'Sekarang si pengintip cuma dapat acakan. Dia masih tahu kamu buka nimbus.com dan kira kira seberapa banyak yang kamu kirim, tapi isinya sama sekali nggak kebaca. Itulah kerja HTTPS.',
		real: 'Insting yang bagus, tanya pelayan kafe mana WiFi yang asli itu langkah paling aman. Tapi biar kelihatan triknya, coba yang satunya, yang sinyalnya kuat banget dan mencurigakan.',
		twin: 'Kamu baru saja masuk ke hotspot milik si pengintip. Kelihatannya seperti WiFi kafe, tapi sekarang setiap paket lewat laptopnya dulu sebelum sampai ke internet. Dia bukan cuma menguping lagi, dia berdiri di tengah.',
		mitmHttp:
			'Lihat layarmu. Si pengintip menyelipkan kotak palsu di halaman itu yang minta nomor kartumu. Lewat HTTP polos, HP kamu nggak punya cara buat tahu halamannya sudah diubah di jalan.',
		mitmHttps:
			'Browsermu menolak. Si pengintip mencoba menyamar jadi nimbus.com, tapi dia nggak bisa menunjukkan sertifikat asli nimbus.com, jadi browser memberi peringatan. Balik saja, jangan pernah lanjut melewatinya. Di WiFi umum, [[VPN|network/vpn]] menambah satu kunci lagi di atasnya.'
	},
	acts: ['Sniffing', 'Man in the middle'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke babak berikutnya',
	youLabel: 'Kamu',
	serverLabel: 'nimbus.com',
	routerLabel: 'WiFi kafe',
	snooperLabel: 'Pengintip di meja sebelah',
	twinLabel: 'Hotspot si pengintip',
	sendHttp: 'Login lewat HTTP',
	sendHttps: 'Login lewat HTTPS',
	loginTitle: 'Login',
	userLabel: 'Username',
	passLabel: 'Password',
	loginBtn: 'Masuk',
	loggedIn: 'Selamat datang, Sari',
	captureTitle: 'Yang dilihat si pengintip',
	captureEmpty: 'Menunggu ada yang lewat',
	readableTag: 'kebaca',
	scrambledTag: 'teracak',
	pickWifi: 'Pilih jaringan WiFi',
	wifiReal: 'Nimbus Cafe',
	wifiTwin: 'Nimbus Cafe Free',
	strongSignal: 'sinyal paling kuat',
	openHttp: 'Buka nimbus.com lewat HTTP',
	openHttps: 'Buka nimbus.com lewat HTTPS',
	blankPage: 'Belum tersambung',
	pageWelcome: 'Selamat datang di nimbus.com',
	tamperedTitle: 'Cek keamanan',
	tamperedBody: 'Masukkan nomor kartumu untuk lanjut',
	tamperedTag: 'diselipkan si pengintip',
	warnTitle: 'Koneksimu tidak privat',
	warnBody: 'Ada yang mungkin sedang menyamar jadi nimbus.com',
	warnBack: 'Kembali ke tempat aman',
	capture: {
		swapped: 'halaman diubah, kotak kartu diselipkan',
		refused: 'sertifikat palsu, browser menolak'
	},
	notes: {
		idle: 'Kafe yang sama, WiFi yang sama, pengintip yang sama. Cuma kuncinya yang beda',
		http: 'Lewat HTTP, login kamu lewat seperti kartu pos yang bisa dibaca',
		https: 'Lewat HTTPS, login kamu lewat seperti amplop yang disegel',
		pick: 'Dua jaringan dengan nama hampir sama. Yang mana WiFi kafenya?',
		real: 'WiFi kafe yang asli, yang disebut pelayan tadi',
		twin: 'Sekarang setiap paket mampir ke si pengintip dulu',
		mitmHttp: 'Halamannya sampai, tapi bukan halaman yang dikirim nimbus.com',
		mitmHttps: 'Browser menangkap si penyamar sebelum ada yang terkirim'
	}
};
