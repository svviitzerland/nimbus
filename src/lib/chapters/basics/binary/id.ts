import type { BinaryText } from './types';

export const id: BinaryText = {
	title: 'Bit dan byte',
	intro: [
		'Jauh di dalam, komputer cuma tahu satu hal, apakah sebuah saklar kecil sedang <b>nyala</b> atau <b>mati</b>. Nyala ditulis 1, mati ditulis 0. Satu saklar seperti itu namanya <b>bit</b>.',
		'Satu saklar cuma bisa bilang ya atau tidak. Tapi kalau delapan saklar dijejer, ada 256 pola yang berbeda. Kumpulan delapan bit ini punya nama sendiri, <b>byte</b>.',
		'Tiap saklar di barisan itu punya nilai. Paling kanan bernilai 1, lalu terus berlipat dua ke kiri, 2, 4, 8, sampai 128. Jumlahkan nilai saklar yang nyala, itulah angka yang disimpan byte tersebut, dari 0 sampai 255.',
		'Terus huruf gimana? Orang orang sepakat membuat daftar, setiap huruf dapat nomornya sendiri. Huruf n kecil itu 110, huruf i kecil itu 105. Jadi waktu kamu mengetik n, yang disimpan komputer sebenarnya saklar saklar yang membentuk 110.',
		'[fyi] Daftar pertama yang populer namanya ASCII, dari tahun 1960an. Sekarang kita pakai <b>Unicode</b>, daftar yang jauh lebih panjang dan sudah mencakup huruf Jepang, Arab, aksara Jawa, sampai emoji. Huruf latin biasa tetap di nomor lamanya.',
		'Foto, lagu, dan video juga pakai trik yang sama, cuma barisan saklarnya jauh lebih panjang. Foto itu jutaan titik warna kecil, dan tiap titik butuh beberapa byte untuk bilang seberapa merah, hijau, dan birunya. Aplikasi pun isinya byte, berupa perintah buat CPU, nanti dibahas di [[Apa itu program|basics/program]].',
		'[ingat] Satu bit bernilai 0 atau 1. Delapan bit membentuk satu byte.',
		'Ini delapan saklar, satu byte. Nyalakan dan matikan sampai jadi huruf pertama dari nimbus.'
	],
	reactions: {
		letter:
			'Berhasil! 64 tambah 32 tambah 8 tambah 4 tambah 2 jadi 110, dan 110 artinya n. Kamu barusan menulis huruf persis seperti cara komputer, delapan saklar, satu byte.',
		word: 'Enam huruf, enam byte, 48 saklar. Itu semua bit yang dibutuhkan untuk menyimpan kata nimbus. Setiap pesan yang pernah kamu kirim isinya barisan seperti ini.',
		char: 'Satu huruf, satu byte, delapan saklar. Tadi kamu sudah bikin satu sendiri.',
		chat: 'Satu pesan chat cuma sekitar seratus byte. Kecil banget, satu foto saja bisa memuat ribuan pesan.',
		photo:
			'Satu foto HP kira kira 3 MB, artinya 3 juta byte, atau sekitar 24 juta saklar. Tiap titik warna butuh beberapa byte, dan satu foto punya jutaan titik.',
		song: 'Satu lagu sekitar 4 MB. Suara diukur ribuan kali tiap detik, dan setiap ukurannya jadi beberapa byte.',
		movie:
			'Satu film sekitar 4 GB, miliaran byte, lebih dari 30 miliar saklar. Film itu sebenarnya ribuan foto yang berurutan, ditambah suara. Makanya film cepat banget bikin HP penuh.'
	},
	locale: 'id-ID',
	acts: ['Satu byte', 'Seberapa besar'],
	goal: 'Bentuk huruf {c}',
	sumLabel: 'Saklarmu berjumlah {n}',
	letterIs: 'artinya',
	noLetter: 'belum jadi huruf kecil',
	hintHigh: 'Kebesaran, matikan satu saklar',
	hintLow: 'Masih kurang, nyalakan saklar lain',
	hintTap: 'Ketuk saklar untuk mengubahnya jadi 0 atau 1',
	matched: 'Itu dia {c}, pas banget',
	helpBtn: 'Biar Nim lanjutkan sisa nimbus',
	wordLabel: 'nimbus, byte demi byte',
	wordNote: '{b} byte, {n} saklar',
	sizesBtn: 'Sekarang lihat yang lebih besar',
	sizePrompt: 'Ketuk tiap benda untuk melihat berapa saklar yang dibutuhkan',
	units: 'KB itu sekitar seribu byte, MB sekitar sejuta, GB sekitar semiliar',
	switches: 'sekitar {n} saklar',
	sizes: [
		{ id: 'char', name: 'Satu huruf', size: '1 byte' },
		{ id: 'chat', name: 'Satu pesan chat', size: '100 byte' },
		{ id: 'photo', name: 'Satu foto HP', size: '3 MB' },
		{ id: 'song', name: 'Satu lagu', size: '4 MB' },
		{ id: 'movie', name: 'Satu film', size: '4 GB' }
	],
	doneNote: 'Semua yang ada di komputer itu saklar, cuma jumlahnya yang beda'
};
