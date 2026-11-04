import type { BlockchainText } from './types';

export const id: BlockchainText = {
	title: 'Blockchain',
	intro: [
		'Bayangkan buku catatan siapa bayar siapa, yang dipegang satu kampung, bukan satu petugas bank. Semua orang punya salinannya, siapa pun bisa mengecek, dan nggak ada yang bisa diam diam menulis ulang halaman lama. Itulah ide di balik <b>blockchain</b>.',
		'Tiap halaman adalah <b>blok</b> yang berisi beberapa catatan. Tiap blok juga punya <b>sidik jari</b>, kode pendek yang dihitung dari seluruh isinya (hash, seperti di [[tanda tangan digital|security/signature]]). Ubah apa pun di dalamnya, sidik jarinya berubah total.',
		'Ini triknya. Tiap blok juga mencatat sidik jari blok <b>sebelumnya</b>. Jadi blok blok itu saling bergantung seperti mata rantai, terus sampai ke blok pertama.',
		'Sekarang lihat ada yang diam diam mengubah nominal lama, 5 jadi 50. Blok itu dapat sidik jari baru, padahal blok berikutnya masih ingat yang lama. Rantainya putus, dan semua orang bisa melihatnya.',
		'[ingat] <b>Ubah satu halaman lama, semua halaman sesudahnya harus ditulis ulang.</b> Buat menyembunyikan editannya, si curang harus mengulang semua blok sesudahnya, dan justru itu yang dibuat susah.',
		'Dan ini bukan satu buku, tapi ribuan salinan. Salinanmu yang diedit nggak cocok dengan yang lain, jadi jaringan mengabaikannya. Versi yang disepakati kebanyakan komputer yang menang.',
		'Ide ini lebih tua dari dugaanmu. Tahun 1991, Stuart Haber dan W. Scott Stornetta merangkai dokumen pakai sidik jari supaya tanggalnya nggak bisa dimundurkan. Tahun 2008, seseorang yang menyebut dirinya <b>Satoshi Nakamoto</b> menambahkan <b>mining</b>, di mana komputer harus mencoba angka satu per satu sampai sidik jarinya diawali nol, lalu lahirlah <b>Bitcoin</b> (jalan Januari 2009). Siapa Satoshi sebenarnya, sampai sekarang nggak ada yang tahu.',
		'[fyi] Trik sama, dunia beda. [[Git|compute/version-control]] menyambung tiap commit ke sidik jari commit sebelumnya, jadi commit lama yang diam diam diubah juga langsung ketahuan. Bedanya, Git nggak punya koin dan nggak ada mining.',
		'Jujur saja ya. Blockchain itu lambat dan mahal dibanding database biasa. Dia cuma berguna kalau banyak pihak butuh catatan bersama dan nggak percaya satu penjaga pun. Banyak proyek "taruh saja di blockchain" yang akhirnya tutup diam diam, karena database biasa sebenarnya sudah cukup.',
		'Kalau mau, ubah sendiri nominal di blok 2 dan lihat rantainya putus, lalu kembalikan lagi.'
	],
	reactions: {
		broken:
			'Putus. Blok 2 dapat sidik jari baru, blok 3 masih ingat yang lama, jadi rantainya putus persis di situ dan semua orang bisa lihat.',
		restored: 'Balik ke 5. Sidik jarinya sama seperti semula, dan seluruh rantai nyambung lagi.'
	},
	steps: [
		{
			tag: 'Idenya',
			title: 'Buku catatan bersama',
			body: 'Satu catatan siapa bayar siapa, disalin ke banyak orang, bukan disimpan satu petugas.'
		},
		{
			tag: 'Satu halaman',
			title: 'Blok dan sidik jari',
			body: '<b>Blok</b> berisi beberapa catatan. <b>Sidik jarinya</b> dihitung dari seluruh isinya.'
		},
		{
			tag: 'Rantainya',
			title: 'Tiap blok menunjuk ke belakang',
			body: 'Tiap blok menyimpan sidik jari blok sebelumnya. Sidik jari yang disimpan itulah mata rantainya.'
		},
		{
			tag: 'Diutak atik',
			title: 'Rantainya putus',
			body: 'Edit blok lama, sidik jarinya berubah. Blok berikutnya nggak cocok lagi, jadi editannya langsung kelihatan.'
		},
		{
			tag: 'Biar nempel',
			title: 'Satu diedit, semua diulang',
			body: 'Menyembunyikan perubahan berarti mengulang <b>semua</b> blok sesudahnya. Makin tua bloknya, makin banyak kerjanya.'
		},
		{
			tag: 'Banyak salinan',
			title: 'Suara terbanyak menang',
			body: 'Ribuan komputer menyimpan salinan. Satu salinan yang beda sendiri langsung diabaikan.'
		},
		{
			tag: '1991 sampai 2009',
			title: 'Mining dan Bitcoin',
			body: 'Buat menambah blok, komputer mengganti satu angka (<b>nonce</b>) terus menerus sampai sidik jarinya diawali nol. Sengaja dibuat lambat, supaya mengulang sejarah mahalnya bukan main.'
		},
		{
			tag: 'Trik sama',
			title: 'Git juga begitu',
			body: 'Tiap commit Git menyimpan sidik jari commit sebelumnya. Rantai blok, tanpa koin.'
		},
		{
			tag: 'Jujur saja',
			title: 'Bukan buat semua hal',
			body: 'Lambat dan mahal. Cuma sepadan kalau banyak pihak berbagi catatan dan nggak percaya satu penjaga.'
		},
		{
			tag: 'Opsional',
			title: 'Edit sendiri',
			body: 'Ubah nominal di blok 2 dan lihat mata rantai mana yang putus. Lalu kembalikan.'
		}
	],
	blockLabel: 'Blok {n}',
	commitLabel: 'Commit {n}',
	records: ['Halaman awal', 'Ana bayar Budi 5', 'Budi bayar Cici 2', 'Cici bayar Dodi 1'],
	edited: 'Ana bayar Budi 50',
	prevLabel: 'sebelum',
	hashLabel: 'milikku',
	redoTag: 'harus diulang',
	brokenTag: 'nggak cocok',
	nonceLabel: 'nonce',
	yourCopy: 'salinanmu',
	computer: 'salinan {n}',
	rule: 'ubah satu halaman, tulis ulang semua sesudahnya',
	editBtn: 'Ubah 5 jadi 50 di blok 2',
	restoreBtn: 'Kembalikan ke 5'
};
