import type { WebAttacksText } from './types';

export const id: WebAttacksText = {
	title: 'SQL injection dan XSS',
	intro: [
		'Hampir semua situs punya kotak yang bisa kamu ketik. Form login, kolom pencarian, kotak komentar. Apa pun yang kamu ketik seharusnya cuma <b>data</b> biasa, sebuah nama, sebuah kalimat, nggak lebih.',
		'<b>Injection</b> terjadi ketika input dapat mengubah struktur perintah yang dijalankan. Contohnya, teks dari formulir digabung langsung ke query SQL tanpa pemisahan antara perintah dan data.',
		'Login di nimbus.com bertanya ke database pakai bahasa [[SQL|web/sql]], kira kira "cari user dengan nama ini dan password ini". Kalau namamu mengandung tanda petik, petik itu bisa menutup nama lebih awal, dan semua yang ada sesudahnya dibaca sebagai SQL. Itulah <b>SQL injection</b>.',
		'Kotak komentar punya sepupu dari bug yang sama. Halaman web itu cuma HTML yang dikirim server ke browsermu (ingat [[HTTP|web/http]]). Kalau sebuah komentar berisi tag &lt;script&gt; dan situs mengirimnya apa adanya, browser setiap pengunjung akan menjalankannya. Itulah <b>XSS</b>, cross site scripting.',
		'<b>Parameterized query</b> memisahkan data dari SQL. Untuk komentar teks pada halaman HTML, output encoding menjaga karakter khusus tetap tampil sebagai teks. Perlindungan harus sesuai tempat data digunakan.',
		'[ingat] <b>Perlakukan input sebagai data.</b> Gunakan query berparameter untuk SQL dan encoding yang sesuai saat menampilkan teks ke halaman.',
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
		drop: 'Model query ini menafsirkan input sebagai perintah menghapus tabel. Pada sistem nyata, hasilnya bergantung pada driver, izin akun database, dan query yang dijalankan. Parameterized query mencegah input menjadi bagian struktur SQL.',
		sqlBlocked:
			'Gagal. Dengan <b>parameterized query</b>, server mengirim perintah dengan slot kosong (tanda tanya), dan ketikanmu dikirim terpisah sebagai data murni. Database mencari user yang namanya persis begitu, lengkap dengan petiknya, dan nggak ketemu siapa siapa.',
		plain:
			'Komentar biasa, muncul sebagai teks untuk semua orang. Sekarang coba komentar yang berisi tag HTML.',
		htmlTag:
			'Browser menafsirkan input sebagai HTML, sehingga teks menjadi tebal. Ini menunjukkan komentar tidak diperlakukan sebagai teks biasa. Risiko eksekusi script bergantung pada konteks penyisipan dan kontrol halaman.',
		xssRan:
			'Simulasi menunjukkan script berjalan dalam konteks halaman. XSS dapat membaca data halaman atau melakukan tindakan sebagai pengguna. Cookie HttpOnly tidak bisa dibaca melalui JavaScript, tetapi tidak menghilangkan seluruh dampak XSS.',
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
		ranTitle: 'Hasil script simulasi',
		ranBody:
			'Simulasi script berjalan di halaman dan mencoba membaca cookie yang tidak memakai HttpOnly.',
		seed: 'Stiker awan barunya lucu banget!'
	}
};
