import type { WebAttacksText } from './types';

export const id: WebAttacksText = {
	title: 'SQL injection dan XSS',
	intro: [
		'Hampir semua situs punya kotak yang bisa kamu ketik. Form login, kolom pencarian, kotak komentar. Apa pun yang kamu ketik seharusnya cuma <b>data</b> biasa, sebuah nama, sebuah kalimat, nggak lebih.',
		'Masalah muncul kalau situs langsung menempelkan ketikanmu ke dalam perintahnya sendiri. Akibatnya beberapa karakter yang licik bisa berhenti jadi data dan berubah jadi bagian dari perintah. Trik ini namanya <b>injection</b>.',
		'Login di nimbus.com bertanya ke database pakai bahasa [[SQL|web/sql]], kira kira "cari user dengan nama ini dan password ini". Kalau namamu mengandung tanda petik, petik itu bisa menutup nama lebih awal, dan semua yang ada sesudahnya dibaca sebagai SQL. Itulah <b>SQL injection</b>.',
		'Kotak komentar punya sepupu dari bug yang sama. Halaman web itu cuma HTML yang dikirim server ke browsermu (ingat [[HTTP|web/http]]). Kalau sebuah komentar berisi tag &lt;script&gt; dan situs mengirimnya apa adanya, browser setiap pengunjung akan menjalankannya. Itulah <b>XSS</b>, cross site scripting.',
		'[fyi] Dua bug ini bukan barang baru. SQL injection pertama kali ditulis terbuka tahun 1998 oleh peneliti bernama Jeff Forristal. Tahun 2005 seorang developer muda, Samy Kamkar, memasang skrip XSS di profil MySpace miliknya, dan dalam sekitar dua puluh jam skrip itu menambah lebih dari sejuta teman ke akunnya.',
		'Dua halaman di bawah ini palsu, mereka tinggal di sandbox kecil dan ketikanmu nggak pernah sampai ke database sungguhan atau jalan di browsermu. Coba bobol dulu seperti penyerang, lalu nyalakan perbaikannya seperti penjaga dan coba lagi.'
	],
	reactions: {
		normal:
			'Login biasa. Nama dan password tetap di dalam tanda petiknya, jadi database cuma melihat data. Memang begini seharusnya.',
		wrong:
			'Nggak cocok, jadi nggak boleh masuk. Tapi lihat query nya, semua ketikanmu duduk rapi di antara tanda petik. Coba salah satu chip merah untuk lihat apa jadinya kalau nggak begitu.',
		broken:
			'Ups, databasenya bingung. Tanda petik nyasar menutup teks terlalu cepat, dan sisanya nggak masuk akal sebagai SQL. Penyerang suka error ini, karena itu tanda kotaknya ditempel langsung ke query.',
		sqlIn:
			'Kamu masuk sebagai admin, tanpa password. Bagian merah di query itu ketikanmu yang berubah jadi kode. Petiknya menutup nama, lalu sisanya mengubah syarat pencarian atau menjadikan cek password sebagai komentar.',
		drop: 'Di database sungguhan, itu barusan menghapus seluruh tabel users, hilang. Di sini Nim cuma pura pura. Lelucon ini sampai punya komik terkenal tentang anak bernama Bobby Tables, dan sayangnya kejadian aslinya juga ada.',
		sqlBlocked:
			'Gagal. Dengan <b>parameterized query</b>, server mengirim perintah dengan slot kosong (tanda tanya), dan ketikanmu dikirim terpisah sebagai data murni. Database mencari user yang namanya persis begitu, lengkap dengan petiknya, dan nggak ketemu siapa siapa.',
		plain:
			'Komentar biasa, muncul sebagai teks untuk semua orang. Sekarang coba komentar yang berisi tag HTML.',
		htmlTag:
			'Lihat, tag nya hilang dan teksnya jadi tebal? Browser pengunjung membaca komentarmu sebagai bagian dari halaman. Untuk teks tebal sih nggak bahaya, tapi artinya tag script juga bakal dibaca sebagai kode.',
		xssRan:
			'Skrip itu sekarang bakal jalan di browser setiap orang yang membuka halaman ini, dan diam diam bisa mengirim cookie login mereka ke penyerang. Nim cuma menampilkan popup pura pura, nggak ada yang benar benar jalan.',
		xssBlocked:
			'Gagal. <b>Escaping</b> mengubah karakter spesial jadi kembaran yang aman, jadi &lt; berubah jadi &amp;lt;. Browser menggambarnya sebagai karakter biasa dan nggak pernah menganggapnya tag. Komentarnya tampil persis seperti diketik, dan nggak ada yang jalan.'
	},
	tabs: { login: 'Login', comments: 'Komentar' },
	sandboxTag: 'sandbox, semua di sini pura pura',
	login: {
		userLabel: 'Username',
		passLabel: 'Password',
		submit: 'Masuk',
		tryLabel: 'Coba ketik sebagai username',
		queryLabel: 'Pertanyaan server ke database',
		paramsLabel: 'Dikirim terpisah, cuma sebagai data',
		fixLabel: 'Parameterized query',
		fixOn: 'nyala',
		fixOff: 'mati',
		welcome: 'Selamat datang lagi, {user}',
		wrong: 'Username atau password salah',
		broken: 'Database nggak paham query nya',
		codeTag: 'ketikanmu jadi kode'
	},
	comments: {
		label: 'Tulis komentar di nimbus.com',
		placeholder: 'Tulis sesuatu yang baik',
		post: 'Kirim komentar',
		tryLabel: 'Coba kirim',
		sentLabel: 'Yang dikirim server ke setiap pengunjung',
		pageLabel: 'Yang dilihat pengunjung',
		fixLabel: 'Escape komentar',
		fixOn: 'nyala',
		fixOff: 'mati',
		ranTitle: 'nimbus.com bilang (pura pura)',
		ranBody:
			'Sebuah skrip barusan jalan di browser pengunjung ini dan mengirim cookie login mereka keluar.',
		seed: 'Stiker awan barunya lucu banget!'
	}
};
