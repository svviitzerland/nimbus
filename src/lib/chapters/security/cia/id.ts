import type { CiaText } from './types';

export const id: CiaText = {
	title: 'CIA triad',
	intro: [
		'Bayangkan buku harianmu. Ada tiga hal buruk yang bisa menimpanya. Ada yang membacanya, ada yang diam diam menulis ulang satu halaman, atau bukunya hilang pas kamu butuh. Semua data di dunia, dari chat kamu sampai saldo bank, bisa kena tiga hal yang sama.',
		'Hal buruk pertama, orang asing membacanya. Menjaga data dari mata yang salah namanya <b>Confidentiality</b> (kerahasiaan). Cuma orang yang berhak yang boleh membaca.',
		'Yang kedua, editan diam diam. Lihat pensilnya mengubah 500 ribu jadi 5 ribu. Memastikan nggak ada yang mengubah data di belakangmu namanya <b>Integrity</b> (keutuhan).',
		'Yang ketiga, bukunya nggak ada waktu kamu mau buka. Memastikan data bisa dijangkau kapan pun dibutuhkan namanya <b>Availability</b> (ketersediaan). Huruf depan ketiganya digabung jadi <b>CIA triad</b> (nggak ada hubungannya sama badan intelijen Amerika).',
		'[ingat] Tiga janji buat setiap data, <b>Rahasia, Utuh, Tersedia.</b> Rahasia itu C, utuh itu I, tersedia itu A. Kalau ada kejadian, tanya aja, datanya dibaca orang, diubah orang, atau nggak bisa dibuka?',
		'Sekarang cerita nyata. Tahun 2013 penyerang menyalin data dari ketiga miliar akun Yahoo, nama, email, tanggal lahir, dan password yang sudah diacak. Nggak ada yang diubah, nggak ada yang mati. Datanya cuma dibaca orang yang salah, jadi C yang jebol. Yahoo baru mengumumkannya tahun 2016 dan 2017.',
		'April 2013 seseorang mengambil alih akun Twitter Associated Press, kantor berita besar, lalu memposting kabar palsu soal ledakan di Gedung Putih. Harga saham di Amerika sempat turun beberapa menit sebelum semua sadar itu bohong. Akunnya asli, pesannya palsu, jadi I yang jebol.',
		'Oktober 2016 sebuah botnet bernama Mirai, pasukan kamera dan router rumahan yang dibobol, membanjiri perusahaan Dyn dengan lalu lintas sampah. Dyn menjalankan DNS, buku teleponnya internet, jadi Twitter, Netflix, dan Spotify nggak bisa dibuka berjam jam di sebagian dunia. Nggak ada yang dicuri, pintunya cuma macet, jadi A yang jebol.',
		'[fyi] Hampir semua alat keamanan yang nanti kamu temui menjaga salah satu huruf. [[Identity and Access|networking/iam]] dan enkripsi menjaga C, tanda tangan digital menjaga I, backup dan server cadangan menjaga A.',
		'Satu lagi. Menjaga satu huruf bisa merugikan huruf lain. Kalau buku harian dikunci terlalu ketat, kamu sendiri pun nggak bisa buka, jadi C menang tapi A kalah. Keamanan yang baik itu soal keseimbangan. Mau lihat ceritanya lagi? Pencet satu huruf.'
	],
	reactions: {
		c: 'C, Confidentiality. Tanya dirimu, apa datanya dibaca orang yang salah? Itu Yahoo, tiga miliar akun dibaca orang asing sementara semuanya tetap jalan.',
		i: 'I, Integrity. Tanya dirimu, apa datanya diubah tanpa izin? Itu tweet palsu AP, akun asli yang membawa pesan bohong.',
		a: 'A, Availability. Tanya dirimu, apa orang bisa menjangkaunya? Itu Dyn, nggak ada yang dicuri, cuma pintunya macet kebanjiran lalu lintas sampah.'
	},
	steps: [
		{
			tag: 'Data',
			title: 'Kayak buku harian',
			body: 'Semua data, chat, foto, saldo bank, bisa <b>dibaca</b>, <b>diubah</b>, atau <b>hilang</b>. Keamanan menjaga dari ketiganya.'
		},
		{
			tag: 'C',
			title: 'Confidentiality',
			body: 'Cuma orang yang berhak yang bisa membaca. Jebol kalau orang asing <b>membaca</b> yang harusnya rahasia.'
		},
		{
			tag: 'I',
			title: 'Integrity',
			body: 'Data tetap persis seperti yang diatur. Jebol kalau ada yang <b>mengubahnya</b> tanpa izin.'
		},
		{
			tag: 'A',
			title: 'Availability',
			body: 'Data ada waktu kamu butuh. Jebol kalau nggak ada yang bisa <b>menjangkaunya</b>, walau nggak ada yang dicuri.'
		},
		{
			tag: 'Biar nempel',
			title: 'Rahasia, Utuh, Tersedia',
			body: 'Tiga janji. <b>C</b> bikin rahasia, <b>I</b> bikin utuh, <b>A</b> bikin tersedia.'
		},
		{
			tag: 'Yahoo, 2013',
			title: 'C jebol',
			body: 'Tiga miliar akun <b>dibaca</b> penyerang. Nggak ada yang berubah, nggak ada yang mati, makanya bertahun tahun nggak ketahuan.'
		},
		{
			tag: 'AP, 2013',
			title: 'I jebol',
			body: 'Akun asli memposting pesan <b>palsu</b>. Satu kalimat bohong bikin pasar saham goyang beberapa menit.'
		},
		{
			tag: 'Dyn, 2016',
			title: 'A jebol',
			body: 'Banjir lalu lintas sampah dari gadget yang dibobol. Situs besar nggak bisa <b>dijangkau</b>, padahal nggak ada yang bocor.'
		},
		{
			tag: 'Penjaganya',
			title: 'Satu alat buat tiap huruf',
			body: '<b>Enkripsi</b> menjaga C, <b>tanda tangan digital</b> menjaga I, <b>backup</b> dan server cadangan menjaga A.'
		},
		{
			tag: 'Opsional',
			title: 'Keseimbangan',
			body: 'Terlalu berat di satu huruf bisa merugikan huruf lain. Pencet satu huruf di gambar buat memutar ulang ceritanya.'
		}
	],
	letters: {
		c: { short: 'Rahasia', name: 'Confidentiality' },
		i: { short: 'Utuh', name: 'Integrity' },
		a: { short: 'Tersedia', name: 'Availability' }
	},
	diary: { title: 'Buku harianku', line: 'Tabungan', amount: 'Rp 500.000', amountBad: 'Rp 5.000' },
	news: {
		c: { tag: 'Yahoo, 2013', head: 'Data tiga miliar akun disalin penyerang' },
		i: { tag: 'Associated Press, 2013', head: 'Tweet palsu soal Gedung Putih bikin pasar goyang' },
		a: { tag: 'Dyn, 2016', head: 'Situs besar padam dibanjiri lalu lintas sampah' }
	},
	tools: { c: 'enkripsi', i: 'tanda tangan', a: 'backup' },
	pickHint: 'Pencet satu huruf buat memutar ulang ceritanya'
};
