import type { SsoText } from './types';

export const id: SsoText = {
	title: 'SSO dan OAuth',
	intro: [
		'<b>SSO</b> memungkinkan satu layanan identitas membantu kamu masuk ke beberapa aplikasi. Aplikasi tidak perlu meminta password identitasmu sendiri.',
		'Perhatikan perpindahan alamat di lab. Nimbus meminta layanan identitas melakukan login, lalu menerima bukti yang bisa diverifikasi. Semua akun di lab ini adalah simulasi.',
		'<b>OAuth</b> membahas pemberian akses terbatas kepada aplikasi. Token akses bisa memberi izin membaca profil tanpa memberikan passwordmu kepada aplikasi itu.',
		'<b>OpenID Connect</b> menambahkan lapisan identitas di atas OAuth 2.0. Ini salah satu cara aplikasi mengetahui siapa yang login. OAuth sendiri bukan protokol login.',
		'Lihat izin yang diminta. Data profil dasar dan akses ke semua file bukan izin yang setara. Pilih sesuai kebutuhan aplikasi.',
		'[ingat] <b>Identitas membuktikan siapa, izin membatasi apa.</b> Periksa alamat halaman login dan persetujuannya.',
		'Coba alur login di lab, lalu batalkan atau cabut izin. Amati data apa yang diterima Nimbus pada setiap langkah.'
	],
	reactions: {
		redirect:
			'Lihat address bar di atas. nimbus.com sama sekali nggak minta password kamu, dia malah mengantarmu ke halaman milik Google sendiri.',
		google:
			'Kamu mengetik password di accounts.google.com, Google yang asli, jadi nimbus.com nggak pernah melihatnya. Sekarang Google bertanya ke kamu, apa saja yang boleh diketahui nimbus.com.',
		consent:
			'Kembali ke nimbus.com dan sudah masuk. Yang sampai cuma sebuah token dan apa yang kamu izinkan. Password Google kamu nggak pernah keluar dari Google.',
		greedy:
			'Sudah masuk, tapi kamu memberi lebih dari yang dibutuhkan sebuah toko. Kontakmu itu juga milik teman temanmu. Tahun 2014 sebuah aplikasi kuis di Facebook memakai izin seperti ini untuk mengumpulkan data sampai 87 juta orang, yang kemudian jadi skandal Cambridge Analytica. Izinkan yang masuk akal saja.',
		revoke:
			'Hilang. Kamu bisa mencabut akses sebuah situs kapan saja dari pengaturan akun Google, dan tokennya langsung nggak berlaku. Password kamu bahkan nggak perlu diganti.'
	},
	signInTitle: 'Masuk ke nimbus.com',
	googleBtn: 'Masuk dengan Google',
	orPassword: 'atau bikin password baru lagi',
	googleTitle: 'Login',
	googleSub: 'untuk lanjut ke nimbus.com',
	googleEmail: 'kamu@gmail.com',
	passwordField: 'password',
	nextBtn: 'Berikutnya',
	consentTitle: 'nimbus.com ingin',
	scopes: {
		name: 'Melihat namamu',
		email: 'Melihat alamat emailmu',
		photo: 'Melihat foto profilmu',
		contacts: 'Membaca semua kontakmu',
		drive: 'Membaca file Drive kamu'
	},
	requiredTag: 'wajib',
	allowBtn: 'Izinkan',
	returning: 'Kembali ke nimbus.com',
	welcomeTitle: 'Sudah masuk',
	welcomeSub: 'sebagai kamu@gmail.com',
	gotTitle: 'Yang diterima nimbus.com',
	tokenChip: 'access token',
	passwordRow: 'Password Google kamu',
	neverTag: 'nggak pernah',
	notSharedTag: 'tetap privat',
	revokeBtn: 'Cabut akses nimbus.com',
	revokedNote: 'Akses dicabut, tokennya sudah nggak berlaku',
	hints: {
		start: 'Ketuk tombol Google di nimbus.com',
		google: 'Halaman ini milik Google, bukan nimbus.com',
		consent: 'Matikan yang nggak dibutuhkan toko, lalu izinkan',
		done: 'Masuk tanpa memberi password ke nimbus.com'
	}
};
