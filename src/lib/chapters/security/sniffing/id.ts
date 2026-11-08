import type { SniffingText } from './types';

export const id: SniffingText = {
	title: 'Sniffing dan MITM',
	intro: [
		'Saat data lewat jaringan, perangkat pada jalurnya dapat mengamati lalu lintas. Di sini kita membandingkan apa yang terlihat ketika browser memakai HTTP dan HTTPS.',
		'<b>Sniffing</b> adalah menangkap paket jaringan untuk diperiksa. Paket yang dapat ditangkap bergantung pada posisi perangkat, pengaturan jaringan, dan enkripsi. Berada di WiFi yang sama tidak otomatis membuka semua isi komunikasi.',
		'Jika request HTTP berhasil ditangkap, isinya dapat dibaca sebagai teks biasa. Contoh di layar berisi username dan password dari formulir login simulasi.',
		'<b>HTTPS</b> melindungi komunikasi HTTP dengan TLS. Pengamat jaringan dapat melihat sebagian metadata koneksi, tetapi isi request dilindungi enkripsi. Cara verifikasinya ada di [[TLS|security/tls]].',
		'Penyerang yang menguasai jalur komunikasi juga dapat mencoba mengubah pesan atau menyamar sebagai server. Ini <b>MITM</b>, man in the middle. Kita mengujinya lebih jauh di [[MITM|security/mitm]].',
		'[fyi] Kata yang sama, dunia yang beda. Merekam lalu lintas jaringan bukan cuma trik penyerang. Orang jaringan sengaja melakukannya buat membereskan masalah, pakai alat seperti [[Wireshark|network/wireshark]]. Alatnya sama, yang penting lalu lintas siapa dan apakah pemiliknya sudah setuju.',
		'[ingat] <b>Paket terlihat belum tentu isinya terbaca.</b> Periksa HTTPS dan alamat situs. Koneksi terenkripsi melindungi pengiriman, tetapi tidak membuktikan pemilik situs dapat dipercaya.',
		'Semua di sini terjadi di kafe pura pura, nggak ada orang sungguhan yang dirugikan. Coba login ke nimbus.com lewat HTTP, lalu lewat HTTPS, dan lihat apa yang didapat si pengintip di meja sebelah.'
	],
	reactions: {
		http: 'Request HTTP berhasil ditangkap di jaringan simulasi ini. Username dan password terbaca karena isi request tidak dienkripsi.',
		https:
			'Isi request terlindungi TLS. Pengamat masih dapat melihat metadata seperti alamat IP tujuan dan ukuran lalu lintas. Nama domain juga dapat terlihat, tergantung konfigurasi DNS dan TLS.',
		real: 'Kamu memilih jaringan yang disebut pengelola kafe. Untuk membandingkan alurnya di simulasi, coba hotspot kedua.',
		twin: 'Kamu baru saja masuk ke hotspot milik si pengintip. Kelihatannya seperti WiFi kafe, tapi sekarang setiap paket lewat laptopnya dulu sebelum sampai ke internet. Dia bukan cuma menguping lagi, dia berdiri di tengah.',
		mitmHttp:
			'Lihat layarmu. Si pengintip menyelipkan kotak palsu di halaman itu yang minta nomor kartumu. Lewat HTTP polos, HP kamu nggak punya cara buat tahu halamannya sudah diubah di jalan.',
		mitmHttps:
			'Browser menolak sertifikat yang tidak dipercaya. Request aplikasi tidak diteruskan. Periksa penyebab peringatan sebelum mengirim data.'
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
	captureTitle: 'Paket yang tertangkap',
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
		idle: 'Bandingkan isi request melalui HTTP dan HTTPS',
		http: 'Login HTTP dikirim tanpa enkripsi dan dapat dibaca pada tangkapan ini',
		https: 'Lewat HTTPS, login kamu lewat seperti amplop yang disegel',
		pick: 'Dua jaringan dengan nama hampir sama. Yang mana WiFi kafenya?',
		real: 'WiFi kafe yang asli, yang disebut pelayan tadi',
		twin: 'Sekarang setiap paket mampir ke si pengintip dulu',
		mitmHttp: 'Halamannya sampai, tapi bukan halaman yang dikirim nimbus.com',
		mitmHttps: 'Verifikasi sertifikat gagal, request aplikasi diblokir'
	}
};
