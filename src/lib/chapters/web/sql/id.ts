import type { SqlText } from './types';

export const id: SqlText = {
	title: 'Apa itu SQL',
	intro: [
		'Toko di nimbus.com harus ingat semua produk yang dijualnya. Semuanya disimpan di <b>database</b>, program yang tugasnya cuma satu, menyimpan data dengan aman dan menemukannya lagi. Di dalamnya, produk produk itu tinggal di sebuah <b>tabel</b>. Lihat tabelnya terisi.',
		'Tabel itu mirip banget sama spreadsheet. Tiap produk itu satu <b>baris</b>, dan tiap <b>kolom</b> menyimpan satu fakta tentangnya, namanya, harganya, dan sisa stoknya. Tapi tabel baru berguna kalau kamu bisa nanya ke dia.',
		'Nah, buat itulah <b>SQL</b> ada (Structured Query Language, banyak orang bacanya "sikuel"). SQL itu bahasa buat ngobrol sama database. Kamu nulis satu kalimat pendek yang namanya <b>query</b>, terus database menjawab. Query paling gampang ya minta semuanya.',
		'Biasanya kamu nggak butuh semua kolom. Kata sesudah <b>SELECT</b> bilang kolom mana yang mau diambil, dan <b>FROM</b> bilang tabel mana yang dicari. Nama sama harga aja, yang lain nggak usah.',
		'Sekarang pertanyaan beneran. Produk mana yang stoknya habis? <b>WHERE</b> menambahkan syarat, dan database ngecek syarat itu di tiap baris, satu per satu. Cuma baris yang lolos yang dikembalikan.',
		'Terakhir, <b>ORDER BY</b> mengurutkan sisanya. Produk di bawah 50000, dari yang termurah. Database selalu menyaring dulu baru mengurutkan, jadi dia nggak buang waktu ngurutin baris yang toh bakal dibuang.',
		'[ingat] Baca query dari atas ke bawah kayak lagi belanja. SELECT itu mau ambil <b>apa</b>, FROM itu dari rak <b>mana</b>, WHERE itu <b>yang kayak gimana</b>. Ambil apa, dari mana, yang mana.',
		'[fyi] SQL lahir di IBM tahun 1970an dan sampai sekarang masih ada di mana mana. MySQL, PostgreSQL, dan SQLite (yang diam diam tinggal di dalam HP kamu) semuanya ngomong SQL, masing masing dengan logat kecilnya sendiri. Keluarga database yang satunya lagi bisa kamu temui di [[SQL atau NoSQL|resilience/database]].',
		'Kalau penasaran, coba tanya tabelnya pertanyaan lain dan lihat query itu menulis dirinya sendiri lagi. Ini opsional kok, tokonya tetap senang.'
	],
	reactions: {
		all: 'Semuanya, tiap kolom dan tiap baris. Enak buat ngintip sebentar, tapi di tabel beneran yang isinya jutaan baris, jarang banget kamu mau ambil semuanya sekaligus.',
		pick: 'Yang balik cuma nama dan harga. Minta lebih sedikit juga berarti data yang jalan ke server lebih sedikit, jadi halamannya tetap cepat.',
		out: 'Dua produk yang stoknya habis. WHERE ngecek keenam baris dan cuma menyisakan dua itu. Saatnya isi ulang.',
		cheap:
			'WHERE buang dulu yang kemahalan, baru ORDER BY ngurutin sisanya dari yang paling murah. Saring dulu, urutkan belakangan.'
	},
	panels: [
		{
			tag: 'Tabel',
			title: 'Baris dan kolom',
			body: 'Tiap <b>baris</b> itu satu produk. Tiap <b>kolom</b> itu satu fakta. Semua baris punya kolom yang sama, jadi tabelnya tetap rapi.'
		},
		{
			tag: 'Query',
			title: 'Kasih semuanya',
			body: 'Bintang sesudah <b>SELECT</b> artinya semua kolom. <b>FROM</b> menyebut nama tabelnya. Tanpa syarat, semua baris dikembalikan.'
		},
		{
			tag: 'SELECT',
			title: 'Pilih kolomnya',
			body: 'Cuma kolom yang ditulis sesudah SELECT yang dikembalikan. Kolom lain tetap di tabel, nggak diapa apain.'
		},
		{
			tag: 'WHERE',
			title: 'Sisakan yang lolos',
			body: 'Database menjalankan syaratnya di tiap baris bergantian. Baris yang lolos menyala, sisanya nggak ikut dijawab.'
		},
		{
			tag: 'ORDER BY',
			title: 'Urutkan sisanya',
			body: 'Sesudah disaring, baris yang tersisa dijejerkan. Di sini berdasarkan harga, dari yang termurah sampai termahal.'
		},
		{
			tag: 'Biar nempel',
			title: 'Apa, dari mana, yang mana',
			body: 'SELECT itu apa, FROM itu dari mana, WHERE itu yang mana, dan ORDER BY itu urutannya gimana. Empat kata, dan hampir semua query bisa kamu baca.'
		},
		{
			tag: 'Coba',
			title: 'Tanya hal lain',
			body: 'Tiap kali ditekan, tabelnya ditanya pertanyaan baru. Query menulis dirinya sendiri dan baris yang cocok menyala.'
		}
	],
	tableName: 'produk',
	columns: { name: 'nama', price: 'harga', stock: 'stok' },
	products: [
		{ name: 'Kaos Nimbus', price: 89000, stock: 12 },
		{ name: 'Topi Awan', price: 65000, stock: 0 },
		{ name: 'Stiker Nim', price: 15000, stock: 140 },
		{ name: 'Mug Nimbus', price: 45000, stock: 30 },
		{ name: 'Hoodie Awan', price: 189000, stock: 0 },
		{ name: 'Tas Kanvas', price: 39000, stock: 8 }
	],
	questions: {
		all: 'Tunjukkan seluruh tabelnya',
		pick: 'Cuma nama dan harga tiap produk',
		out: 'Produk mana yang stoknya habis?',
		cheap: 'Produk di bawah 50000, dari yang termurah'
	},
	questionLabel: 'Pertanyaannya',
	fileName: 'query.sql',
	rowsBack: '{n} baris dikembalikan',
	clauseTags: { select: 'apa', from: 'dari mana', where: 'yang mana', order: 'urutannya' },
	rule: 'SELECT itu apa, FROM itu dari mana, WHERE itu yang mana.',
	another: 'Tanya hal lain'
};
