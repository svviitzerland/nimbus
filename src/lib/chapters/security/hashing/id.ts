import type { HashingText } from './types';

export const id: HashingText = {
	title: 'Password dan hashing',
	intro: [
		'Waktu kamu daftar di suatu situs, situsnya harus menyimpan passwordmu, biar bisa dicek lagi waktu kamu login berikutnya. Pertanyaan besarnya, disimpan dalam bentuk apa?',
		'Cara yang ceroboh, ditulis persis seperti yang kamu ketik. Tahun 2009 perusahaan bernama RockYou melakukan itu, dan 32 juta password bocor sebagai teks biasa yang bisa langsung dibaca. Yang paling populer 123456, dipakai sekitar 290 ribu orang.',
		'Cara yang lebih baik namanya <b>hash</b>. Bayangkan blender matematika. Passwordmu masuk, blendernya berputar, lalu keluar deretan huruf dan angka yang acak. Acakan itu hashnya, dan cuma itu yang disimpan situsnya.',
		'Ada dua aturan ajaib. Password yang sama selalu menghasilkan acakan yang persis sama. Dan kalau satu huruf saja diganti, kucing123 jadi kucing124, acakannya berubah total.',
		'[ingat] Hash itu blender. <b>Buah bisa dijus, tapi jus nggak bisa dibalikin jadi buah.</b> Nggak ada yang bisa mengubah acakannya balik jadi passwordmu.',
		'Terus login gimana? Situsnya memblender apa yang barusan kamu ketik, lalu membandingkannya dengan acakan yang disimpan. Acakannya sama berarti passwordnya sama, kamu boleh masuk. Situsnya nggak pernah butuh password aslimu.',
		'Hash punya satu titik lemah. Penyerang memblender jutaan password umum dari jauh hari dan menyimpannya di <b>tabel contekan</b> (lookup table). Tahun 2012 sekitar 6,5 juta hash password LinkedIn disebar di internet. Hashnya tanpa garam, jadi banyak yang tinggal dicocokkan dan terbongkar dalam hitungan hari.',
		'Solusinya <b>salt</b> (garam), beberapa karakter acak yang dicampur ke tiap password sebelum diblender, beda untuk tiap orang. Budi dan Sari sama sama pakai 123456, tapi acakan mereka sekarang beda jauh, dan tabel contekannya nggak nemu apa apa.',
		'[fyi] Situs beneran juga sengaja pakai blender yang lambat, kayak bcrypt dari tahun 1999, biar tiap tebakan makan waktu buat penyerang. Hash juga bukan cuma buat password. Halaman download sering menampilkan hash file biar kamu bisa cek filenya sampai tanpa berubah, itu huruf I di [[CIA triad|security/cia]].',
		'Mau coba blendernya? Ketik password apa aja dan lihat acakannya loncat tiap kamu nambah huruf. Atau santai aja nonton blendernya muter.'
	],
	reactions: {
		typed:
			'Tuh kan? Nambah satu huruf aja, acakannya berubah semua. Dan tetap jalan satu arah, acakannya nggak ngasih tahu siapa pun apa yang kamu ketik. (Nim nggak nyimpen di mana mana, janji.)'
	},
	steps: [
		{
			tag: 'Daftar',
			title: 'Disimpan di mana?',
			body: 'Situsnya punya <b>database</b>, tabel besar berisi penggunanya. Pertanyaannya, apa yang ditulis di kolom password.'
		},
		{
			tag: 'RockYou, 2009',
			title: 'Teks biasa',
			body: 'Password disimpan <b>apa adanya</b>. Sekali bocor, semuanya langsung bisa dibaca.'
		},
		{
			tag: 'Solusinya',
			title: 'Hash',
			body: 'Blender matematika mengubah password apa pun jadi acakan yang panjangnya selalu sama. Situsnya cuma menyimpan <b>acakannya</b>.'
		},
		{
			tag: 'Dua aturan',
			title: 'Masuk sama, keluar sama',
			body: 'Password sama, hash sama, selalu. Beda satu karakter, hashnya <b>beda total</b>.'
		},
		{
			tag: 'Biar nempel',
			title: 'Nggak bisa balik',
			body: 'Jus <b>nggak bisa dibalikin jadi buah</b>. Hash cuma jalan satu arah.'
		},
		{
			tag: 'Login',
			title: 'Bandingkan acakannya',
			body: 'Situsnya memblender yang barusan kamu ketik, lalu membandingkannya dengan acakan yang disimpan. Cocok berarti boleh masuk.'
		},
		{
			tag: 'LinkedIn, 2012',
			title: 'Tabel contekan',
			body: 'Password umum yang sudah diblender duluan. Hash bocor yang ada di daftar langsung ketahuan passwordnya.'
		},
		{
			tag: 'Solusinya',
			title: 'Salt',
			body: 'Karakter acak ditambahkan per orang sebelum diblender. Password sama, hash <b>beda</b>, dan tabelnya nggak berguna.'
		},
		{
			tag: 'Info',
			title: 'Sengaja lambat',
			body: 'Blender password kayak <b>bcrypt</b> memang dibuat lambat, jadi mencoba jutaan tebakan butuh waktu lama banget.'
		},
		{
			tag: 'Opsional',
			title: 'Coba blendernya',
			body: 'Ketik apa aja. Hashnya asli (SHA256), dihitung langsung di browsermu dan nggak dikirim ke mana mana.'
		}
	],
	examples: ['kucing123', 'kucing124'],
	users: ['budi', 'sari'],
	dbTitle: 'database nimbus.com',
	colUser: 'user',
	colPassword: 'password',
	leakedTag: 'bocor',
	hashLabel: 'hash',
	noWayBack: 'nggak bisa balik',
	savedLabel: 'disimpan waktu daftar',
	typedLabel: 'barusan diketik',
	matchTag: 'cocok, silakan masuk',
	tableTitle: 'tabel contekan penyerang',
	leakedHashLabel: 'hash yang bocor',
	crackedTag: 'ketahuan',
	saltLabel: 'salt',
	sameTag: 'hashnya sama',
	noMatchTag: 'nggak ada di tabel',
	slowTag: 'sengaja lambat',
	tryLabel: 'Ketik password apa aja',
	tryPlaceholder: 'passwordmu di sini'
};
