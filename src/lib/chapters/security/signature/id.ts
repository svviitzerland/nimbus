import type { SignatureText } from './types';

export const id: SignatureText = {
	title: 'Tanda tangan digital',
	intro: [
		'HP kamu terus memperbarui aplikasinya, sering malah waktu kamu tidur. Tapi gimana dia tahu update itu benar dari pembuat aplikasinya, dan nggak ada yang menyelipkan sesuatu yang jahat di tengah jalan?',
		'Di atas kertas, kamu tanda tangan pakai pulpen. <b>Tanda tangan digital</b> melakukan tugas yang sama untuk file, cuma jauh lebih susah dipalsukan. Dasarnya [[kunci publik dan privat|security/keys]] yang sudah kamu kenal.',
		'Ingat gemboknya? Siapa pun bisa mengunci, cuma kunci privat yang bisa membuka. Tanda tangan membalik cara itu. Cuma <b>kunci privat</b> yang bisa membuat tanda tangan, dan siapa pun yang punya <b>kunci publik</b> bisa memeriksanya.',
		'[ingat] Tanda tangan itu <b>cuma aku yang bisa nulis, semua orang bisa ngecek</b>. Persis kayak paraf kamu, bedanya yang ini nggak bisa ditiru siapa pun.',
		'Pertama, file dikasih <b>sidik jari</b>, kode pendek yang dihitung dari tiap huruf di dalamnya (nama aslinya <b>hash</b>, lebih lengkap di [[hashing|security/hashing]]). Lihat, satu huruf saja berubah, seluruh sidik jarinya ikut berubah.',
		'Developer nimbus.com mengambil sidik jari itu dan menguncinya pakai kunci privatnya. Sidik jari yang terkunci itulah <b>tanda tangan</b>, dan dia ikut jalan bersama file seperti segel lilin.',
		'HP kamu membuka segel itu pakai kunci publik dan membaca sidik jari di dalamnya. Lalu dia menghitung sendiri sidik jari file yang dia terima. Sidik jarinya sama? Berarti filenya utuh dan benar dari nimbus.com, jadi langsung dipasang.',
		'Sekarang ada penyerang di tengah yang menyelipkan satu baris ke dalam update. Dia nggak bisa membuat segel baru, karena nggak punya kunci privatnya. HP kamu menghitung sidik jarinya, hasilnya nggak cocok lagi, dan updatenya diblokir.',
		'[fyi] Kamu mengandalkan ini tiap hari. App store, update Windows dan Android, juga [[sertifikat di balik HTTPS|security/tls]] semuanya diperiksa pakai tanda tangan. Banyak negara, termasuk Indonesia, juga mengakui tanda tangan digital tersertifikasi di kontrak, sama sahnya dengan tinta.',
		'Kalau mau, biarkan penyerangnya iseng atau suruh dia diam, lalu lihat HP kamu memutuskan sendiri.'
	],
	reactions: {
		clean:
			'Utuh. Sidik jari di dalam segel dan sidik jari filenya cocok, jadi HP kamu memasangnya.',
		tampered:
			'Diutak atik. Satu baris yang berubah bikin sidik jarinya beda total, segelnya nggak cocok lagi, dan HP kamu menolak.'
	},
	steps: [
		{
			tag: 'Pertanyaannya',
			title: 'Update ini asli nggak?',
			body: 'Update bisa menjalankan apa saja di HP kamu. Sebelum dipasang, HP perlu tahu <b>siapa</b> yang membuatnya dan bahwa <b>nggak ada yang berubah</b> di jalan.'
		},
		{
			tag: 'Pulpen dan kertas',
			title: 'Tanda tangan digital',
			body: 'Mirip tanda tangan di surat, tapi dibuat dengan matematika, jadi nggak bisa dijiplak atau ditempel ke file lain.'
		},
		{
			tag: 'Kunci dibalik',
			title: 'Privat menulis, publik memeriksa',
			body: '<b>Kunci privat</b> tetap di developer dan dipakai membuat tanda tangan. <b>Kunci publik</b> ada di tiap HP dan dipakai memeriksanya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Cuma aku nulis, semua ngecek',
			body: 'Membuat tanda tangan butuh kunci privat. Memeriksanya cukup pakai kunci publik, yang boleh dimiliki siapa saja.'
		},
		{
			tag: 'Sidik jari',
			title: 'Hash',
			body: 'Kode pendek yang dihitung dari seluruh file. File sama, sidik jari sama. Ubah satu huruf, hasilnya beda total.'
		},
		{
			tag: 'Menandatangani',
			title: 'Kunci sidik jarinya',
			body: 'Sidik jari yang dikunci pakai kunci privat jadilah <b>tanda tangan</b>. Dia ikut jalan bersama file.'
		},
		{
			tag: 'Memeriksa',
			title: 'Bandingkan dua sidik jari',
			body: 'Satu dari segel, dibuka pakai kunci publik. Satu lagi dihitung langsung dari file. Kalau cocok, pasang.'
		},
		{
			tag: 'Diutak atik',
			title: 'Pemeriksaan gagal',
			body: 'Penyerang mengubah file tapi nggak bisa membuat ulang segelnya. Dua sidik jarinya beda, jadi HP menolak.'
		},
		{
			tag: 'Di mana mana',
			title: 'Dipakai tiap hari',
			body: 'Update aplikasi, update sistem, sertifikat HTTPS, sampai kontrak. Idenya selalu sama.'
		},
		{
			tag: 'Opsional',
			title: 'Kamu yang atur',
			body: 'Biarkan penyerangnya iseng atau nggak, lalu lihat sidik jari mana yang keluar.'
		}
	],
	devLabel: 'Developer nimbus.com',
	userLabel: 'HP kamu',
	attackerLabel: 'Penyerang',
	fileName: 'update.zip',
	lines: ['aplikasi nimbus 2.1', 'tambah mode gelap', 'simpan ke nimbus.com'],
	oneLetter: 'tambah mode gelas',
	tampered: 'kirim semua password',
	privateKey: 'kunci privat',
	publicKey: 'kunci publik',
	rule: 'cuma aku yang bisa nulis, semua orang bisa ngecek',
	penLabel: 'pulpen di kertas',
	digitalLabel: 'file bertanda tangan',
	fingerprintLabel: 'sidik jari',
	check: {
		fromSig: 'di segel',
		fromFile: 'dari file',
		ok: 'cocok, dipasang',
		bad: 'nggak cocok, diblokir'
	},
	toggle: { label: 'Penyerangnya', clean: 'Diam saja', tampered: 'Menyelipkan baris' }
};
