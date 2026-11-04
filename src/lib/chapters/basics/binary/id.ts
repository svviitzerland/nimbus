import type { BinaryText } from './types';

export const id: BinaryText = {
	title: 'Bit dan byte',
	intro: [
		'Jauh di dalam setiap komputer ada miliaran saklar super kecil. Tiap saklar cuma bisa <b>nyala</b> atau <b>mati</b>, persis kayak saklar lampu di kamarmu. Nyala ditulis 1, mati ditulis 0.',
		'Satu saklar sendirian namanya <b>bit</b>. Satu bit cuma bisa jawab ya atau tidak, sedikit banget. Makanya komputer menjejerkan bit jadi barisan isi delapan, dan barisan itu namanya <b>byte</b>.',
		'[ingat] 8 bit jadi 1 byte, kayak 8 orang yang membentuk satu regu. Tiap dengar kata byte, bayangkan delapan saklar kecil berdiri berjejer.',
		'Terus huruf gimana? Orang orang sepakat bikin daftar, tiap huruf dapat nomornya sendiri. Huruf n kecil dapat nomor 110, dan angka 110 punya pola saklar sendiri. Pencet n di keyboard, dan pola itulah yang disimpan komputer.',
		'Sebuah kata cuma byte yang dijejer, satu byte untuk tiap huruf. Kata nimbus ada enam huruf, jadi butuh enam byte, total 48 saklar kecil.',
		'[fyi] Daftar pertama yang populer namanya ASCII, dari tahun 1960an. Sekarang kita pakai <b>Unicode</b>, daftar yang jauh lebih panjang dan sudah mencakup huruf Jepang, Arab, aksara Jawa, sampai emoji.',
		'Foto juga pakai trik yang sama. Foto itu kumpulan titik warna kecil, dan tiap titik isinya tiga byte yang bilang seberapa merah, hijau, dan birunya. Lagu juga begitu, suaranya diukur puluhan ribu kali tiap detik dan tiap ukuran jadi beberapa byte.',
		'Deretan 0 dan 1 susah dibaca manusia, jadi programmer sering menulis byte dalam <b>heksadesimal</b> (singkatnya hex), yang punya 16 digit, 0 sampai 9 lalu A sampai F. Satu digit hex pas 4 bit, jadi satu byte cukup ditulis dua digit hex, dan 11111111 jadi FF. Makanya warna seperti #FF0000 (merah penuh) dan alamat jaringan seperti MAC dan IPv6 ditulis dalam hex.',
		'Byte cepat banget numpuk, jadi kita hitung pakai kotak yang lebih besar. <b>KB</b> (kilobyte) itu sekitar seribu byte, <b>MB</b> (megabyte) sekitar sejuta, dan <b>GB</b> (gigabyte) sekitar semiliar. Satu foto beberapa MB, satu film beberapa GB.',
		'[ingat] Kilo, mega, giga, sama kayak ngitung duit, ribu, juta, miliar. Tiap naik satu tingkat, jadi seribu kali lebih besar.',
		'Ujung ujungnya semua yang ada di komputer itu byte, termasuk aplikasi (nanti dibahas di [[Apa itu program|basics/program]]). Kalau mau, coba nyalakan dan matikan saklarnya sendiri, lihat huruf apa yang keluar.'
	],
	reactions: {
		flip: 'Satu saklar berubah, angkanya ikut berubah. Beda satu bit saja sudah bisa jadi huruf lain, sekecil itu bedanya.',
		letter:
			'Huruf baru! Delapan saklar yang sama, cuma polanya beda. Semua huruf yang pernah kamu ketik itu pola seperti ini.'
	},
	steps: [
		{
			title: 'Satu saklar',
			body: 'Hal terkecil yang dikenal komputer. <b>Nyala</b> itu 1, <b>mati</b> itu 0, nggak ada yang di tengah.'
		},
		{
			title: 'Bit dan byte',
			body: '<b>1 bit</b> itu satu saklar. <b>1 byte</b> itu barisan 8 bit, dan delapan saklar itu bisa membentuk 256 pola berbeda.'
		},
		{
			title: 'Satu huruf',
			body: 'Tiap huruf punya nomor di daftar bersama. Saklar menyimpan nomornya, dan nomor itu mewakili hurufnya.'
		},
		{
			title: 'Satu kata',
			body: 'Satu byte untuk tiap huruf. Enam huruf, enam byte, 48 saklar.'
		},
		{
			title: 'Satu foto',
			body: 'Jutaan titik warna. Tiap titik isinya <b>3 byte</b>, satu untuk merah, satu hijau, satu biru. Lagu juga diubah jadi byte dengan cara serupa.'
		},
		{
			title: 'Heksadesimal',
			body: 'Enam belas digit, <b>0 sampai 9</b> dan <b>A sampai F</b>. Satu digit hex itu 4 bit, jadi satu byte itu dua digit hex, dan 11111111 sama dengan <b>FF</b>.'
		},
		{
			title: 'Kotak yang makin besar',
			body: '<b>KB</b> sekitar seribu byte, <b>MB</b> sekitar sejuta, <b>GB</b> sekitar semiliar. Tiap kotak memuat kira kira seribu kotak sebelumnya.'
		},
		{
			title: 'Coba sendiri, kalau mau',
			body: 'Ketuk saklar mana saja. Angkanya berubah, hurufnya juga.'
		}
	],
	on: 'nyala',
	off: 'mati',
	bitLabel: '8 bit',
	byteLabel: '1 byte',
	byteTrick: '8 orang, satu regu',
	keyLabel: 'kamu pencet',
	numberLabel: 'nomor {n}',
	letterLabel: 'huruf {c}',
	wordNote: '{b} byte, {n} saklar',
	dotNote: 'satu titik',
	colors: ['merah', 'hijau', 'biru'],
	oneByte: '1 byte',
	hexDigits: '16 digit',
	nibble: '4 bit',
	hexByte: '1 byte, 2 digit hex',
	hexUses: [
		{ label: 'warna', value: '#FF0000' },
		{ label: 'alamat MAC', value: '3C:22:FB:0A:11:9E' },
		{ label: 'IPv6', value: '2001:db8::ff' }
	],
	boxes: [
		{ unit: 'byte', what: 'satu huruf' },
		{ unit: 'KB', what: 'satu halaman teks' },
		{ unit: 'MB', what: 'satu foto atau lagu' },
		{ unit: 'GB', what: 'satu film' }
	],
	boxNote: 'Tiap kotak memuat sekitar seribu kotak sebelumnya',
	sizeTrick: 'ribu, juta, miliar',
	playHint: 'Ketuk saklarnya',
	notLetter: 'bukan huruf kecil',
	flipLabel: 'Saklar {i}'
};
