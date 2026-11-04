import type { WebAttacksText } from './types';

export const id: WebAttacksText = {
	title: 'SQL injection dan XSS',
	intro: [
		'Hampir semua website punya kotak buat diketik, login, kolom pencarian, kotak komentar. Apa pun yang kamu ketik seharusnya cuma <b>data</b> biasa, sebuah nama atau kalimat, nggak lebih. Lihat login normal ini lewat.',
		'Di balik layar, server nanya ke databasenya pakai [[SQL|web/sql]], cariin user dengan nama ini dan password ini. Situs yang ceroboh menyusun pertanyaan itu dengan <b>menempelkan</b> teksmu langsung di antara dua tanda kutip.',
		'Sekarang penyerang ngetik nama yang diawali tanda kutip. Kutip itu menutup namanya lebih awal, dan sisanya, OR 1 sama dengan 1, jadi bagian dari pertanyaannya. Satu sama dengan satu selalu benar, jadi database nyerahin user pertama, yaitu admin. Itulah <b>SQL injection</b>.',
		'Obatnya namanya <b>parameterized query</b>. Server ngirim pertanyaan dengan slot kosong, dan teksmu dikirim terpisah, selalu sebagai data. Database sekarang nyari user yang namanya persis teks aneh itu, nggak nemu siapa siapa, dan pintunya tetap tertutup.',
		'Kotak komentar punya sepupu dari bug yang sama. Halaman web itu HTML yang dikirim server ke setiap pengunjung (ingat [[HTTP|web/http]]). Kalau ada komentar berisi tag script dan situsnya ngirim apa adanya, browser setiap pengunjung bakal menjalankannya. Itu namanya <b>XSS</b>, cross site scripting.',
		'Obatnya di sini namanya <b>escaping</b>. Sebelum komentar dikirim, karakter spesialnya ditukar dengan kembaran yang nggak berbahaya, jadi browser cuma menggambarnya sebagai teks dan nggak pernah menganggapnya tag. Komentarnya muncul persis seperti diketik, dan nggak ada yang jalan.',
		'[ingat] <b>Input itu tamu, bukan tuan rumah.</b> Apa pun yang diketik orang boleh duduk di ruangan, tapi nggak boleh ngasih perintah. Simpan sebagai data, selalu.',
		'[fyi] Dua bug ini bukan barang baru. SQL injection pertama kali ditulis terbuka tahun 1998 oleh peneliti bernama Jeff Forristal. Tahun 2005, Samy Kamkar menaruh skrip XSS di profil MySpace miliknya, dan dalam sekitar dua puluh jam lebih dari sejuta orang tanpa sadar menambahkannya sebagai teman.',
		'Mau lihat bedanya lagi? Matikan dan nyalakan obatnya, lalu lihat dua serangannya diputar ulang. Semua di sini cuma pura pura, nggak ada yang menyentuh database asli atau jalan di browsermu.'
	],
	reactions: {
		fixOff:
			'Obat mati. Kutipnya kabur dari nama dan masuk sebagai admin, dan tag scriptnya sampai ke setiap pengunjung. Menempelkan teks ke dalam kode itulah sumber masalahnya.',
		fixOn:
			'Obat nyala. Slot SQL menjaga nama tetap jadi data, dan escaping menjaga komentar tetap jadi teks. Serangannya sama, nggak ada yang terjadi.'
	},
	steps: [
		{
			tag: 'Normal',
			title: 'Input itu data',
			body: 'Nama dan password masuk, server ngecek, dan kamu berhasil masuk. Persis sesuai rencana.'
		},
		{
			tag: 'Di balik layar',
			title: 'Pertanyaan yang ditempel',
			body: 'Teksmu ditempel <b>di dalam kutip</b> pada pertanyaan SQL. Aman aja, sampai teksnya punya kutip sendiri.'
		},
		{
			tag: 'Serangan',
			title: 'SQL injection',
			body: 'Kutip menutup nama lebih awal, dan sisanya dibaca sebagai <b>SQL</b>. Pertanyaannya sekarang cocok dengan semua orang.'
		},
		{
			tag: 'Pertahanan',
			title: 'Parameterized query',
			body: 'Pertanyaannya punya <b>slot</b>, teksnya dikirim terpisah. Data nggak akan pernah berubah jadi SQL.'
		},
		{
			tag: 'Serangan',
			title: 'XSS',
			body: 'Komentar berisi <b>tag script</b> jadi bagian dari halaman, jadi dia jalan di browser setiap pengunjung.'
		},
		{
			tag: 'Pertahanan',
			title: 'Escaping',
			body: 'Karakter spesial jadi kembaran yang aman. Browser <b>menampilkan</b> tagnya, bukan menjalankannya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tamu, bukan tuan rumah',
			body: 'Input boleh duduk di ruangan, tapi nggak boleh <b>ngasih perintah</b>.'
		},
		{
			tag: 'Sekilas',
			title: 'Bug lama, masih ada',
			body: 'Dua duanya sudah dijelaskan lebih dari dua puluh tahun lalu, dan masih muncul di kode baru sampai sekarang.'
		},
		{
			tag: 'Opsional',
			title: 'Obat nyala, obat mati',
			body: 'Ganti saklarnya dan lihat dua serangan yang sama berhasil atau gagal.'
		}
	],
	browserLabel: 'Browser kamu',
	serverLabel: 'Server',
	dbLabel: 'Database',
	visitorLabel: 'Pengunjung lain',
	login: {
		title: 'Masuk',
		userLabel: 'Username',
		passLabel: 'Password',
		submit: 'Masuk',
		welcome: 'Selamat datang, {user}',
		wrong: 'Username atau password salah',
		broken: 'Databasenya bingung',
		noMatch: 'nggak ada yang cocok'
	},
	comments: {
		title: 'Komentar',
		post: 'Kirim',
		posted: 'Komentar terkirim',
		seed: 'Suka banget sama stiker awan barunya!',
		popupTitle: 'nimbus.com berkata',
		popupBody: 'Cookie loginmu dikirim pergi (pura pura)'
	},
	strip: {
		query: 'Yang ditanyakan server ke database',
		params: 'Dikirim terpisah, cuma sebagai data',
		page: 'Yang dikirim server ke setiap pengunjung'
	},
	codeTag: 'jadi kode',
	dataTag: 'tetap data',
	rule: 'Input itu tamu, bukan tuan rumah',
	fixLabel: 'Obatnya',
	fix: { off: 'Mati', on: 'Nyala' }
};
