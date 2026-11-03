import type { MfaText } from './types';

export const id: MfaText = {
	title: 'Apa itu MFA',
	intro: [
		'Bayangkan ada orang yang sudah tahu password kamu. Mungkin [[bocor dari toko ceroboh|security/hashing]], mungkin kamu nggak sengaja mengetiknya di halaman palsu. Apa berarti tamat?',
		'Belum, kalau ada kunci kedua. <b>MFA</b> (multi factor authentication) meminta bukti kedua dari jenis yang berbeda. Sesuatu yang kamu <b>tahu</b> (password), sesuatu yang kamu <b>punya</b> (HP atau kunci kecil), atau sesuatu yang ada <b>di dirimu</b> (sidik jari atau wajah).',
		'Kamu sebenarnya sudah sering pakai. Di ATM, kartunya adalah sesuatu yang kamu punya dan PIN adalah sesuatu yang kamu tahu. Maling yang cuma pegang salah satunya pulang tanpa uang. Itu MFA jauh sebelum ada internet.',
		'Di internet, bukti keduanya biasanya kode enam digit dari <b>aplikasi authenticator</b> yang berganti tiap 30 detik, atau <b>security key</b> kecil berbentuk USB yang tinggal kamu sentuh.',
		'Dan ini terbukti. Tahun 2018 Google bercerita bahwa sejak awal 2017, waktu mereka membagikan security key ke lebih dari 85 ribu karyawannya, nggak ada satu pun akun kerja mereka yang berhasil diambil alih lewat phishing.',
		'[fyi] Tapi MFA bukan sihir. Tahun 2022 seorang penyerang yang sudah punya password seorang kontraktor Uber terus menerus mengirim permintaan persetujuan login ke HP miliknya, lalu mengirim pesan pura pura jadi tim IT, sampai akhirnya dia menekan setuju. Jangan pernah menyetujui login yang bukan kamu sendiri yang mulai.',
		'Yuk lihat langsung. Seorang penyerang sudah memegang password nimbus.com kamu. Perhatikan apa yang terjadi waktu MFA mati, lalu waktu MFA nyala.'
	],
	reactions: {
		noMfa:
			'Gampang banget. Kalau pintunya cuma dijaga password, siapa pun yang pegang password itu dianggap kamu oleh nimbus.com. Nyalakan MFA lalu biarkan dia coba lagi.',
		stuck:
			'Mentok. Passwordnya benar, tapi kodenya ada di HP kamu, dan HP kamu ada di sakumu. Menebak enam digit itu peluangnya satu banding sejuta, lagi pula kodenya berganti tiap 30 detik. Sekarang kamu yang login.',
		wrongCode:
			'Bukan yang itu. Lihat aplikasi di HP kamu, lalu ketik enam digit yang tampil sekarang.',
		you: 'Selamat datang kembali. Kamu punya dua duanya, password di kepala dan HP di tangan. Cuma itu yang diminta MFA, dan itu sudah cukup buat menghentikan kebanyakan serangan pakai password curian.'
	},
	attackerLabel: 'Penyerang',
	attackerSub: 'jauh di sana',
	stolenChip: 'pegang password kamu',
	phoneLabel: 'HP kamu',
	appName: 'Authenticator',
	appAccount: 'nimbus.com, akun kamu',
	secondsLeft: '{n} dtk',
	mfaOffChip: 'MFA mati',
	mfaOnChip: 'MFA nyala',
	loginTitle: 'Login nimbus.com',
	emailField: 'email',
	passwordField: 'password',
	codeField: 'kode',
	attackBtn: 'Penyerang login',
	mfaOnBtn: 'Nyalakan MFA',
	attackAgainBtn: 'Penyerang coba lagi',
	codePrompt: 'Giliranmu. Ketik kode dari HP kamu',
	submitBtn: 'Masuk',
	status: {
		idle: 'Halaman login sudah terbuka di laptopnya',
		checking: 'Mengecek password',
		taken: 'Berhasil masuk. Akunnya jadi milik dia',
		askCode: 'Password benar. Sekarang kode dari HP',
		guessing: 'Menebak {code}',
		locked: 'Terlalu banyak kode salah, login diblokir',
		yourTurn: 'Tertutup buat dia, terbuka buat kamu',
		wrong: 'Kodenya nggak cocok',
		welcome: 'Selamat datang kembali, ini memang kamu'
	}
};
