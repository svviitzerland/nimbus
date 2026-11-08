import type { RelationsText } from './types';

export const id: RelationsText = {
	title: 'Relasi dan JOIN',
	intro: [
		'Di [[Apa itu SQL|web/sql]] semuanya tinggal di satu tabel. Padahal toko beneran punya lebih dari satu jenis data. Ada pelanggan, ada produk, dan ada pesanan yang menghubungkan keduanya.',
		'Bisa sih semuanya dijejalkan ke satu tabel raksasa, nama dan alamat pelanggan ditulis ulang di tiap pesanan. Tapi waktu Adi pindah rumah, kamu harus benerin semua baris yang pernah dia beli, dan kelewat satu aja paketnya nyasar ke pintu yang salah.',
		'Makanya database relasional memecah semuanya. Tiap tabel punya <b>primary key</b>, biasanya kolom bernama <b>id</b>, nomor yang cuma dimiliki satu baris (kayak nomor antrean di bank).',
		'Terus satu tabel nunjuk ke tabel lain dengan menyimpan nomor itu. Pesanan nggak nyalin nama Adi, dia cuma bilang <b>pelanggan_id 1</b>. Penunjuk itu namanya <b>foreign key</b>, dan sambungan yang dia buat disebut <b>relasi</b>.',
		'Masalahnya, angka doang susah dibaca manusia. <b>JOIN</b> mengikuti kunci kunci itu dan menjahit tabelnya jadi satu jawaban lagi, kayak "Adi beli Stiker Nim".',
		'[fyi] Inilah kelebihan "antar tabel bisa saling terhubung" yang kamu lihat di [[SQL atau NoSQL|resilience/database]]. Banyak database NoSQL nggak pakai join dan malah nyalin datanya ke tiap dokumen, menukar kerapian demi kecepatan.',
		'[ingat] Primary key mengenali satu baris secara unik. Foreign key merujuk kunci pada tabel terkait. JOIN menggabungkan baris berdasarkan kondisi.',
		'Giliran kamu. Tabel pesanan sekarang isinya cuma angka. Sambungkan tiap kunci ke tabel yang dia tunjuk, telusuri beberapa pesanan, lalu JOIN semuanya dan lihat siapa beli apa.'
	],
	reactions: {
		customer:
			'Tersambung. Tiap angka di bawah pelanggan_id sekarang jadi penunjuk ke satu baris di tabel pelanggan. pelanggan_id 2 artinya ya "pelanggan yang id nya 2".',
		product:
			'Dan produk_id nunjuk ke tabel produk. Sekarang tiap pesanan cuma dua panah, satu ke orang dan satu ke barang.',
		wrong:
			'Belum pas. Foreign key selalu nunjuk ke <b>primary key</b> tabel lain, yaitu kolom id nya. Nomor pelanggan ada di tabel pelanggan, nomor produk ada di tabel produk.',
		follow:
			'Lihat, langsung nyala kan? Pesanan cuma nyimpan dua angka kecil, tapi dengan mengikutinya kamu nemu orangnya dan barangnya. Relasi itu sesederhana itu.',
		joined:
			'Itu dia, siapa beli apa, dalam kata kata biasa. Database mengikuti semua kuncinya buat kamu. Dan kalau Bima ganti nama, kamu cukup ubah satu baris di tabel pelanggan, semua pesanannya langsung ikut pakai nama baru.'
	},
	customersTable: 'pelanggan',
	ordersTable: 'pesanan',
	productsTable: 'produk',
	idCol: 'id',
	nameCol: 'nama',
	customerKey: 'pelanggan_id',
	productKey: 'produk_id',
	customers: ['Adi', 'Bima', 'Sari'],
	products: ['Kaos Nimbus', 'Topi Awan', 'Stiker Nim'],
	hintPickKey: 'Pencet kolom kunci di tabel pesanan',
	hintPickTarget: 'Sekarang pencet kolom yang ditunjuk {key}',
	hintFollow: 'Pencet satu pesanan buat menelusuri kuncinya, atau langsung JOIN semuanya',
	hintJoined: 'Pencet pesanan mana aja buat lihat asal angkanya',
	hintKeyFirst: 'Mulai dari kolom kunci di tabel pesanan dulu',
	notLinked: 'belum tersambung',
	joinBtn: 'JOIN tabelnya',
	joinedTitle: 'Siapa beli apa',
	joinedCols: ['pesanan', 'pelanggan', 'produk'],
	queryLabel: 'join.sql',
	headerHint: 'Kolom'
};
