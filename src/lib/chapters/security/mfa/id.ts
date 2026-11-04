import type { MfaText } from './types';

export const id: MfaText = {
	title: 'Apa itu MFA',
	intro: [
		'Bayangkan ada orang yang sudah tahu password nimbus.com kamu. Mungkin [[bocor dari toko yang ceroboh|security/hashing]], mungkin kamu nggak sengaja mengetiknya di halaman palsu. Udah tamat?',
		'Kalau pintunya cuma dikunci password, sayangnya iya. Lihat. Dia mengetiknya, situsnya mengecek, dan sejauh yang nimbus.com tahu, dia itu kamu.',
		'Kecuali ada kunci kedua. <b>MFA</b> (multi factor authentication) minta bukti kedua yang jenisnya beda. Sesuatu yang kamu <b>tahu</b> (password), sesuatu yang kamu <b>pegang</b> (HP atau kunci kecil), atau sesuatu yang ada <b>di dirimu</b> (sidik jari atau wajah).',
		'Sebenarnya kamu udah sering pakai. Di ATM, kartunya itu yang kamu pegang dan PIN itu yang kamu tahu. Maling yang cuma punya salah satunya pulang tanpa uang. Itu MFA dari jauh sebelum ada internet.',
		'Di internet, bukti keduanya biasanya kode enam digit dari <b>aplikasi authenticator</b> di HP kamu. Kodenya ganti tiap 30 detik, jadi kode lama nggak ada gunanya.',
		'Sekarang penyerangnya coba lagi dengan MFA nyala. Passwordnya benar, tapi situsnya minta kode juga. Kodenya ada di HP kamu, dan HP kamu ada di kantongmu. Nebak enam digit itu peluangnya satu banding sejuta, jadi dia mentok.',
		'[ingat] <b>Yang kamu tahu plus yang kamu pegang.</b> Password doang itu kunci yang bisa digandakan siapa aja. Tambah HP kamu, dan maling harus merogoh kantongmu juga.',
		'Ini terbukti. Tahun 2018 Google cerita bahwa sejak awal 2017, waktu mereka membagikan kunci keamanan fisik ke lebih dari 85 ribu karyawannya, nggak ada satu pun akun kerja mereka yang dibobol lewat phishing.',
		'[fyi] Tapi MFA bukan sihir. Tahun 2022 penyerang yang punya password seorang kontraktor Uber terus mengirim permintaan persetujuan login ke HP orang itu, lalu mengirim pesan pura pura jadi tim IT, sampai akhirnya dia memencet setuju. Jangan pernah menyetujui login yang bukan kamu sendiri yang mulai.',
		'Giliranmu, kalau mau. Kali ini kamu yang login. Lihat HPnya dan ketik enam digit yang tampil sekarang.'
	],
	reactions: {
		you: 'Selamat datang lagi. Kamu punya dua duanya, password di kepala dan HP di tangan. Cuma itu yang diminta MFA, dan itu menghentikan sebagian besar serangan password curian.',
		wrongCode:
			'Bukan yang itu. Lihat HPnya dan ketik enam digit yang tampil sekarang. Kalau lingkarannya hampir habis, tunggu kode barunya.'
	},
	steps: [
		{
			tag: 'Masalahnya',
			title: 'Password dicuri',
			body: 'Password bisa bocor, ketebak, atau diketik di halaman palsu. Cepat atau lambat, orang lain bisa <b>tahu</b> punyamu.'
		},
		{
			tag: 'MFA mati',
			title: 'Cuma satu kunci',
			body: 'Situsnya cuma mengecek password. Siapa pun yang mengetiknya <b>dianggap kamu</b>.'
		},
		{
			tag: 'Idenya',
			title: 'Tiga jenis bukti',
			body: 'Yang kamu <b>tahu</b>, yang kamu <b>pegang</b>, yang ada <b>di dirimu</b>. MFA minta dua yang jenisnya beda.'
		},
		{
			tag: 'Sehari hari',
			title: 'ATM',
			body: '<b>Kartu</b> itu yang kamu pegang, <b>PIN</b> itu yang kamu tahu. Satu doang, maling nggak dapat apa apa.'
		},
		{
			tag: 'Pegang',
			title: 'Aplikasi authenticator',
			body: 'Kode enam digit yang dibuat di HP kamu. Gantinya tiap <b>30 detik</b> dan nggak pernah dikirim ke mana mana.'
		},
		{
			tag: 'MFA nyala',
			title: 'Mentok di kunci kedua',
			body: 'Password benar, kode nggak ada. Beberapa kali salah tebak, situsnya <b>memblokir</b> loginnya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tahu plus pegang',
			body: 'Sesuatu di <b>kepala</b> plus sesuatu di <b>tangan</b>. Maling jarang punya dua duanya.'
		},
		{
			tag: 'Google, 2018',
			title: 'Kunci keamanan',
			body: 'Kunci USB kecil yang ditempel buat login. Lebih dari 85 ribu karyawan, nol akun jebol karena phishing.'
		},
		{
			tag: 'Uber, 2022',
			title: 'Banjir permintaan',
			body: 'Permintaan demi permintaan sampai ada yang memencet setuju karena capek. <b>Tolak</b> login yang bukan kamu yang mulai.'
		},
		{
			tag: 'Opsional',
			title: 'Login sendiri',
			body: 'Ketik kode dari HP ke kotak login di atas. Dua kunci, satu per satu.'
		}
	],
	attackerLabel: 'Penyerang, jauh di sana',
	youLabel: 'Kamu',
	phoneLabel: 'HP kamu',
	stolenChip: 'tahu passwordmu',
	appName: 'Authenticator',
	appAccount: 'nimbus.com',
	mfaOffChip: 'MFA mati',
	mfaOnChip: 'MFA nyala',
	loginTitle: 'Login nimbus.com',
	emailValue: 'kamu@nimbus.com',
	codeField: 'kode',
	loginBtn: 'Masuk',
	factors: {
		know: { name: 'tahu', ex: 'password' },
		have: { name: 'pegang', ex: 'HP' },
		are: { name: 'dirimu', ex: 'sidik jari' }
	},
	atm: { know: 'PIN', have: 'kartu ATM' },
	keyLabel: 'kunci keamanan',
	approvePrompt: 'Setujui login?',
	approveYes: 'Setuju',
	approveNo: 'Tolak',
	status: {
		idle: 'Password sudah diketik',
		checking: 'Mengecek password',
		taken: 'Berhasil masuk. Akunnya jadi milik dia',
		askCode: 'Password benar. Sekarang kodenya',
		guessing: 'Menebak {code}',
		locked: 'Kebanyakan salah, diblokir',
		push: 'Mengirim permintaan login ke HP kamu',
		yourTurn: 'Ketik kode dari HP kamu',
		wrong: 'Kodenya nggak cocok',
		welcome: 'Selamat datang, ini beneran kamu'
	},
	codeHint: 'Kode dari HP kamu',
	submitBtn: 'Masuk'
};
