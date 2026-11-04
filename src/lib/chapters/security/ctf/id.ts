import type { CtfText } from './types';

export const id: CtfText = {
	title: 'Capture The Flag',
	caesar: {
		alt: 'Patung dada Julius Caesar dari marmer di Museum Vatikan',
		caption: 'Julius Caesar, patung Romawi'
	},
	intro: [
		'Ini teka teki. Kalau mengetes situs asli tanpa izin itu melanggar hukum, terus orang belajar hacking di mana? Bukan di situs asli. Mereka main game yang memang dibuat untuk itu.',
		'Game ini namanya <b>CTF</b>, singkatan dari Capture The Flag. Kayak permainan rebut bendera, kamu berburu bendera. Di sini benderanya berupa teks rahasia pendek yang disembunyikan di dalam teka teki, misalnya nimbus{...}. Temukan, ketik, dapat poin.',
		'Kenapa menyerang di sini boleh? Karena panitianya membangun setiap target memang untuk diserang, dan ikut bermain itulah izinmu. Idenya sama dengan scope di [[bug bounty|security/pentest]], cuma lebih santai.',
		'Yuk pecahkan satu yang kecil bareng. Ada yang meninggalkan catatan acak ini. Dia memakai <b>sandi Caesar</b>, trik yang dipakai Julius Caesar untuk surat suratnya sekitar dua ribu tahun lalu. Setiap huruf digeser beberapa langkah ke depan di alfabet, di sini tiga, jadi a berubah jadi d.',
		'Untuk membacanya, geser setiap huruf mundur tiga langkah. Lihat. q mundur jadi n, l mundur jadi i, p mundur jadi m. Kurung kurawal bukan huruf, jadi tetap seperti aslinya.',
		'Dan itu dia benderanya, nimbus{salad}. Caesar salad, tentu saja. Pembuat soal memang suka lelucon garing.',
		'[fyi] DEF CON, konferensi hacker di Las Vegas, sudah menggelar salah satu CTF paling terkenal sejak 1996. Untuk pemula ada picoCTF dari Carnegie Mellon University, gratis dan dibuat untuk pelajar sekolah. Indonesia juga punya, misalnya Cyber Jawara.',
		'[ingat] Caesar itu cuma geser alfabet, kayak kode rahasia waktu SD, a jadi d, b jadi e. Maju untuk menyembunyikan, mundur untuk membaca. Dan karena cuma ada 25 kemungkinan geseran, coba saja semuanya.',
		'Kalau mau, giliran kamu. Ini catatan baru dengan geseran yang beda. Geser slidernya sampai pesannya masuk akal.'
	],
	reactions: {
		solved:
			'Tujuh langkah, dan keluarlah nimbus{cloud}. Kamu baru saja memecahkan sandi dengan mencoba geseran satu per satu, persis cara pemain CTF.'
	},
	steps: [
		{
			title: 'Latihan yang legal',
			body: 'Kemampuan hacking dilatih di <b>game</b> yang memang dibuat untuk itu, bukan di situs asli.'
		},
		{
			title: 'Capture The Flag',
			body: 'Benderanya berupa <b>teks rahasia</b> seperti nimbus{...}. Temukan, kirim, dapat poin.'
		},
		{
			title: 'Dibuat untuk diserang',
			body: 'Panitia memiliki semua targetnya dan <b>mengundang</b> kamu membobolnya. Ikut bermain itulah izinnya.'
		},
		{
			title: 'Sandi Caesar',
			body: 'Tiap huruf bergeser <b>3 langkah</b> di alfabet. a jadi d, b jadi e, dan seterusnya.'
		},
		{
			title: 'Membaca sandinya',
			body: 'Geser mundur sebanyak langkah yang sama. Yang bukan huruf <b>tetap</b> seperti aslinya.'
		},
		{
			title: 'Dapat',
			body: 'Benderanya <b>nimbus{salad}</b>. Di CTF sungguhan, kamu tinggal menempelkannya untuk dapat poin.'
		},
		{
			tag: 'Info',
			title: 'Tempat bermain',
			body: '<b>picoCTF</b> gratis dan dibuat untuk pemula. Indonesia punya <b>Cyber Jawara</b>.'
		},
		{
			tag: 'Biar nempel',
			title: 'Geser saja',
			body: 'Maju untuk <b>sembunyi</b>, mundur untuk <b>baca</b>. Cuma 25 geseran yang perlu dicoba.'
		},
		{
			tag: 'Giliranmu',
			title: 'Cari geserannya',
			body: 'Geser slidernya sampai catatannya terbaca seperti bendera.'
		}
	],
	sign: 'Silakan diserang',
	noteLabel: 'Catatannya',
	stripCap: 'Tiap huruf bergeser {n} langkah',
	shiftLabel: 'Geser mundur {n}'
};
