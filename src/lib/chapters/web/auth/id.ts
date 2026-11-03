import type { AuthText } from './types';

export const id: AuthText = {
	title: 'Session, cookie, dan token',
	intro: [
		'Ada hal lucu soal web. Tiap request datang ke server <b>nimbus.com</b> kayak orang asing. Server menjawabnya, terus langsung lupa kalau tadi pernah ada request itu.',
		'Terus gimana toko tahu kalau di halaman berikutnya itu masih kamu? Waktu kamu login pakai password, server ngasih browser kamu sebuah catatan kecil namanya <b>cookie</b>. Sejak itu browser otomatis menempelkan catatan itu ke setiap request yang dikirim ke nimbus.com.',
		'Cara klasiknya namanya <b>session</b>. Cookie cuma berisi angka acak, dan server menyimpan daftar angka mana punya siapa. Mirip karcis penitipan jaket, karcisnya nggak ada artinya tanpa daftar di balik meja.',
		'Cara lainnya pakai <b>token</b>, biasanya <b>JWT</b> (JSON Web Token). Di sini catatannya sendiri yang bilang kamu siapa, dan server menandatanganinya pakai rahasia yang cuma dia tahu. Nggak perlu daftar, server tinggal ngecek tanda tangannya, kayak gelang berstempel di konser.',
		'[fyi] Login memang dimulai dari password, tapi server yang baik nggak pernah menyimpan password aslinya. Yang disimpan cuma sidik jari acakannya, triknya ada di [[hashing|security/hashing]].',
		'[fyi] Kata yang sama, dunia yang beda. Di AI, <b>token</b> artinya potongan kecil kata yang dibaca model bahasa, nggak ada hubungannya sama login. Lihat [[token di LLM|ai/llm]].',
		'Coba sendiri. Login, buka pesananmu, lalu hapus cookienya dan buka lagi. Habis itu ganti ke token dan bandingkan.'
	],
	reactions: {
		login:
			'Kamu berhasil masuk. Server bikin session baru, mencatat angkanya di daftar di sebelah namamu, lalu ngirim angka itu balik sebagai cookie. Lihat toples cookienya.',
		browse:
			'Browser diam diam menempelkan cookienya, server menemukan angka itu di daftarnya, dan tahu kalau itu kamu. Makanya kamu tetap login dari halaman ke halaman.',
		deleted:
			'Cookie hilang. HP kamu masih nampilin halaman lama, tapi sudah nggak ada yang membuktikan kamu siapa. Sekarang coba buka pesananmu.',
		kicked:
			'Ketendang keluar! Requestnya datang tanpa cookie, jadi buat server kamu orang asing lagi. Persis ini yang terjadi waktu kamu menghapus data browser.',
		stranger:
			'Nggak ada cookie, nggak boleh masuk. Server belum pernah kenal kamu, jadi kamu disuruh login dulu.',
		token:
			'Kali ini cookienya berisi token. Perhatikan daftar di server tetap kosong, semua yang dia perlukan sudah tertulis di dalam token dan dijaga tanda tangannya.',
		tokenBrowse:
			'Server membaca tokennya, ngecek tanda tangannya pakai rahasianya, lalu percaya, tanpa perlu nyari apa apa. Ini yang bikin token praktis kalau kerjanya dibagi ke banyak server.',
		tokenKicked:
			'Sama aja dengan token. Tanpa token nggak ada yang bisa dicek, jadi kamu keluar. Sisi buruknya, siapa pun yang mencuri token bisa memakainya sampai kedaluwarsa, jadi jaga baik baik.'
	},
	modeSession: 'Session',
	modeToken: 'Token (JWT)',
	login: 'Login',
	browse: 'Buka Pesananku',
	deleteCookie: 'Hapus cookie',
	page: {
		loginTitle: 'Login ke nimbus.com',
		email: 'nim@nimbus.com',
		loginHint: 'Login dulu buat lihat pesananmu',
		hello: 'Hai Nim, ini pesananmu',
		orders: ['Nimbus Cap', 'Cloud Sticker'],
		kickedTitle: 'Kamu siapa?',
		kickedHint: 'Login lagi ya'
	},
	jarLabel: 'Cookie di HP kamu',
	jarEmpty: 'Kosong',
	tokenInside: 'Isinya bilang user nim, berlaku 1 jam, plus tanda tangan server',
	logLabel: 'Request terakhir',
	logIdle: 'Belum ada yang dikirim',
	noCookie: 'tanpa cookie',
	serverLabel: 'Server nimbus.com',
	sessionsLabel: 'Daftar session',
	sessionsEmpty: 'Belum ada',
	sessionOwner: 'Nim',
	tokenServer: 'Nggak menyimpan daftar, cuma ngecek tanda tangan pakai kunci rahasianya'
};
