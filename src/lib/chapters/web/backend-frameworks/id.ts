import type { BackendFrameworksText } from './types';

export const id: BackendFrameworksText = {
	title: 'Framework backend',
	intro: [
		'Ingat pesanan tadi? Buat backend, pesanan itu datang sebagai request <b>POST /orders</b>, dan harus ada kode yang menanganinya. Potongan kode itu namanya <b>endpoint</b>.',
		'Satu endpoint kecil ini aja kerjaannya banyak. Lihat alamat mana yang dituju, baca isi formulirnya, cek angkanya masuk akal, tolak request palsu, simpan ke database, terus kirim jawaban balik.',
		'Semua toko di internet butuh kerjaan yang sama, berulang ulang. Jadi orang orang membungkus bagian yang membosankan dan rawan itu jadi satu perkakas siap pakai yang namanya <b>framework</b>. Kamu tinggal nulis bagian yang khas tokomu.',
		'Tiap bahasa pemrograman punya andalannya sendiri. <b>Laravel</b> buat PHP, <b>Express</b> buat JavaScript, <b>Django</b> buat Python, dan <b>Spring</b> buat Java. Beda nama, idenya sama.',
		'[fyi] Kata yang sama, dunia yang beda. Frontend juga punya framework (misalnya React atau Svelte), dan masalah yang diselesaikan beda, yaitu membangun tampilan. Selengkapnya di [[framework frontend|web/why-framework]].',
		'[ingat] Framework menyediakan struktur dan fitur umum seperti routing. Logika aplikasi dan konfigurasi keamanannya tetap perlu ditulis dan diuji.',
		'Pertama tulis endpoint pesanan ini secara manual, satu per satu, dan lihat kodenya menumpuk. Habis itu pilih framework dan lihat seberapa banyak yang langsung hilang.'
	],
	reactions: {
		route:
			'Routing beres. Kodenya sekarang ngecek method dan alamatnya, jadi cuma POST /orders yang masuk ke sini. Toko beneran punya ratusan yang kayak gini.',
		read: 'Formulirnya datang sebagai teks mentah dalam potongan kecil, jadi kamu harus ngumpulin dan mengambil isinya sendiri. Ribet kan?',
		validate:
			'Jangan pernah percaya sama data yang masuk. Bisa aja ada yang pesan minus lima topi. Ngecek tiap isian itu kerjaan membosankan yang gampang kelupaan.',
		security:
			'Yang ini menolak request palsu (serangannya namanya CSRF), waktu situs lain mengakali browsermu supaya memesan atas namamu. Kalau lupa, nggak ada yang sadar, sampai ada yang memanfaatkannya.',
		db: 'Ngobrol sama database artinya buka koneksi, nulis query, dan ingat menutupnya lagi. Salah sedikit, data bisa bocor atau servernya pelan pelan kehabisan tenaga.',
		respond: 'Akhirnya jawabannya dikirim balik. Fiuh, semua itu cuma buat satu endpoint.',
		byhand:
			'Enam kerjaan ditulis manual semua, dan lihat jumlah barisnya. Sekarang bayangkan harus begini juga buat login, keranjang, pencarian, dan pembayaran. Yuk pilih framework.',
		laravel:
			'Laravel (PHP). Routing, baca formulir, validasi, perlindungan CSRF, dan bantuan database semuanya sudah ada. Yang tersisa kebanyakan logika tokomu sendiri.',
		express:
			'Express (JavaScript) itu yang minimalis. Dia mengurus routing dan jawaban, lalu sisanya kamu tambah sendiri pakai paket kecil. Lebih ringan, tapi kamu yang lebih banyak memilih.',
		django:
			'Django (Python) terkenal karena perlengkapannya komplet. Formulir, validasi, CSRF, dan lapisan database (namanya ORM) sudah ada di dalam kotaknya.',
		spring:
			'Spring (Java) itu yang besar, banyak dipakai bank dan perusahaan besar. Beberapa anotasi (kata yang diawali @) langsung mengatur routing, validasi, dan penyimpanan.'
	},
	byHand: 'Manual',
	choresLabel: 'Kerjaan buat POST /orders',
	writeHint: 'Pencet satu kerjaan buat menulis kodenya',
	chores: {
		route: 'Routing',
		read: 'Baca formulir',
		validate: 'Validasi input',
		security: 'Tolak request palsu',
		db: 'Simpan ke database',
		respond: 'Kirim jawaban'
	},
	lines: '{n} baris',
	built: 'sudah ada',
	addon: 'tambah paket',
	todo: 'belum ditulis',
	frameworks: {
		laravel: { lang: 'PHP', blurb: 'Komplet, disukai tim kecil' },
		express: { lang: 'JavaScript', blurb: 'Intinya kecil, tambah sesuai butuh' },
		django: { lang: 'Python', blurb: 'Komplet, dapat halaman admin gratis' },
		spring: { lang: 'Java', blurb: 'Besar dan kokoh, umum di perusahaan besar' }
	}
};
