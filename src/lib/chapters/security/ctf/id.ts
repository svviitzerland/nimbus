import type { CtfText } from './types';

export const id: CtfText = {
	title: 'Apa itu CTF',
	intro: [
		'Ada teka teki nih. Kalau mengetes situs orang tanpa izin itu melanggar hukum, terus orang belajar hacking di mana? Bukan di situs beneran. Mereka main game yang memang dibuat buat itu.',
		'Game itu namanya <b>CTF</b>, singkatan dari Capture The Flag. Mirip permainan rebut bendera, kamu berburu bendera. Di sini benderanya berupa teks rahasia pendek yang disembunyikan di dalam teka teki, kira kira bentuknya nimbus{...}. Temukan, ketik, dapat poin.',
		'Teka tekinya ada beberapa jenis. <b>Crypto</b> soal tulisan rahasia, <b>web</b> menyembunyikan sesuatu di dalam halaman, dan <b>password</b> mengetes seberapa gampang sebuah login ditebak. Tiap teka teki yang terpecahkan menambah poin di papan skor, dan tim tim saling balapan.',
		'Kenapa di sini boleh menyerang? Karena panitianya sengaja membuat semua target buat diserang. Ikut main itu sendiri sudah jadi izinnya, sama kayak scope di [[bug bounty|security/pentest]].',
		'[fyi] DEF CON, konferensi hacker di Las Vegas, sudah mengadakan salah satu CTF paling terkenal sejak 1996. Buat pemula ada picoCTF dari Carnegie Mellon University, gratis dan dibuat buat anak sekolah. Indonesia juga punya, misalnya Cyber Jawara.',
		'CTF mini punyamu sudah siap, tiga teka teki yang masing masing bernilai 100 poin. Tiap bendera bentuknya nimbus{sesuatu}, dan kamu cukup mengetik bagian di dalam kurung kurawalnya.'
	],
	reactions: {
		decoded:
			'Nah itu dia. Geser balik tiap huruf tiga langkah, dan huruf acak tadi berubah jadi kata. Itu trik Caesar dari [[kunci|security/keys]], dan sekarang kamu tahu benderanya.',
		caesar:
			'Bendera pertama didapat. Teka teki crypto beneran juga mulainya kayak gini, lalu makin susah, dengan kunci lebih panjang dan trik lebih aneh.',
		peek: 'Halamannya kelihatan kosong, tapi browser cuma menampilkan sebagian dari yang dia terima. Lihat source-nya buat melihat HTML mentah yang datang.',
		source:
			'Bendera kedua. Komentar di [[HTML|web/html]] memang nggak tampil di layar, tapi tetap terkirim ke semua pengunjung. Developer beneran pernah membocorkan password dengan cara ini, jadi jangan pernah menyimpan rahasia di halaman.',
		tryFail: 'Bukan. Coba yang lain, daftarnya diurutkan dari yang paling sering dipakai orang.',
		cracked:
			'Masuk. nimbus123 itu nama situs ditambah beberapa angka, salah satu tebakan pertama setiap penyerang. Benderanya ada di layar sambutan.',
		password:
			'Bendera ketiga. Password yang panjang, atau lebih baik lagi password manager, bakal bikin daftar ini nggak ada gunanya.',
		wrongFlag: 'Hampir, tapi bukan itu benderanya. Cek ejaannya, huruf kecil semua.',
		allFlags:
			'Tiga bendera, 300 poin! Kamu baru saja memecahkan teka teki crypto, web, dan password. picoCTF dan kawan kawannya punya ratusan lagi, semuanya legal dan gratis.'
	},
	scoreLabel: 'Skor {n} dari {total}',
	points: '{n} poin',
	solvedTag: 'beres',
	challenges: {
		caesar: {
			name: 'Rahasia kuno',
			category: 'Crypto',
			brief: 'Seseorang menggeser tiap huruf benderanya. Geser terus sampai terbaca jadi kata.'
		},
		source: {
			name: 'Halaman kosong',
			category: 'Web',
			brief: 'Halaman nimbus.com ini kelihatannya nggak punya apa apa. Lihat lebih teliti.'
		},
		password: {
			name: 'Login latihan',
			category: 'Password',
			brief:
				'Admin di mesin latihan ini memakai password yang umum. Coba daftar password yang paling sering dipakai.'
		}
	},
	flagLabel: 'Benderamu',
	flagPlaceholder: 'isi di dalam kurung',
	submitBtn: 'Kirim',
	wrongFlag: 'Bukan benderanya',
	rightFlag: 'Didapat, 100 poin',
	allSolved: 'Semua bendera sudah didapat',
	shiftLabel: 'Geser balik {n}',
	cipherLabel: 'Yang kamu temukan',
	plainLabel: 'Setelah digeser',
	pageHeading: 'Selamat datang di nimbus.com',
	pageBody: 'Nggak ada apa apa di sini. Beneran.',
	viewPage: 'Halaman',
	viewSource: 'Lihat source',
	loginTitle: 'practice.nimbus.com',
	userLabel: 'User',
	wordlistLabel: 'Password paling umum',
	wrongPass: 'Password salah',
	welcome: 'Selamat datang, admin. Benderamu adalah'
};
