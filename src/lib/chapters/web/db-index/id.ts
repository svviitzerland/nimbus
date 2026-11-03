import type { DbIndexText } from './types';

export const id: DbIndexText = {
	title: 'Index database',
	intro: [
		'Toko nimbus.com terus berkembang. Suatu hari tabel pengguna isinya sejuta orang, dan tiap kali ada yang login, database harus nyari satu email di antara mereka semua.',
		'Kalau dibiarkan, database nyarinya dengan cara yang lambat. Dia mulai dari baris pertama dan ngecek satu satu sampai ketemu yang cocok. Itu namanya <b>full table scan</b>, kayak nyari satu kata dengan membaca seluruh buku dari halaman pertama.',
		'Buku sudah lama punya solusinya, yaitu <b>indeks</b> di halaman belakang. Kata kata disusun urut abjad, lengkap dengan nomor halamannya. Kamu loncat ke huruf yang pas, temukan katanya, terus langsung buka halamannya.',
		'<b>Index database</b> pakai trik yang sama. Database menyimpan salinan urut dari satu kolom (di sini emailnya) dalam struktur berbentuk pohon, tiap entri nunjuk ke barisnya. Buat nyari satu email, dia terus membelah pencariannya jadi dua, jadi sejuta baris cuma butuh sekitar 20 langkah.',
		'[fyi] Index itu nggak gratis. Tiap pengguna baru juga harus diselipkan ke indexnya, jadi nyimpan data jadi sedikit lebih lambat, dan indexnya makan ruang disk tambahan. Makanya yang dikasih index cuma kolom yang sering dipakai buat nyari, bukan semua kolom.',
		'Giliran kamu. Ini dua salinan tabel pengguna yang sama, satu tanpa index dan satu pakai index. Adu balap keduanya, terus geser tabelnya jadi lebih besar dan balapan lagi.'
	],
	reactions: {
		small:
			'Dengan seribu baris, dua duanya selesai sekejap. Buat tabel sekecil ini index hampir nggak ngaruh, komputer bisa baca seribu baris lebih cepat dari kedipan mata. Coba besarkan tabelnya.',
		mid: 'Nah, mulai kelihatan bedanya. Yang tanpa index ngecek puluhan ribu baris, sementara index cuma butuh sekitar 17 loncatan. Lanjut lagi.',
		big: 'Sejuta baris. Yang tanpa index harus baca ratusan ribu baris, index cukup sekitar 20. Selisih inilah bedanya login yang terasa instan dengan login yang bikin orang mencet tombolnya lagi.',
		huge: 'Seratus juta baris, dan index masih butuh kurang dari 30 langkah. Tiap kali tabelnya jadi dua kali lipat, index cuma nambah satu langkah. Begitulah aplikasi raksasa tetap kencang.'
	},
	locale: 'id-ID',
	tableName: 'pengguna',
	emailCol: 'email',
	target: 'sari@nimbus.com',
	sizeLabel: 'Jumlah baris di tabel',
	sizes: ['1 ribu', '100 ribu', '1 juta', '100 juta'],
	scanLane: 'Tanpa index',
	scanSub: 'ngecek baris satu per satu',
	indexLane: 'Pakai index',
	indexSub: 'membelah pencarian jadi dua tiap loncat',
	checked: '{n} baris dicek',
	foundTag: 'ketemu',
	raceBtn: 'Mulai balapan',
	againBtn: 'Balapan lagi',
	fasterBy: 'Index ngecek {x} kali lebih sedikit baris',
	tie: 'Di ukuran ini dua duanya selesai kurang dari satu milidetik',
	idle: 'Dua jalur ini nyari email yang sama'
};
