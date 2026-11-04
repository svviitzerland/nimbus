import type { AuthText } from './types';

export const id: AuthText = {
	title: 'Session, cookie, dan token',
	intro: [
		'Ada hal lucu soal web. Tiap request datang ke server <b>nimbus.com</b> kayak orang asing. Server menjawabnya, terus langsung lupa kalau tadi pernah ada request itu.',
		'Terus gimana toko tahu kalau di halaman berikutnya itu masih kamu? Kamu login sekali, pakai email dan password.',
		'Sebagai gantinya, server ngasih browser kamu sebuah <b>cookie</b>, catatan kecil yang disimpan browser. Sejak itu browser otomatis menjepitkan catatan itu ke setiap request yang dikirim ke nimbus.com.',
		'Cara klasiknya namanya <b>session</b>. Cookie cuma berisi angka acak, dan server menyimpan daftar angka mana punya siapa.',
		'Di halaman berikutnya cookienya ikut terbawa, server menemukan angka itu di daftarnya, lalu menyapa kamu pakai nama. Nggak perlu login lagi.',
		'Cara lainnya pakai <b>token</b>, biasanya <b>JWT</b> (JSON Web Token). Di sini catatannya sendiri yang bilang kamu siapa, dan server menstempelnya pakai rahasia yang cuma dia tahu. Nggak perlu daftar, server tinggal ngecek stempelnya.',
		'[ingat] Session itu karcis penitipan jaket, isinya cuma nomor, daftarnya disimpan di balik meja. Token itu gelang konser, semua tertulis di gelangnya dan stempelnya jadi bukti asli.',
		'[fyi] Login memang dimulai dari password, tapi server yang baik nggak pernah menyimpan password aslinya. Yang disimpan cuma sidik jari acakannya, triknya ada di [[hashing|security/hashing]].',
		'[fyi] Kata yang sama, dunia yang beda. Di AI, <b>token</b> artinya potongan kecil kata yang dibaca model bahasa, nggak ada hubungannya sama login. Lihat [[token di LLM|ai/llm]].',
		'Lihat cookienya ikut terbawa di setiap halaman. Mau tahu kenapa dia penting? Hapus cookienya dan lihat request berikutnya.'
	],
	reactions: {
		deleted:
			'Cookie hilang. Request berikutnya datang tanpa apa apa yang dijepit, jadi buat server kamu orang asing lagi dan kamu dilempar ke halaman login. Persis ini yang terjadi waktu kamu menghapus data browser.',
		login: 'Login lagi, cookie baru di kantong, dan server kenal kamu lagi.'
	},
	steps: [
		{
			title: 'Server pelupa',
			body: 'Tiap request <b>berdiri sendiri</b>. Aslinya server nggak ingat apa pun soal request sebelumnya.'
		},
		{
			title: 'Login',
			body: 'Kamu membuktikan dirimu <b>sekali saja</b>, biasanya pakai email dan password.'
		},
		{
			title: 'Cookie',
			body: 'Catatan kecil yang server minta <b>disimpan browsermu</b>. Browser mengirimnya balik di setiap request ke situs itu.'
		},
		{
			title: 'Session',
			body: 'Cookienya cuma berisi <b>angka acak</b>. Server yang menyimpan daftar angka itu punya siapa.'
		},
		{
			title: 'Diingat',
			body: 'Cookie yang sama di setiap halaman. Server <b>mencari angkanya</b> di daftar dan tahu itu kamu.'
		},
		{
			title: 'Token (JWT)',
			body: 'Catatannya <b>membawa namamu</b> dan stempel dari server. Server cukup ngecek stempelnya, nggak perlu daftar.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: 'Session itu <b>karcis penitipan jaket</b>, token itu <b>gelang konser</b>.'
		},
		{
			title: 'Password',
			tag: 'Catatan',
			body: 'Server menyimpan <b>sidik jari acakan</b> dari passwordmu, bukan password aslinya.'
		},
		{
			title: 'Token yang lain',
			tag: 'Catatan',
			body: 'Di AI, token itu <b>potongan kata</b>. Namanya sama, idenya beda sama sekali.'
		},
		{
			title: 'Tanpa cookie, siapa kamu?',
			body: 'Tanpa cookie, request kembali jadi <b>orang asing</b>, dan kamu harus login lagi.'
		}
	],
	serverLabel: 'Server nimbus.com',
	page: {
		loginTitle: 'Login',
		email: 'nim@nimbus.com',
		loginBtn: 'Login',
		hello: 'Hai Nim',
		ordersLabel: 'Pesananmu',
		orders: ['Nimbus Cap', 'Cloud Sticker'],
		whoTitle: 'Kamu siapa?',
		whoHint: 'Login dulu ya'
	},
	sessionNumber: '#4821',
	wristband: 'Nim, 1 jam',
	noCookie: 'nggak ada cookie',
	listLabel: 'Daftar session',
	listRows: [
		{ number: '#1377', name: 'Ana' },
		{ number: '#4821', name: 'Nim' },
		{ number: '#9050', name: 'Budi' }
	],
	tokenLabel: 'Tanpa daftar',
	tokenNote: 'cek stempelnya',
	hashLabel: 'Password tersimpan',
	hashUser: 'nim',
	hashValue: '9f2c7ab1',
	deleteBtn: 'Hapus cookie',
	againBtn: 'Login lagi'
};
