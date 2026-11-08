import type { AuthText } from './types';

export const id: AuthText = {
	title: 'Session, cookie, dan token',
	intro: [
		'HTTP tidak otomatis mengingat siapa yang mengirim request sebelumnya. Aplikasi perlu menghubungkan request dengan sesi pengguna, misalnya melalui cookie.',
		'Terus gimana toko tahu kalau di halaman berikutnya itu masih kamu? Waktu kamu login pakai password, server ngasih browser kamu sebuah catatan kecil namanya <b>cookie</b>. Sejak itu browser otomatis menempelkan catatan itu ke setiap request yang dikirim ke nimbus.com.',
		'Pada contoh <b>session</b>, cookie membawa ID acak. Server mencari ID tersebut pada data sesi untuk mengenali pengguna yang sudah login.',
		'Pada contoh <b>JWT</b>, token berisi klaim dan tanda tangan. Server memverifikasi tanda tangan, masa berlaku, dan klaim yang diperlukan sebelum menerima token.',
		'[fyi] Login memang dimulai dari password, tapi server yang baik nggak pernah menyimpan password aslinya. Yang disimpan cuma sidik jari acakannya, triknya ada di [[hashing|security/hashing]].',
		'[fyi] Kata yang sama, dunia yang beda. Di AI, <b>token</b> artinya potongan kecil kata yang dibaca model bahasa, nggak ada hubungannya sama login. Lihat [[token di LLM|ai/llm]].',
		'[ingat] Pada contoh session, server menyimpan data sesi dan browser membawa ID sesi. Pada contoh JWT, token membawa klaim yang perlu diverifikasi server.',
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
		kickedTitle: 'Login diperlukan',
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
