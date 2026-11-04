import type { RelationsText } from './types';

export const id: RelationsText = {
	title: 'Relasi dan JOIN',
	intro: [
		'Di [[Apa itu SQL|web/sql]] semuanya tinggal di satu tabel. Padahal toko beneran menyimpan lebih dari satu jenis hal. Ada <b>pelanggan</b>, ada <b>produk</b>, dan tiap jenis dapat tabelnya sendiri.',
		'Lalu ada <b>pesanan</b>, siapa beli apa. Cara malasnya, salin nama pembeli ke tiap pesanan. Tapi Adi pesan dua kali, jadi namanya ditulis dua kali, dan begitu dia ganti nama kamu harus cari semua salinannya. Kelewat satu, tokonya bingung.',
		'Makanya tiap tabel kasih nomor sendiri ke tiap baris, namanya <b>id</b>. Nomor itu cuma milik satu baris dan nggak pernah berubah, kayak nomor antrean di bank. Nomor ini disebut <b>primary key</b>.',
		'Sekarang tabel pesanan berhenti menyalin nama. Dia cuma nulis nomor pelanggan dan nomor produk, misalnya <b>pelanggan_id 1</b>. Nomor yang menunjuk ke baris di tabel lain disebut <b>foreign key</b>.',
		'Ikuti nomornya, kamu sampai di baris yang tepat. Sambungan antar tabel itu namanya <b>relasi</b>, makanya database kayak gini disebut database relasional. Lihat tiap pesanan menunjuk ke pelanggan dan produknya.',
		'Tapi angka itu susah dibaca manusia. <b>JOIN</b> mengikuti semua nomor itu buat kamu dan menjahit tabelnya jadi satu jawaban yang gampang dibaca, siapa beli apa.',
		'[ingat] Primary key itu kayak NIK di KTP kamu sendiri. Foreign key itu NIK yang sama tapi dicatat di tempat lain, misalnya di formulir pendaftaran. Punya sendiri, primary. Nyatat punya orang, foreign.',
		'[fyi] Banyak database NoSQL nggak pakai JOIN, datanya malah disalin ke tiap catatan, demi kecepatan walau jadi kurang rapi. Kamu bisa bandingkan dua keluarga ini di [[SQL atau NoSQL|resilience/database]].',
		'Kalau mau, coba ganti nama Bima dan lihat semua pesanannya ikut berubah. Ini opsional kok.'
	],
	reactions: {
		rename:
			'Cuma satu baris di tabel pelanggan yang berubah, dan semua pesanannya langsung pakai nama baru. Nggak ada yang disalin, jadi nggak ada yang bisa ketinggalan.',
		back: 'Balik jadi Bima. Tetap satu baris, dan semua pesanan ikut lagi.'
	},
	panels: [
		{
			tag: 'Tabel',
			title: 'Satu tabel per jenis',
			body: 'Pelanggan di satu tabel, produk di tabel lain. Tiap baris itu satu orang atau satu barang.'
		},
		{
			tag: 'Masalahnya',
			title: 'Salinan di mana mana',
			body: 'Nulis nama di tiap pesanan berarti fakta yang sama tinggal di banyak tempat. Ubah satu, salinan lainnya jadi salah.'
		},
		{
			tag: 'Primary key',
			title: 'Nomor buat tiap baris',
			body: 'Kolom <b>id</b> kasih tiap baris nomor yang nggak dimiliki baris lain. Dari situ database bisa bedain baris satu dengan lainnya.'
		},
		{
			tag: 'Foreign key',
			title: 'Tunjuk, jangan salin',
			body: '<b>pelanggan_id</b> dan <b>produk_id</b> menyimpan id sebuah baris di tabel lain. Cuma angka, bukan salinan namanya.'
		},
		{
			tag: 'Relasi',
			title: 'Ikuti nomornya',
			body: 'Tiap garis berangkat dari foreign key ke baris yang ditunjuknya. Tiap pesanan cuma dua panah, satu ke orang dan satu ke barang.'
		},
		{
			tag: 'JOIN',
			title: 'Jahit jadi satu',
			body: '<b>JOIN</b> mengikuti semua nomor dan menyusun satu jawaban yang bisa dibaca dari tiga tabel itu.'
		},
		{
			tag: 'Cara ingat',
			title: 'Nomor sendiri, nomor pinjaman',
			body: 'Primary key itu nomor milik baris itu sendiri. Foreign key itu nomor yang dipinjam tabel lain buat menunjuk balik ke baris itu.'
		},
		{
			tag: 'Coba',
			title: 'Ubah satu baris',
			body: 'Ganti nama pelanggan di satu tempat, jawaban JOIN ikut berubah di mana mana, karena pesanan cuma pernah menyimpan nomor.'
		}
	],
	customersTable: 'pelanggan',
	ordersTable: 'pesanan',
	productsTable: 'produk',
	idCol: 'id',
	nameCol: 'nama',
	customerKey: 'pelanggan_id',
	productKey: 'produk_id',
	copiedCustomer: 'pelanggan',
	copiedProduct: 'produk',
	customers: ['Adi', 'Bima', 'Sari'],
	products: ['Kaos Nimbus', 'Topi Awan', 'Stiker Nim'],
	joinTitle: 'Siapa beli apa',
	bought: '{who} beli {what}',
	rule: 'Nomor sendiri itu primary, nomor pinjaman itu foreign.',
	rename: 'Ganti {from} jadi {to}',
	renameBack: 'Kembalikan',
	newName: 'Bimo'
};
