import type { TransactionText } from './types';

export const id: TransactionText = {
	title: 'Transaksi database',
	intro: [
		'Kirim uang lewat aplikasi rasanya satu tindakan, tapi buat database itu dua. Kurangi saldo Adi 50000, lalu tambah saldo Bima 50000. Dua penulisan terpisah, satu sesudah yang lain. Lihat koinnya jalan.',
		'Sekarang bayangkan servernya mati listrik tepat di antara dua penulisan itu. Uang Adi sudah keluar, tapi nggak pernah sampai ke Bima. 50000 hilang begitu aja.',
		'<b>Transaksi</b> memperbaiki itu. Kamu bungkus langkah langkahnya di antara <b>BEGIN</b> dan <b>COMMIT</b>, dan database janji semuanya terjadi atau nggak ada sama sekali. Begitu COMMIT masuk, dua perubahan itu jadi permanen barengan.',
		'Kalau ada yang rusak sebelum COMMIT, database melakukan <b>ROLLBACK</b>. Begitu nyala lagi, dia membatalkan langkah yang setengah jadi seolah nggak pernah dimulai (dia punya catatan kecil tiap perubahan khusus buat ini). Uang Adi balik.',
		'[ingat] Transaksi itu <b>semua atau nggak sama sekali</b>, persis kayak transfer bank. Uangnya sampai utuh atau nggak pernah berangkat. Nggak ada uang yang nyangkut di tengah jalan.',
		'[fyi] Janji semua atau nggak sama sekali ini namanya <b>atomicity</b>, huruf A di <b>ACID</b>, kumpulan jaminan yang bikin database SQL terkenal. Makanya bank dan toko online suka tabel yang ketat yang kamu temui di [[SQL atau NoSQL|resilience/database]].',
		'Kalau penasaran, coba matikan dan nyalakan transaksinya, lalu lihat kecelakaan yang sama berakhir dengan dua cara berbeda. Ini opsional kok.'
	],
	reactions: {
		off: 'Tanpa transaksi, listriknya mati di antara dua penulisan. Adi kehilangan 50000, Bima nggak dapat apa apa.',
		on: 'Transaksi nyala. Kecelakaannya sama, tapi database membatalkan penulisan pertama dan nggak ada satu rupiah pun yang hilang.'
	},
	panels: [
		{
			tag: 'Dua penulisan',
			title: 'Satu transfer, dua langkah',
			body: 'Penulisan pertama mengambil uang dari satu rekening. Yang kedua memasukkannya ke rekening lain. Di antara keduanya, uangnya nggak ada di mana mana.'
		},
		{
			tag: 'Mati listrik',
			title: 'Nyangkut di tengah',
			body: 'Penulisan pertama sudah tersimpan, yang kedua nggak pernah jalan. Kalau semua saldo dijumlah, hasilnya sekarang lebih sedikit dari sebelumnya.'
		},
		{
			tag: 'Transaksi',
			title: 'BEGIN dan COMMIT',
			body: 'Semua di antara <b>BEGIN</b> dan <b>COMMIT</b> dihitung satu kesatuan. Belum ada yang final sebelum COMMIT.'
		},
		{
			tag: 'Rollback',
			title: 'Batalkan yang setengah jadi',
			body: 'Karena belum COMMIT, sesudah mati listrik database membaca catatannya dan mengembalikan tiap nilai yang sempat berubah.'
		},
		{
			tag: 'Biar nempel',
			title: 'Semua atau nggak sama sekali',
			body: 'Semua langkah terjadi, atau nggak ada satu pun. Nggak ada yang setengah setengah.'
		},
		{
			tag: 'Coba',
			title: 'Kecelakaan sama, akhir beda',
			body: 'Geser tombolnya. Listriknya selalu mati di tempat yang sama, cuma akhir ceritanya yang berubah.'
		}
	],
	tableName: 'rekening',
	nameCol: 'nama',
	balanceCol: 'saldo',
	sender: 'Adi',
	receiver: 'Bima',
	currency: 'Rp',
	locale: 'id-ID',
	serverLabel: 'Server database',
	crashedTag: 'mati listrik',
	backTag: 'nyala lagi',
	logLabel: 'Yang dijalankan database',
	crashLine: 'listriknya mati di sini',
	totalLabel: 'Uang di bank',
	totalOk: 'lengkap semua',
	totalLost: '{amount} hilang',
	savedTag: 'tersimpan',
	rule: 'Semua atau nggak sama sekali, nggak ada yang nyangkut.',
	txLabel: 'Transaksi',
	txOn: 'nyala',
	txOff: 'mati'
};
