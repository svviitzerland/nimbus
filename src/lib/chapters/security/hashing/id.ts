import type { HashingText } from './types';

export const id: HashingText = {
	title: 'Password dan hashing',
	intro: [
		'Situs perlu memeriksa password saat kamu login. Tapi ia tidak perlu menyimpan password aslinya. Coba bandingkan dua toko di lab ini.',
		'Toko ceroboh menyimpan teks biasa. Ketika databasenya bocor, password langsung terbaca. Toko kedua menyimpan <b>hash</b>, hasil perhitungan satu arah.',
		'Untuk login, server mengolah password yang diketik dengan cara yang sama lalu memeriksa hasilnya. Hash tidak mempunyai tombol dekripsi.',
		'Tetapi penyerang bisa <b>menebak</b>. Coba password umum seperti 123456, lalu jalankan tabel tebakan. Hash yang cocok mengungkap tebakan yang berhasil.',
		'<b>Salt</b> adalah nilai acak berbeda untuk tiap password yang disimpan. Salt ikut disimpan. Ia menghalangi pemakaian satu tabel tebakan untuk semua pengguna, tetapi tidak menghentikan semua tebakan.',
		'[fyi] Lab memakai SHA256 agar hasil terlihat cepat. Penyimpanan password nyata memerlukan algoritma khusus yang mahal ditebak, seperti Argon2id, beserta salt.',
		'[ingat] <b>Tidak bisa dibalik bukan berarti tidak bisa ditebak.</b> Password kuat, salt, dan algoritma yang tepat bekerja bersama.',
		'Daftar dengan password percobaan, lihat kebocorannya, lalu bandingkan tabel tebakan sebelum dan sesudah salt ditambahkan.'
	],
	reactions: {
		typed:
			'Lihat sidik jarinya? Ganti satu huruf saja dan seluruh acakannya berubah. Itu memang disengaja, supaya dua password yang mirip nggak kelihatan mirip.',
		registered:
			'Kedua toko sudah mendaftarkan kamu. Toko ceroboh mencatat password kamu apa adanya, nimbus.com cuma menyimpan sidik jarinya. Sekarang bayangkan hari sial buat keduanya.',
		leaked:
			'Toko ceroboh membocorkan password langsung. Hash tidak langsung menunjukkan password, tetapi penyerang masih bisa mencoba tebakan dan membandingkan hasilnya.',
		leakedWeak:
			'Hati hati. Password kamu termasuk yang paling umum, jadi hash kamu pun ketahuan, penyerang tinggal mencarinya di tabel siap pakai. Babak berikutnya menunjukkan obatnya.',
		lookup:
			'Dua password umum cocok dengan tabel ini. Password lainnya tidak ada dalam daftar percobaan, yang tidak berarti mustahil ditebak.',
		salted:
			'Dengan salt berbeda, tabel lama tidak cocok. Ini menghentikan pemakaian ulang tabel itu, tetapi tebakan per pengguna masih mungkin. Penyimpanan nyata juga memakai algoritma password yang mahal dihitung.'
	},
	acts: ['Dua toko', 'Salt'],
	actLabel: 'Babak {n}',
	nextAct: 'Lanjut ke babak berikutnya',
	pwLabel: 'Password kamu',
	pwPlaceholder: 'ketik sebuah password',
	hashLabel: 'hash',
	tooShort: 'Ketik {n} karakter lagi',
	registerBtn: 'Daftar di kedua toko',
	leakBtn: 'Kedua database bocor',
	carelessName: 'Toko ceroboh',
	carelessSub: 'menyimpan password apa adanya',
	nimbusName: 'nimbus.com',
	nimbusSub: 'cuma menyimpan hash',
	colUser: 'user',
	colPassword: 'password',
	youUser: 'kamu',
	emptyRow: 'belum ada',
	leakedTag: 'bocor',
	attackerReads: 'Penyerang membaca password kamu',
	attackerStuck: 'Penyerang dapat acakan, bukan password',
	attackerCracked: 'Penyerang menemukannya di lookup table',
	lookupTitle: 'Lookup table milik penyerang',
	lookupSub: 'password umum yang sudah dijadikan hash duluan',
	runLookup: 'Jalankan lookup table',
	addSalt: 'Tambah salt lalu bocorkan lagi',
	saltLabel: 'salt',
	crackedTag: 'terbongkar',
	safeTag: 'Tidak cocok dengan tabel ini',
	usersTitle: 'Pengguna yang bocor, tanpa salt',
	usersTitleSalted: 'Pengguna yang bocor, dengan salt'
};
