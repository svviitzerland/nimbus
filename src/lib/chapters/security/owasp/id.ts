import type { SecurityCatalogText } from '../../types';
export const id: SecurityCatalogText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope:
		'Contoh lokal untuk kategori OWASP Top 10 2025, bukan pemindai atau sertifikasi keamanan. Setiap kontrol hanya menangani kondisi pada contoh tersebut.',
	title: 'OWASP Top 10',
	intro: [
		'<b>OWASP</b> adalah Open Worldwide Application Security Project, komunitas dan yayasan yang membantu membuat perangkat lunak lebih aman. Kamu akan sering menemukan panduannya saat mengembangkan atau menguji aplikasi.',
		'<b>OWASP Top 10</b> mengenalkan kelompok risiko penting pada aplikasi web. Lab ini memakai edisi <b>2025</b>. Daftar ini membantu membuka mata, bukan daftar lengkap semua pengujian yang membuat aplikasi otomatis aman.',
		'Pilih satu kategori. Kirim percobaan dengan kontrol mati, baca apa yang terjadi, lalu aktifkan kontrol dan ulangi. Contohnya, pemeriksaan pemilik mengubah akses tagihan orang lain dari berhasil menjadi ditolak.',
		'Kategori adalah peta. <b>ASVS</b> membantu merumuskan hal yang perlu diverifikasi. <b>WSTG</b> membantu merencanakan pengujian. <b>Cheat Sheet Series</b> memberi panduan penerapan untuk masalah tertentu.',
		'[ingat] <b>Top 10 menunjukkan kelompok masalah, bukti request menunjukkan kejadian.</b> Jelaskan penyebab, dampak, dan perbaikan saat menulis temuan, bukan hanya menyebut kode A01.'
	],
	reactions: {
		exposed:
			'Percobaan menunjukkan perilaku ketika kontrol belum ada. Catat apa yang dikirim dan apa yang keluar sebelum mengubahnya.',
		fixed:
			'Kontrol mengubah hasil pada skenario ini. Uji kebutuhan yang sah juga sebelum menganggap perbaikan selesai.'
	},
	goal: 'Hubungkan sepuluh kategori dengan contoh perilaku',
	tasks: ['Amati keadaan awal', 'Uji sebuah kontrol', 'Bandingkan tiga kategori'],
	hint: 'Jalankan kategori pertama tanpa kontrol, aktifkan kontrol lalu ulangi. Lakukan pada dua kategori lain. Semua sepuluh kategori bisa dijelajahi.',
	labels: {
		run: 'Jalankan percobaan',
		compared: 'kategori dibandingkan',
		category: 'Kategori OWASP 2025',
		result: 'Hasil di server',
		waiting: 'Belum ada hasil',
		resources: 'Pilih rujukan sesuai pekerjaan',
		asvs: 'ASVS, persyaratan untuk memverifikasi keamanan aplikasi.',
		wstg: 'WSTG, panduan langkah pengujian keamanan web.',
		cheatsheet: 'Cheat Sheet Series, panduan penerapan kontrol tertentu.'
	},
	cases: [
		{
			id: 'A01',
			title: 'Broken Access Control',
			request: 'GET /invoices/102\nSession user = Nim',
			scene: 'Nim meminta tagihan milik Ari. Login saja belum memberi izin untuk semua tagihan.',
			control: 'Periksa pemilik tagihan',
			explanation: 'Periksa otorisasi objek pada server untuk setiap request.',
			before: '200 OK\nowner = Ari\ntotal = 40',
			after: '403 Forbidden\nNo invoice returned'
		},
		{
			id: 'A02',
			title: 'Security Misconfiguration',
			request: 'GET /debug',
			scene: 'Mode debug produksi menampilkan konfigurasi internal kepada pengunjung.',
			control: 'Matikan endpoint debug publik',
			explanation:
				'Konfigurasi aman mengurangi informasi dan kemampuan yang tidak diperlukan pengunjung.',
			before: '200 OK\nDB_HOST = internal-db\nmode = debug',
			after: '404 Not Found\nNo debug configuration returned'
		},
		{
			id: 'A03',
			title: 'Software Supply Chain Failures',
			request: 'BUILD nimbus.com\nDependency artifact digest = changed',
			scene: 'Sebuah dependency yang diterima saat build berbeda dari artefak yang disetujui.',
			control: 'Kunci versi dan periksa integritas artefak',
			explanation:
				'Kenali asal dependency dan periksa yang benar benar dipakai dalam build. Lockfile saja tidak menjamin paket bebas celah.',
			before: 'BUILD accepted\nUnverified dependency included',
			after: 'BUILD rejected\nArtifact digest mismatch'
		},
		{
			id: 'A04',
			title: 'Cryptographic Failures',
			request: 'OBSERVE /profile response in transit',
			scene: 'Data profil dikirim lewat sambungan tanpa perlindungan isi pesan.',
			control: 'Gunakan TLS yang diverifikasi',
			explanation:
				'Perlindungan transport menjaga isi perjalanan. Penyimpanan dan pengelolaan kunci perlu diperiksa tersendiri.',
			before: 'Visible profile\nname = Nim\naddress = Nimbus Street 1',
			after: 'Encrypted application payload\nProfile not readable on the wire'
		},
		{
			id: 'A05',
			title: 'Injection',
			request: "SEARCH products\ninput = ' OR 1=1",
			scene: 'Teks pencarian digabung ke perintah database dan berubah menjadi bagian instruksi.',
			control: 'Gunakan parameter query',
			explanation: 'Parameter memisahkan masukan sebagai data dari struktur perintah SQL.',
			before: 'Query changed\nAll product rows returned',
			after: 'Input treated as a literal value\n0 matching products'
		},
		{
			id: 'A06',
			title: 'Insecure Design',
			request: 'REDEEM coupon NIM10 for the second time',
			scene:
				'Aturan satu kupon per akun hanya ada di tampilan, belum menjadi aturan transaksi server.',
			control: 'Terapkan batas kupon pada transaksi server',
			explanation:
				'Desain perlu mempertimbangkan penyalahgunaan aturan bisnis, bukan hanya input yang valid.',
			before: '200 OK\nDiscount applied again',
			after: '409 Conflict\nCoupon already redeemed by this account'
		},
		{
			id: 'A07',
			title: 'Authentication Failures',
			request: 'LOGIN with a stolen password only',
			scene: 'Pada kasus ini penyerang memiliki password, tetapi tidak memiliki faktor kedua.',
			control: 'Minta faktor kedua yang sesuai',
			explanation:
				'MFA mengurangi serangan berbasis password saja. Pilih mekanisme tahan phishing dan lindungi proses pemulihan akun.',
			before: 'Session created\nPassword alone accepted',
			after: 'Second factor required\nNo authenticated session created'
		},
		{
			id: 'A08',
			title: 'Software or Data Integrity Failures',
			request: 'INSTALL update with a modified payload',
			scene:
				'Paket update sudah diubah setelah diterbitkan. Tanda tangannya tidak sesuai isi paket.',
			control: 'Verifikasi tanda tangan dari penerbit tepercaya',
			explanation:
				'Verifikasi integritas dan asal update sebelum menjalankannya. Menandatangani paket yang sudah berbahaya tidak membuatnya aman.',
			before: 'INSTALL accepted\nModified payload executed',
			after: 'INSTALL blocked\nSignature verification failed'
		},
		{
			id: 'A09',
			title: 'Security Logging and Alerting Failures',
			request: 'OBSERVE 20 failed sign-ins in one minute',
			scene:
				'Banyak login gagal tidak pernah dicatat atau dipantau. Tim kehilangan petunjuk untuk menyelidiki.',
			control: 'Catat kegagalan dan buat alarm terukur',
			explanation:
				'Log memberi bukti, alarm membantu perhatian. Tetap bedakan aktivitas mencurigakan dari bukti kompromi.',
			before: '0 stored events\nNo alert',
			after: '20 failure events recorded\nAlert queued for investigation'
		},
		{
			id: 'A10',
			title: 'Mishandling of Exceptional Conditions',
			request: 'CHECKOUT when the payment service times out',
			scene: 'Layanan pembayaran kehabisan waktu. Aplikasi malah menganggap pembayaran berhasil.',
			control: 'Tangani timeout sebagai status belum dibayar',
			explanation:
				'Saat terjadi error, pertahankan aturan keamanan dan konsistensi. Catat keadaan agar bisa diperiksa dan dicoba ulang dengan benar.',
			before: 'Order marked PAID\nNo payment confirmation',
			after: 'Payment remains PENDING\nRetry requires reconciliation'
		}
	]
};
