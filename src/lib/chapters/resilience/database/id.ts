import type { DatabaseText } from '../types';

export const id: DatabaseText = {
	title: 'SQL atau NoSQL?',
	intro: [
		'Data yang sering dipakai biasanya tinggal di sebuah database. Ada dua keluarga besar, dan keduanya menyimpan data dengan cara yang sangat berbeda.',
		'<b>SQL</b> menata data dalam tabel berisi baris dan kolom. Aturannya ketat, semua baris wajib mengikuti kolom yang sama, dan antar tabel bisa saling terhubung. Karena serapi itu, SQL jadi andalan buat transaksi yang wajib konsisten, misalnya transfer uang.',
		'<b>NoSQL</b> menyimpan dokumen yang bentuknya bebas. Satu dokumen boleh punya isian yang beda dari tetangganya, dan kumpulan dokumennya gampang melar ke banyak mesin saat datanya membludak.',
		'Dua duanya sudah terisi beberapa data. Tambahkan sendiri baris dan dokumen barunya, dan rasakan bedanya tabel yang ketat dengan dokumen yang lentur.',
		'[ingat] Database menyimpan data agar bisa dicari dan diubah dengan aturan yang jelas.'
	],
	reactions: {
		sql: 'Lihat, baris baru wajib ngikut kolom yang sudah ada, id, nama, saldo, tidak boleh kurang atau nambah sendiri. Ketat begini cocok buat urusan uang, datanya selalu rapi dan gampang dicek.',
		nosql:
			'Yang ini jauh lebih santai. Dokumen baru bentuknya beda sendiri pun tetap diterima. Kebebasan ini yang bikin NoSQL enak buat data yang beraneka ragam dan gampang dilebarkan ke banyak mesin.'
	},
	sqlTitle: 'SQL',
	sqlSub: 'Data relasional dalam tabel',
	nosqlTitle: 'NoSQL',
	nosqlSub: 'Contoh database dokumen',
	tableName: 'akun',
	columns: ['id', 'nama', 'saldo'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	extraRows: [
		['3', 'Sari', '40000'],
		['4', 'Tono', '67000']
	],
	addRow: 'Tambah baris',
	schemaNote: 'baris baru wajib ikut kolom yang sama',
	docs: [
		{ name: 'post_1', fields: ['penulis', 'teks', 'suka'] },
		{ name: 'post_2', fields: ['penulis', 'video', 'durasi'] },
		{ name: 'post_3', fields: ['penulis', 'polling', 'pilihan', 'batas'] }
	],
	addDoc: 'Tambah dokumen',
	freeNote: 'tiap dokumen boleh beda bentuk',
	whenTitle: 'Kapan dipakai',
	sqlWhen: ['Uang & transaksi', 'Toko online', 'Data yang saling terkait'],
	nosqlWhen: ['Feed media sosial', 'Katalog beraneka bentuk', 'Data dengan struktur bervariasi'],
	done: 'Kedua contoh sudah dicoba'
};
