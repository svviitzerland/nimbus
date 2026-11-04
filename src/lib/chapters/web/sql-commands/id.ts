import type { SqlCommandsText } from './types';

export const id: SqlCommandsText = {
	title: 'Jenis perintah SQL',
	intro: [
		'Orang mulai daftar di nimbus.com, jadi database butuh tabel <b>users</b>. Semua yang kamu suruh ke database itu perintah SQL, dan perintahnya terbagi jadi beberapa keluarga. Tiap keluarga mengurus bagian database yang beda.',
		'Pertama, tabelnya harus ada dulu. <b>CREATE TABLE</b> membangun bentuknya, nama tabel dan kolom kolomnya. Belum ada baris sama sekali, baru lemari kosong dengan rak yang sudah diberi label. Perintah yang membangun bentuk namanya <b>DDL</b> (Data Definition Language).',
		'Bentuknya bisa diubah nanti. <b>ALTER TABLE</b> menambah kolom baru, di sini kota untuk tiap user. Lalu <b>DROP TABLE</b> membuang seluruh tabel, berikut semua isinya. CREATE, ALTER, dan DROP itu trio DDL.',
		'Sekarang barisnya. <b>INSERT</b> memasukkan satu baris baru, satu untuk tiap orang yang daftar. Perintah yang mengurus isi barisnya namanya <b>DML</b> (Data Manipulation Language).',
		'DML punya tiga teman lagi. <b>SELECT</b> membaca baris, <b>UPDATE</b> mengubah nilai, dan <b>DELETE</b> menghapus baris. Perhatikan, bentuk tabelnya nggak berubah sama sekali, cuma isinya.',
		'Nggak semua orang boleh menyentuh semuanya. <b>GRANT</b> memberi izin, misalnya Dina dari tim support boleh membaca data user. <b>REVOKE</b> mencabutnya lagi. Dua ini namanya <b>DCL</b> (Data Control Language), kuncinya database.',
		'Tinggal satu keluarga kecil, <b>TCL</b>. <b>COMMIT</b> bikin sekumpulan perubahan jadi permanen dan <b>ROLLBACK</b> membatalkannya, jadi langkah langkahnya terjadi barengan atau nggak sama sekali. Nanti kamu lihat lebih dekat di [[transaksi|web/transaction]].',
		'[ingat] Bayangkan lemari. <b>DDL</b> membangun lemarinya, <b>DML</b> memasukkan dan mengeluarkan barang, <b>DCL</b> membagikan kunci, dan <b>TCL</b> bilang oke, simpan. Bentuk, isi, kunci, simpan.',
		'[fyi] Penghapus besar itu harus dihormati. <b>DELETE</b> tanpa WHERE mengosongkan semua baris, dan <b>DROP</b> bikin seluruh tabel lenyap. Makanya di tim beneran, izin DROP cuma dikasih ke sedikit orang.'
	],
	reactions: {},
	panels: [
		{
			tag: 'Keluarga',
			title: 'Empat jenis perintah',
			body: 'Perintah SQL dikelompokkan dari apa yang disentuh. <b>Bentuk</b> tabel, <b>isi</b> barisnya, <b>kunci</b> (siapa boleh pakai), dan kapan perubahan <b>disimpan</b>.'
		},
		{
			tag: 'DDL',
			title: 'Bangun bentuknya',
			body: 'CREATE TABLE memberi nama tabel dan kolomnya. Tiap kolom punya tipe, misalnya angka bulat (INT) atau teks (TEXT).'
		},
		{
			tag: 'DDL',
			title: 'Ubah bentuknya',
			body: 'ALTER menambah, mengganti nama, atau menghapus kolom. DROP menghapus tabelnya sendiri, dan nggak ada tombol undo.'
		},
		{
			tag: 'DML',
			title: 'Tambah baris',
			body: 'INSERT menambah satu baris baru. Kolomnya tetap sama persis, tabelnya cuma jadi satu baris lebih panjang.'
		},
		{
			tag: 'DML',
			title: 'Baca, ubah, hapus',
			body: 'SELECT membaca, UPDATE mengubah nilai, dan DELETE menghapus baris. <b>WHERE</b> memilih baris mana yang kena.'
		},
		{
			tag: 'DCL',
			title: 'Siapa boleh apa',
			body: 'GRANT memberi izin ke sebuah akun, REVOKE mencabutnya. Aplikasi web boleh menambah dan membaca user, sedangkan Dina cuma boleh melihat kalau lagi perlu.'
		},
		{
			tag: 'TCL',
			title: 'Simpan atau batal',
			body: 'Perubahan di antara <b>BEGIN</b> dan <b>COMMIT</b> disimpan barengan. Sebelum COMMIT, perubahannya belum final, dan ROLLBACK bisa membuangnya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Bentuk, isi, kunci, simpan',
			body: 'DDL itu lemarinya, DML itu isinya, DCL itu kuncinya, dan TCL itu tombol selesai.'
		},
		{
			tag: 'Hati hati',
			title: 'Penghapus besar',
			body: 'DELETE tanpa WHERE menghapus semua baris tapi tabelnya tetap ada. DROP ikut menghapus tabelnya. Baca dua kali sebelum menjalankannya.'
		}
	],
	tableName: 'users',
	columns: { id: 'id', name: 'name', email: 'email', city: 'city' },
	users: [
		{ id: 1, name: 'Adi', email: 'adi@nimbus.com', city: 'Solo' },
		{ id: 2, name: 'Bima', email: 'bima@nimbus.com', city: 'Bogor' },
		{ id: 3, name: 'Citra', email: 'citra@nimbus.com', city: 'Medan' }
	],
	newCity: 'Bali',
	familyWords: { ddl: 'bentuk', dml: 'isi', dcl: 'kunci', tcl: 'simpan' },
	familyNames: {
		ddl: 'Data Definition',
		dml: 'Data Manipulation',
		dcl: 'Data Control',
		tcl: 'Transaction Control'
	},
	fileName: 'query.sql',
	noTable: 'Belum ada tabel',
	noRows: 'Belum ada baris',
	dropped: 'Tabelnya sudah hilang',
	appLabel: 'Aplikasi web',
	staffLabel: 'Dina dari support',
	staffUser: 'dina',
	accessLabel: 'Boleh di users',
	pending: 'belum disimpan',
	saved: 'tersimpan',
	cheatLabel: 'Empat keluarga',
	rule: 'DDL membangun bentuk, DML mengisi baris, DCL membagi kunci, TCL menyimpan.'
};
