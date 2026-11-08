import type { PredictText } from './types';

export const id: PredictText = {
	title: 'Regresi dan klasifikasi',
	intro: [
		'Kemarin modelnya menyortir buah ke keranjang. Itu baru salah satu dari dua tugas besar yang bisa dikerjakan model machine learning. Hari ini kita kenalan dengan keduanya.',
		'<b>Regresi</b> (regression) menebak sebuah <b>angka</b>. Rumah ini laku berapa, berapa menit lagi makanannya sampai, besok sepanas apa. Jawabannya bisa jatuh di mana saja sepanjang skala.',
		'<b>Klasifikasi</b> (classification) memilih sebuah <b>kelompok</b> (disebut juga kelas). Email ini spam atau bukan, foto ini kucing atau bukan, transaksi ini penipuan atau bukan. Jawabannya selalu salah satu dari beberapa pilihan tetap.',
		'[fyi] Dalam pengembangan software, regression berarti perilaku yang sebelumnya bekerja menjadi rusak setelah perubahan. [[Tes aplikasi|web/testing]] membantu mendeteksinya. Maknanya berbeda dari regresi dalam statistik.',
		'Cara gampang membedakannya, bayangkan jawabannya. Kalau bisa dijawab pakai slider, itu regresi. Kalau dijawab dengan mengetuk salah satu dari beberapa tombol, itu klasifikasi.',
		'[ingat] Dengar bunyi pertanyaannya. "Berapa" berarti regresi. "Yang mana" berarti klasifikasi. Harga rumah itu berapa, spam atau bukan itu yang mana.',
		'Ini dua model mini. Model rumah menggambar garis lurus yang paling pas dengan titik titiknya, model email bertanya ke tiga email terdekat yang dia tahu. Tambahkan titikmu sendiri, lalu tanya keduanya.'
	],
	reactions: {
		reg_add:
			'Rumah baru masuk, dan garisnya bergeser biar tetap pas. Garis itulah seluruh modelnya, dia berusaha lewat sedekat mungkin dengan semua titik.',
		reg_ask:
			'Buat menjawab, dia naik dari luas yang kamu pilih sampai ke garis, lalu menyamping ke harganya. Angka berapa pun bisa keluar, itulah yang bikin dia regresi.',
		cls_add:
			'Emailmu ikut jadi contoh. Lihat daerah berwarnanya digambar ulang? Tiap daerah menunjukkan kelompok yang bakal didapat email baru di situ.',
		cls_ask:
			'Email baru itu mengecek tiga email yang paling dekat dengannya, lalu ikut suara terbanyak. Jawabannya cuma ada dua, spam atau bukan spam.',
		cls_flip:
			'Dia melewati perbatasan dan pindah kelompok! Jawaban klasifikasi langsung lompat dari satu kelompok ke yang lain, nggak pernah di tengah tengah.',
		both: 'Kamu sudah tanya keduanya! Yang satu menjawab angka, yang lain menjawab kelompok, dan beda itulah yang menentukan model mana yang kamu butuhkan. Keduanya belajar dari contoh berlabel, namanya [[supervised learning|ai/supervised]].'
	},
	tabReg: 'Harga rumah',
	tabCls: 'Spam atau bukan',
	regTitle: 'Regresi, harga rumah',
	clsTitle: 'Klasifikasi, spam atau bukan',
	regKind: 'menjawab angka',
	clsKind: 'menjawab kelompok',
	regX: 'Luas (m²)',
	regY: 'Harga',
	clsX: 'Jumlah link di email',
	clsY: 'Jumlah tanda seru',
	regHint: 'Ketuk grafiknya buat menambah rumah yang kamu tahu harganya',
	askSize: 'Luas rumah yang ditanyakan',
	regAnswer: 'Rumah {size} m² kira kira Rp{price} juta',
	regNeed: 'Tambah rumah dulu biar garisnya bisa digambar',
	spam: 'spam',
	ham: 'bukan spam',
	addAs: 'Ketuk untuk menambah',
	clsHint: 'Geser email baru (?) ke mana saja',
	clsAnswer: 'Email baru ini kayaknya {label}',
	newEmail: 'Email baru, pakai tombol panah buat menggesernya',
	clear: 'Hapus'
};
