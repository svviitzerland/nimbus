import type { DbIndexText } from './types';

export const id: DbIndexText = {
	title: 'Index database',
	intro: [
		'Toko nimbus.com terus berkembang. Suatu hari tabel penggunanya berisi <b>sejuta</b> orang, dan tiap kali ada yang login, database harus mencari satu email di antara semuanya.',
		'Kalau dibiarkan, database pakai cara lambat. Dia mulai dari baris pertama dan ngecek satu per satu sampai ketemu. Namanya <b>full table scan</b>, kayak nyari satu kata dengan baca buku dari halaman satu.',
		'Buku sudah lama punya solusinya, <b>indeks</b> di halaman belakang. Kata katanya urut abjad, masing masing dengan nomor halamannya. Kamu loncat ke huruf yang pas, temukan katanya, terus langsung ke halamannya.',
		'<b>Index database</b> pakai trik yang sama. Database menyimpan salinan satu kolom yang sudah diurutkan (di sini emailnya), dan tiap entri menunjuk ke barisnya. Karena urut, pencarian bisa langsung loncat ke tengah dan buang separuh daftar di tiap loncatan.',
		'Sekarang adu mereka di sejuta baris. Scan merayap lewat ratusan ribu baris, sementara index cuma butuh sekitar 20 loncatan. Itu bedanya login yang terasa instan dan login yang bikin orang mencet tombolnya dua kali.',
		'[ingat] Index database itu persis indeks di belakang buku. Langsung loncat ke katanya, jangan baca dari halaman satu. Bonusnya, tiap kali tabelnya jadi dua kali lipat, index cuma butuh <b>satu</b> loncatan tambahan.',
		'[fyi] Index itu nggak gratis. Tiap pengguna baru juga harus diselipkan ke index, jadi menyimpan data sedikit lebih lambat, dan index makan ruang disk tambahan. Makanya yang dikasih index cuma kolom yang sering dicari, bukan semua kolom.',
		'Kalau penasaran, coba ubah ukuran tabelnya dan tonton balapannya lagi. Ini opsional kok.'
	],
	reactions: {
		small:
			'Seribu baris, dua duanya selesai sekejap. Buat tabel kecil, index hampir nggak ada bedanya.',
		mid: 'Seratus ribu baris. Scan mulai kelamaan, index cuma butuh 17 loncatan.',
		big: 'Sejuta baris, scan membaca ratusan ribu baris, index sekitar 20 loncatan.',
		huge: 'Seratus juta baris, dan index masih butuh kurang dari 30 loncatan. Begitulah aplikasi raksasa tetap cepat.'
	},
	panels: [
		{
			tag: 'Tabelnya',
			title: 'Sejuta baris',
			body: 'Tiap kotak mewakili segerombol baris di tabel <b>pengguna</b>. Di dalamnya ada satu email yang kita cari.'
		},
		{
			tag: 'Full table scan',
			title: 'Satu baris demi satu',
			body: 'Tanpa bantuan, database membaca baris secara berurutan dan membandingkan satu per satu. Makin besar tabelnya, makin lama.'
		},
		{
			tag: 'Indeks buku',
			title: 'Kata urut, nomor halaman',
			body: 'Karena katanya urut abjad, kamu bisa menemukannya dalam hitungan detik, dan nomor halamannya langsung mengantar kamu ke sana.'
		},
		{
			tag: 'Index database',
			title: 'Potong daftarnya jadi dua',
			body: 'Lihat entri di tengah. Masih kecepetan di abjad? Buang separuh awal. Ulangi, dan daftarnya menyusut cepat banget.'
		},
		{
			tag: 'Balapan',
			title: 'Scan lawan index',
			body: 'Dua duanya mencari email yang sama di tabel yang sama. Yang satu baca baris demi baris, yang lain langsung loncat ke sana.'
		},
		{
			tag: 'Cara ingat',
			title: 'Halaman belakang buku',
			body: 'Loncat, jangan baca. Baris dua kali lipat cuma bikin index nambah satu loncatan, jadi tetap cepat walau tabelnya raksasa.'
		},
		{
			tag: 'Coba',
			title: 'Ubah ukurannya',
			body: 'Tiap kali ditekan, jumlah baris di tabel berubah dan balapannya diulang.'
		}
	],
	locale: 'id-ID',
	tableName: 'pengguna',
	target: 'sari@nimbus.com',
	gridNote: 'tiap kotak itu banyak baris',
	rowsChecked: '{n} baris dicek',
	steps: '{n} loncatan',
	found: 'ketemu',
	bookTitle: 'Indeks',
	bookEntries: [
		{ word: 'browser', page: 12 },
		{ word: 'cache', page: 27 },
		{ word: 'database', page: 42 },
		{ word: 'email', page: 58 },
		{ word: 'server', page: 73 },
		{ word: 'tabel', page: 91 }
	],
	bookWord: 'database',
	pageLabel: 'halaman {n}',
	sortedLabel: 'email yang sudah urut',
	emails: [
		'adi@nimbus.com',
		'bima@nimbus.com',
		'citra@nimbus.com',
		'dewi@nimbus.com',
		'eko@nimbus.com',
		'gita@nimbus.com',
		'rudi@nimbus.com',
		'sari@nimbus.com'
	],
	hop: 'loncatan {n}',
	pointsTo: 'menunjuk ke baris {n}',
	scanLane: 'Tanpa index',
	indexLane: 'Pakai index',
	sizes: ['seribu', 'seratus ribu', 'sejuta', 'seratus juta'],
	sizeLine: '{size} baris',
	rule: 'Baris dua kali lipat, cuma nambah satu loncatan.',
	grow: 'Ubah ukuran tabel'
};
