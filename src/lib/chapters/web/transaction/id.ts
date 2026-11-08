import type { TransactionText } from './types';

export const id: TransactionText = {
	title: 'Transaksi database',
	intro: [
		'Kirim uang di aplikasi rasanya cuma satu aksi, tapi buat database itu dua. Kurangi saldo Adi 50000, lalu tambah saldo Bima 50000. Dua tulisan terpisah, satu habis yang lain.',
		'Sekarang bayangkan servernya mati lampu tepat di antara dua tulisan itu. Uang Adi sudah keluar, tapi nggak pernah sampai ke Bima. 50000 lenyap begitu aja.',
		'<b>Transaksi</b> membereskan masalah itu. Kamu bungkus langkah langkahnya di antara <b>BEGIN</b> dan <b>COMMIT</b>, dan database berjanji semuanya terjadi atau nggak ada satu pun yang terjadi. Nggak ada setengah setengah.',
		'Kalau ada yang rusak sebelum COMMIT, database melakukan <b>ROLLBACK</b>. Dia membatalkan langkah yang baru setengah jalan seolah nggak pernah dimulai (dia nyimpan catatan kecil tiap perubahan justru buat ini).',
		'[fyi] Janji semua atau tidak sama sekali ini namanya <b>atomicity</b>, huruf A di <b>ACID</b>, kumpulan jaminan yang bikin database SQL terkenal. Inilah kenapa bank dan toko online suka tabel ketat yang kamu temui di [[SQL atau NoSQL|resilience/database]].',
		'[ingat] <b>Commit menyimpan perubahan transaksi. Rollback membatalkannya.</b> Transfer perlu memperbarui kedua saldo dalam satu transaksi.',
		'Giliran kamu. Kirim uang ke Bima, terus coba cabut colokannya di tengah jalan. Coba tanpa transaksi dulu, baru pakai transaksi.'
	],
	reactions: {
		ok: 'Dua tulisannya jalan, jadi kali ini aman aja. Tapi sebenarnya nggak ada yang melindungi mereka. Sekarang coba tombol crash nya.',
		vanish:
			'Aduh. Adi kehilangan 50000 dan Bima nggak dapat apa apa. Tulisan pertama sudah tersimpan, yang kedua nggak sempat jalan, dan uang di bank sekarang lebih sedikit dari sebelumnya. Nyalakan transaksinya dan crash lagi.',
		commit:
			'BEGIN, dua tulisan, COMMIT. Begitu COMMIT masuk, dua perubahan itu jadi permanen bareng bareng, sebagai satu kesatuan.',
		rollback:
			'Selamat. Servernya mati setelah tulisan pertama, tapi tulisan itu ada di dalam transaksi yang belum di COMMIT. Waktu database nyala lagi, perubahannya di ROLLBACK, dan nggak ada satu rupiah pun yang hilang.'
	},
	tableName: 'akun',
	nameCol: 'nama',
	balanceCol: 'saldo',
	sender: 'Adi',
	receiver: 'Bima',
	accountOf: 'Rekening {who}',
	currency: 'Rp',
	locale: 'id-ID',
	txLabel: 'Transaksi',
	txOn: 'nyala',
	txOff: 'mati',
	sendBtn: 'Kirim {amount} ke {who}',
	crashBtn: 'Kirim, lalu crash di tengah',
	serverLabel: 'Server database',
	crashedTag: 'mati lampu',
	backTag: 'nyala lagi',
	logLabel: 'Yang dijalankan database',
	crashLine: 'listrik padam di sini',
	totalLabel: 'Uang di bank',
	totalOk: 'utuh semua',
	totalLost: '{amount} lenyap'
};
