import type { HashingText } from './types';

export const id: HashingText = {
	title: 'Password dan hashing',
	intro: [
		'Waktu kamu daftar di sebuah situs, situs itu harus menyimpan password kamu supaya bisa mengeceknya nanti. Pertanyaan besarnya, disimpan dengan cara apa?',
		'Cara yang ceroboh adalah menyimpannya persis seperti yang kamu ketik. Tahun 2009 perusahaan bernama RockYou melakukan itu, dan 32 juta password bocor dalam bentuk teks biasa yang bisa langsung dibaca. Yang paling populer adalah 123456, dipakai sekitar 290 ribu orang.',
		'Cara yang lebih baik adalah <b>hash</b>, sidik jari satu arah. Sebuah resep matematika mengubah password kamu jadi deretan huruf dan angka yang acak. Password yang sama selalu menghasilkan acakan yang sama, tapi nggak ada yang bisa membalik acakan itu jadi password lagi.',
		'Waktu kamu login, server membuat hash dari apa yang kamu ketik, lalu membandingkan kedua acakan. Kalau cocok, kamu masuk. Server nggak perlu menyimpan password aslimu sama sekali.',
		'Tapi hash punya satu titik lemah. Penyerang menyiapkan <b>lookup table</b> raksasa, jutaan password umum yang sudah dijadikan hash duluan. Tahun 2012 sekitar 6,5 juta hash password LinkedIn tersebar di internet, dan karena disimpan tanpa salt, sebagian besar berhasil dibongkar dalam hitungan hari.',
		'Obatnya namanya <b>salt</b> (garam), beberapa karakter acak yang dicampur ke tiap password sebelum dijadikan hash, beda untuk tiap pengguna. Password yang sama sekarang menghasilkan acakan yang beda, dan tabel siap pakai tadi jadi nggak berguna.',
		'[fyi] Hash bukan cuma buat password. Halaman download sering menampilkan hash sebuah file supaya kamu bisa mengecek filenya sampai tanpa berubah, itulah huruf I di [[CIA triad|security/cia]].',
		'Giliranmu. Pilih sebuah password, daftar di dua toko, lalu biarkan kedua databasenya bocor.'
	],
	reactions: {
		typed:
			'Lihat sidik jarinya? Ganti satu huruf saja dan seluruh acakannya berubah. Itu memang disengaja, supaya dua password yang mirip nggak kelihatan mirip.',
		registered:
			'Kedua toko sudah mendaftarkan kamu. Toko ceroboh mencatat password kamu apa adanya, nimbus.com cuma menyimpan sidik jarinya. Sekarang bayangkan hari sial buat keduanya.',
		leaked:
			'Aduh, di toko ceroboh penyerang langsung bisa membaca password kamu, dan karena orang suka memakai password yang sama di mana mana, dia bakal mencobanya ke email kamu. Dari nimbus.com dia cuma dapat acakan yang nggak ke mana mana.',
		leakedWeak:
			'Hati hati. Password kamu termasuk yang paling umum, jadi hash kamu pun ketahuan, penyerang tinggal mencarinya di tabel siap pakai. Babak berikutnya menunjukkan obatnya.',
		lookup:
			'Budi dan Sari tumbang bareng. Password mereka sama, jadi hash mereka pun kembar, dan hash itu sudah ada di tabel penyerang. Password Wati yang panjang dan aneh nggak ada di daftar mana pun.',
		salted:
			'Sekarang nggak ada yang cocok. Tiap pengguna dapat salt sendiri, jadi Budi dan Sari pun kelihatan beda total dan tabel siap pakai itu nggak berguna. Situs sungguhan juga memakai hash yang lambat seperti bcrypt (dari tahun 1999), jadi tiap tebakan bikin penyerang buang waktu.'
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
	safeTag: 'aman',
	usersTitle: 'Pengguna yang bocor, tanpa salt',
	usersTitleSalted: 'Pengguna yang bocor, dengan salt'
};
