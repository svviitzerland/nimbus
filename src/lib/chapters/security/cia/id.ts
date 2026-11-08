import type { CiaText } from './types';

export const id: CiaText = {
	title: 'CIA triad',
	intro: [
		'Bayangkan buku harianmu. Ada tiga hal buruk yang bisa menimpanya. Ada yang membacanya, ada yang diam diam menulis ulang satu halaman, atau bukunya hilang tepat waktu kamu butuh.',
		'Orang keamanan memberi nama untuk ketiganya. <b>Confidentiality</b> (kerahasiaan) artinya cuma orang yang berhak yang bisa membaca. <b>Integrity</b> (keutuhan) artinya nggak ada yang mengubahnya diam diam. <b>Availability</b> (ketersediaan) artinya datanya ada waktu dibutuhkan. Huruf depannya digabung jadi <b>CIA triad</b> (nggak ada hubungannya sama badan intelijen Amerika).',
		'Buat nimbus.com bentuknya begini. Data pelanggan tetap rahasia, harga dan pesanan tetap persis seperti yang diatur, dan toko tetap buka waktu ada promo besar.',
		'[fyi] Hampir semua alat keamanan yang nanti kamu temui menjaga minimal satu huruf. [[Identity and Access|networking/iam]] dan enkripsi menjaga C, tanda tangan digital menjaga I, backup dan server cadangan menjaga A.',
		'Kadang menjaga satu huruf malah merugikan huruf lain. Kalau dikunci terlalu ketat, pemiliknya sendiri pun nggak bisa masuk, jadi C menang tapi A kalah. Keamanan yang baik itu soal keseimbangan.',
		'[ingat] Tiga janji buat setiap data, <b>Rahasia, Utuh, Tersedia.</b> Rahasia itu C, utuh itu I, tersedia itu A. Kalau ada kejadian, tanya aja, datanya dibaca orang, diubah orang, atau nggak bisa dibuka?',
		'Nih ada setumpuk potongan berita, sebagian dari dunia nyata dan sebagian dari nimbus.com. Baca satu satu, lalu taruh di huruf yang dilanggar.'
	],
	reactions: {
		yahoo:
			'Betul, Confidentiality. Tahun 2013 penyerang menyalin data dari ketiga miliar akun Yahoo, nama, email, tanggal lahir, dan hash password lama. Yahoo baru mengumumkannya tahun 2016 dan 2017. Nggak ada yang diubah atau dimatikan, datanya cuma dibaca orang yang salah.',
		laptop:
			'Confidentiality lagi. Nggak ada yang membobol dan nggak ada yang diubah, tapi siapa pun yang memungut laptop itu bisa membaca daftar pelanggan. Kalau disknya dienkripsi, isinya tetap nggak bisa dibaca.',
		ap: 'Integrity. April 2013 seseorang mengambil alih akun Twitter kantor berita Associated Press dan memposting kabar palsu soal ledakan di Gedung Putih. Saham Amerika sempat anjlok beberapa menit sebelum semua sadar itu bohong. Akunnya asli, pesannya palsu.',
		price:
			'Integrity. Harga diubah tanpa izin sehingga nimbus.com menampilkan harga satu rupiah. Masalah utamanya adalah keutuhan data.',
		dyn: 'Availability. Oktober 2016 sebuah botnet bernama Mirai, pasukan kamera dan router rumahan yang sudah dibajak, membanjiri Dyn, perusahaan yang menjalankan DNS (buku telepon internet). Twitter, Netflix, dan Spotify nggak bisa dibuka berjam jam di sebagian dunia. Nggak ada data yang dicuri, pintunya cuma macet.',
		power:
			'Availability, bahkan tanpa penyerang. Listrik padam pun tetap bikin pelanggan nggak bisa masuk toko. Makanya situs serius selalu punya server cadangan di tempat lain.',
		miss: 'Hmm, bukan yang itu. Coba tanya dirimu, datanya dibaca orang, diubah orang, atau jadi nggak bisa dijangkau?'
	},
	buckets: {
		c: { name: 'Confidentiality', sub: 'dibaca orang yang salah' },
		i: { name: 'Integrity', sub: 'diubah tanpa izin' },
		a: { name: 'Availability', sub: 'nggak bisa dijangkau' }
	},
	pickHint: 'Huruf mana yang dilanggar? Ketuk hurufnya.',
	cards: {
		yahoo: { tag: 'Yahoo, 2013', head: 'Data dari tiga miliar akun disalin penyerang' },
		laptop: {
			tag: 'nimbus.com',
			head: 'Laptop karyawan berisi daftar pelanggan ketinggalan di kereta'
		},
		ap: {
			tag: 'Associated Press, 2013',
			head: 'Tweet palsu soal Gedung Putih bikin pasar saham goyang'
		},
		price: { tag: 'nimbus.com', head: 'Seseorang mengubah semua harga di database jadi Rp 1' },
		dyn: { tag: 'Dyn, 2016', head: 'Situs situs besar padam dibanjiri lalu lintas sampah' },
		power: { tag: 'nimbus.com', head: 'Satu satunya server mati listrik di hari pertama promo' }
	},
	progress: '{n} dari {total} sudah dipilah',
	missTag: 'bukan ini',
	allDone: 'Beres semua. Tiap kejadian melanggar minimal satu huruf.',
	again: 'Pilah lagi dari awal'
};
