import type { CvssText } from '../../types';

export const id: CvssText = {
	title: 'CVSS',
	intro: [
		'Sebuah celah bisa membuka satu tagihan atau memberi kendali atas seluruh server. <b>CVSS</b>, Common Vulnerability Scoring System, membantu menjelaskan keparahan teknisnya dengan metrik dan skor dari 0 sampai 10.',
		'Mulai dari bukti. Di nimbus.com, coba <b>baca data</b>, <b>ubah harga</b>, dan <b>hentikan layanan</b>. Ketiganya menguji dampak pada kerahasiaan, keutuhan, dan ketersediaan yang sudah kita kenal sebagai [[CIA|security/cia]].',
		'Syarat masuk juga penting. Pada kasus kedua, celah baru dapat dipakai setelah login sebagai admin aplikasi. Pada kasus ketiga, pengunjung tanpa akun mendapat dampak yang sama. Bandingkan keduanya.',
		'Setelah menguji satu kasus, buka penilaiannya. CVSS mempertimbangkan dampak <b>dan</b> syarat eksploitasi. Jumlah kotak yang berubah saja tidak cukup untuk menentukan skor.',
		'Kamu bisa menemukan <b>CVSS 2.0, 3.0, 3.1, dan 4.0</b> pada laporan yang berbeda. Versi 2.0 adalah versi lama yang masih muncul pada rekam historis. Selalu baca versi yang dicantumkan oleh penerbit laporan.',
		'<b>Vector</b> mencatat pilihan metrik yang menghasilkan skor. Ketuk potongannya untuk melihat artinya. Versi berbeda dapat memakai metrik dan cara hitung berbeda, jadi mengganti versinya bukan sekadar mengganti angka di depan vector.',
		'Latihan ini membandingkan <b>Base score</b>. Penilaian dalam waktu dan lingkungan tertentu memiliki kelompok tambahan yang berbeda menurut versi. Untuk menentukan urutan perbaikan, gunakan juga [[konteks risiko|security/vulnerability-management]].',
		'[ingat] <b>Catat versi, vector, dan skor bersama.</b> Skor menjelaskan keparahan berdasarkan penilaian, bukan peluang serangan atau persentase keamanan.'
	],
	reactions: {
		restored: 'Layanan berjalan lagi. Bukti gangguan tadi tetap dicatat untuk penilaian.',
		explore:
			'Pilih tindakan untuk mengumpulkan bukti pada kasus ini. Perhatikan respons server dan perubahan yang benar benar terjadi.',
		invoice_read:
			'Nomor dan total satu tagihan terbaca tanpa izin. Dalam kasus ini dampak kerahasiaannya terbatas. Kita belum menemukan kemampuan mengubah data atau menghentikan layanan.',
		invoice_write:
			'Perubahan harga ditolak. Celah membaca tagihan tidak otomatis memberi izin menulis. Nilai dampak dari bukti yang ada.',
		invoice_stop:
			'Layanan tetap berjalan dan perintah berhenti ditolak. Pada kasus ini tidak ada dampak ketersediaan dari celah tersebut.',
		admin_needed:
			'Permintaan ditolak sebelum mencapai fitur impor. Kasus ini mensyaratkan akun admin aplikasi. Coba masuk sebagai admin, lalu ulangi pemeriksaannya.',
		admin_ready:
			'Akun admin aplikasi sudah dipakai. Ini hak yang diperlukan sebelum eksploitasi, bukan hak yang didapat sesudahnya.',
		full_read:
			'Celah pada fitur impor membuka data yang seharusnya terlindungi. Kasus ini diasumsikan dapat membaca seluruh data server, sehingga dampak kerahasiaannya besar.',
		full_write:
			'Harga berubah dari 25 menjadi 1. Ini satu bukti kemampuan menulis. Skenario menetapkan bahwa seluruh data server dapat diubah, sehingga dampak keutuhannya besar.',
		full_stop:
			'Layanan berhenti pada server latihan. Skenario ini memungkinkan seluruh layanan pada server tersebut terganggu, sehingga dampak ketersediaannya besar.',
		scored_invoice:
			'Bukti pada kasus tagihan menunjukkan dampak membaca yang terbatas. Buka perbandingan versi untuk melihat bagaimana asumsi yang sama dinilai dengan aturan berbeda.',
		scored_admin:
			'Dampaknya besar, tetapi akun admin aplikasi diperlukan sejak awal. Syarat ini ikut dinilai. Bandingkan dengan kasus tanpa akun.',
		scored_public:
			'Dampak besar dapat terjadi tanpa akun. Kondisi kasus berbeda dari kebutuhan admin tadi, sehingga hasil penilaiannya juga berbeda.',
		version2:
			'CVSS 2.0 memakai Authentication untuk jumlah autentikasi. Ia tidak membedakan hak rendah dan tinggi seperti Privileges Required pada versi 3 dan 4. Label tingkatnya di sini mengikuti rentang NVD untuk versi 2.',
		version30:
			'CVSS 3.0 membedakan hak awal, keterlibatan pengguna, dan Scope. Dalam kasus ini semua dampak masih berada pada satu otoritas keamanan, sehingga Scope bernilai Unchanged.',
		version31:
			'CVSS 3.1 memperjelas panduan versi 3.0 dan memperbarui bagian perhitungannya. Ketiga contoh Base ini menghasilkan skor yang sama pada 3.0 dan 3.1. Itu tidak berarti seluruh aturan kedua versi identik.',
		version4:
			'CVSS 4.0 menambahkan Attack Requirements dan memisahkan dampak pada sistem rentan serta sistem lanjutan. Dalam tiga kasus ini tidak ada dampak pada sistem lanjutan.',
		finished:
			'Ketiga kasus sudah kamu uji dan versinya sudah dibandingkan. Saat membaca advisori, periksa bukti serta vector di balik skor sebelum menentukan tindak lanjut.'
	},
	cases: {
		invoice: {
			name: 'Tagihan',
			title: 'Satu tagihan terbaca',
			brief:
				'Halaman tagihan melewatkan pemeriksaan izin. Uji apa saja yang bisa dilakukan pengunjung tanpa akun.',
			result:
				'Hanya nomor dan total satu tagihan terungkap. Tidak ada perubahan data atau gangguan layanan.'
		},
		admin: {
			name: 'Perlu admin',
			title: 'Celah pada fitur impor',
			brief:
				'Fitur impor memiliki celah yang dapat memberi kendali atas server. Periksa siapa yang bisa mencapai fitur tersebut.',
			result: 'Dampak besar pada seluruh server, dengan syarat sudah memiliki akun admin aplikasi.'
		},
		public: {
			name: 'Tanpa akun',
			title: 'Fitur impor terbuka ke publik',
			brief:
				'Celah impor yang sama kini dapat dijangkau tanpa akun. Uji dampaknya dan bandingkan dengan kasus sebelumnya.',
			result: 'Dampak besar pada seluruh server tanpa memerlukan akun sebelumnya.'
		}
	},
	versions: {
		'2.0':
			'Versi lama. Authentication menghitung autentikasi yang diperlukan, bukan tingkat hak. Rentang NVD untuk versi 2 memakai Low, Medium, dan High.',
		'3.0':
			'Mengenalkan Privileges Required, User Interaction, dan Scope. Rentang tingkat keparahannya mencakup Critical.',
		'3.1':
			'Memperjelas panduan 3.0 dan memperbarui pembulatan serta perhitungan Environmental. Skor Base pada contoh ini sama dengan 3.0.',
		'4.0':
			'Memakai Attack Requirements dan dampak pada sistem rentan serta sistem lanjutan. Cara menghitung skor juga berubah.'
	},
	labels: {
		restore: 'Nyalakan layanan',
		restoreHint: 'Layanan berhenti. Nyalakan kembali untuk melanjutkan pemeriksaan.',
		exposed: 'Terbaca',
		cases: 'Pilih kasus',
		case: 'Kasus',
		tested: 'sudah dinilai',
		probe: 'Coba pada server latihan',
		read: 'Baca data',
		write: 'Ubah harga',
		stop: 'Hentikan layanan',
		readDetail: 'Periksa kerahasiaan',
		writeDetail: 'Periksa keutuhan',
		stopDetail: 'Periksa ketersediaan',
		untried: 'Belum diuji',
		login: 'Perlu login admin',
		limited: 'Satu tagihan terbaca',
		fullRead: 'Seluruh data terbaca',
		fullWrite: 'Harga berubah',
		fullStop: 'Layanan berhenti',
		denied: 'Ditolak',
		signIn: 'Masuk sebagai admin',
		visitor: 'Pengunjung tanpa akun',
		administrator: 'Admin aplikasi',
		client: 'Browser penguji',
		network: 'Melalui jaringan',
		server: 'Server nimbus.com',
		running: 'Layanan berjalan',
		offline: 'Layanan berhenti',
		file: 'Tagihan 101',
		files: 'Seluruh data server',
		sealed: 'Data belum terbaca',
		invoiceData: 'Total pesanan 25 koin',
		price: 'Harga produk',
		coins: 'koin',
		assess: 'Lihat penilaian CVSS',
		collect: 'Coba ketiga tindakan untuk mengumpulkan bukti.',
		evidence: 'Bukti pada kasus ini',
		compare: 'Bandingkan versi',
		nextCase: 'Coba kasus berikutnya',
		scale: 'Skor keparahan',
		none: 'Tidak ada',
		low: 'Rendah',
		medium: 'Sedang',
		high: 'Tinggi',
		critical: 'Kritis',
		vector: 'Baca vector',
		vectorHint: 'Ketuk satu bagian untuk membaca artinya.',
		assumptions: 'Asumsi penilaian',
		assumptionText:
			'Semua kasus melalui jaringan, tanpa kondisi tambahan atau tindakan pengguna lain. Dampak tetap pada satu otoritas keamanan. Tidak ada sistem lanjutan yang terdampak.',
		versionHint:
			'Kasusnya tetap sama. Versi penilaian yang berubah. Ini bukan konversi otomatis antar vector.',
		complete: 'Tiga kasus selesai',
		compareHint: 'Ketuk versi lain untuk membandingkan penilaiannya.',
		source: 'Baca rujukan versi ini',
		scope:
			'Simulasi lokal dengan kasus hipotetis. Tidak mengirim request atau menghentikan server sungguhan.',
		response: 'Respons pemeriksaan',
		waiting: 'Pilih tindakan untuk mulai',
		metric: 'Makna metrik',
		value: 'Pilihan pada kasus ini',
		N: 'Tidak ada',
		L: 'Terbatas',
		H: 'Besar',
		P: 'Sebagian',
		C: 'Seluruhnya',
		AV_N: 'Jaringan',
		AC_L: 'Kompleksitas rendah',
		AT_N: 'Tanpa kondisi tambahan',
		Au_N: 'Tanpa autentikasi',
		Au_S: 'Satu autentikasi',
		PR_N: 'Tanpa hak awal',
		PR_H: 'Hak admin aplikasi',
		UI_N: 'Tanpa tindakan pengguna lain',
		S_U: 'Otoritas keamanan tetap'
	},
	metrics: {
		AV: 'Jalur untuk mencapai celah. Semua kasus ini dapat dicapai lewat jaringan.',
		AC: 'Kompleksitas untuk mengeksploitasi celah. Kasus ini tidak memerlukan langkah atau kondisi kompleks. Definisi rinci berbeda menurut versi.',
		AT: 'Kondisi penempatan atau eksekusi tambahan. Tidak ada syarat tambahan seperti memenangkan kondisi waktu pada kasus ini.',
		Au: 'Jumlah autentikasi yang diperlukan. Pada versi 2, satu autentikasi tidak membedakan akun biasa dari admin.',
		PR: 'Hak yang harus sudah dimiliki sebelum memanfaatkan celah. Ini berbeda dari hak yang didapat setelah eksploitasi.',
		UI: 'Apakah pengguna lain perlu bertindak agar celah bisa dimanfaatkan. Pelaku sendiri tidak dihitung sebagai pengguna lain.',
		S: 'Apakah dampak melewati batas otoritas keamanan komponen rentan. Semua kasus ini tetap dalam satu otoritas.',
		C: 'Dampak pada kerahasiaan, yaitu seberapa jauh data dapat terungkap tanpa izin.',
		I: 'Dampak pada keutuhan, yaitu seberapa jauh data dapat diubah tanpa izin.',
		A: 'Dampak pada ketersediaan, yaitu seberapa jauh layanan dapat terganggu.',
		VC: 'Dampak kerahasiaan pada sistem yang memiliki celah.',
		VI: 'Dampak keutuhan pada sistem yang memiliki celah.',
		VA: 'Dampak ketersediaan pada sistem yang memiliki celah.',
		SC: 'Dampak kerahasiaan pada sistem lanjutan. Skenario ini tidak memiliki dampak tersebut.',
		SI: 'Dampak keutuhan pada sistem lanjutan. Skenario ini tidak memiliki dampak tersebut.',
		SA: 'Dampak ketersediaan pada sistem lanjutan. Skenario ini tidak memiliki dampak tersebut.'
	}
};
