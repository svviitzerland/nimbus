import type { SqlText } from './types';

export const id: SqlText = {
	title: 'Apa itu SQL',
	intro: [
		'Kamu sudah tahu database SQL menyimpan data dalam tabel yang rapi, isinya baris dan kolom (ingat [[SQL atau NoSQL|resilience/database]]). Tapi tabel baru berguna kalau kamu bisa nanya ke dia.',
		'Nah, buat itulah <b>SQL</b> ada (Structured Query Language, banyak orang bacanya "sikuel"). SQL itu bahasa buat ngobrol sama database. Kamu nulis satu kalimat pendek yang namanya <b>query</b>, terus database menjawab dengan baris baris yang cocok.',
		'Toko di nimbus.com menyimpan barangnya di tabel bernama <b>produk</b>. Tiap produk itu satu baris, dan tiap kolom menyimpan satu fakta tentangnya, namanya, kategorinya, harganya, dan sisa stoknya.',
		'Query itu kebacanya hampir kayak kalimat bahasa Inggris. <b>SELECT</b> bilang kolom mana yang kamu mau, <b>FROM</b> bilang dari tabel mana, <b>WHERE</b> cuma menyisakan baris yang lolos syarat, dan <b>ORDER BY</b> mengurutkan sisanya.',
		'[fyi] SQL lahir di IBM tahun 1970an dan sampai sekarang masih dipakai di mana mana. MySQL, PostgreSQL, dan SQLite (yang diam diam tinggal di dalam HP kamu) semuanya ngomong SQL, masing masing dengan logat kecilnya sendiri.',
		'[ingat] SELECT memilih kolom, FROM menentukan tabel, WHERE menyaring baris, dan ORDER BY mengurutkan hasil.',
		'Giliran kamu. Pemilik toko punya empat pertanyaan. Susun blok blok ini jadi query, jalankan, terus lihat jawabannya pas atau nggak.'
	],
	reactions: {
		all: 'Itu dia tabelnya utuh. <b>SELECT *</b> artinya semua kolom, bintangnya itu singkatan dari "semuanya". Enak buat ngintip sebentar, tapi di tabel beneran yang isinya jutaan baris, jarang banget kamu mau ambil semuanya sekaligus.',
		pick: 'Lebih rapi kan? Yang balik cuma kolom yang kamu minta. Minta lebih sedikit juga berarti data yang jalan dari database ke server lebih sedikit, jadi halamannya tetap cepat.',
		out: 'Ketemu, produk yang stoknya habis. <b>WHERE</b> ngecek tiap baris satu satu dan cuma menyisakan yang lolos syarat. Saatnya isi ulang dua barang itu.',
		cheap:
			'Secara logis, <b>WHERE</b> memilih baris yang memenuhi syarat, lalu <b>ORDER BY</b> menentukan urutan hasilnya. Database dapat memilih strategi eksekusi yang berbeda untuk menghasilkan jawaban yang sama.',
		miss: 'Query kamu jalan kok, database nggak pernah protes sama pertanyaan yang valid. Dia cuma menjawab pertanyaan yang beda dari yang ada di daftar. Coba lihat lagi bloknya.',
		done: 'Empat pertanyaan, empat jawaban, dan kamu nggak perlu ngubek baris satu satu. Tiap halaman produk di nimbus.com menjalankan query kecil kayak gini di belakang layar, berkali kali tiap detik.'
	},
	tableName: 'produk',
	columns: { name: 'nama', category: 'kategori', price: 'harga', stock: 'stok' },
	products: [
		{ name: 'Kaos Nimbus', category: 'kaos', price: 89000, stock: 12 },
		{ name: 'Topi Awan', category: 'topi', price: 65000, stock: 0 },
		{ name: 'Stiker Nim', category: 'stiker', price: 15000, stock: 140 },
		{ name: 'Mug Nimbus', category: 'mug', price: 45000, stock: 30 },
		{ name: 'Hoodie Awan', category: 'kaos', price: 189000, stock: 0 },
		{ name: 'Tas Kanvas', category: 'tas', price: 39000, stock: 8 }
	],
	shirtCategory: 'kaos',
	missionsLabel: 'Pertanyaan pemilik toko',
	missions: {
		all: 'Tampilkan seluruh tabel produk',
		pick: 'Cuma nama dan harga tiap produk',
		out: 'Produk mana yang stoknya habis?',
		cheap: 'Produk di bawah 50000, dari yang termurah'
	},
	selectLabel: 'kolom yang mana',
	whereLabel: 'baris yang mana',
	orderLabel: 'urutannya gimana',
	allColumns: 'semua',
	noFilter: 'semua baris',
	noOrder: 'apa adanya',
	cheapFirst: 'termurah dulu',
	priceyFirst: 'termahal dulu',
	alphabetical: 'A sampai Z',
	run: 'Jalankan query',
	queryLabel: 'query.sql',
	resultLabel: 'Hasil',
	rowsCount: '{n} baris',
	emptyResult: 'Nggak ada baris yang cocok',
	allDone: 'Keempat pertanyaan terjawab'
};
