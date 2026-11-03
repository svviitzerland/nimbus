import type { SsoText } from './types';

export const id: SsoText = {
	title: 'SSO dan OAuth',
	intro: [
		'Coba hitung akunmu sebentar. Belanja, game, sekolah, chat. Semuanya minta password, jadi kebanyakan orang akhirnya memakai password yang sama di mana mana. Begitu satu situs bocor, yang lain ikut tumbang seperti domino.',
		'<b>SSO</b> (single sign on) membalik keadaan itu. Satu akun tepercaya menjamin dirimu di banyak tempat. Di sekolah atau kantor, kamu login sekali di pagi hari, lalu email, chat, dan file langsung terbuka tanpa ditanya lagi.',
		'Sebelum ada cara ini, beberapa situs terang terangan meminta password email kamu supaya bisa mencari teman di daftar kontakmu. Itu sama saja dengan memberikan kunci rumah ke orang asing supaya dia bisa mengintip buku tamumu.',
		'Tahun 2007 sekelompok developer, salah satunya Blaine Cook dari Twitter, mulai membangun cara yang lebih baik bernama <b>OAuth</b>. Versi yang dipakai sekarang, OAuth 2.0, jadi standar internet di tahun 2012.',
		'Idenya seperti kunci valet. Beberapa mobil punya kunci cadangan yang bisa dipakai menyetir tapi nggak bisa membuka bagasi. Dengan OAuth, situs dapat <b>token</b> semacam itu, terbatas pada yang kamu izinkan, dan nggak pernah dapat password kamu.',
		'[fyi] Kata yang sama, dunia yang beda. "Masuk dengan Google" di sebuah toko adalah SSO untuk siapa saja di internet. Di dalam perusahaan, SSO biasanya lewat sistem identitas milik perusahaan sendiri, idenya sama dengan [[Identity and Access|networking/iam]].',
		'Coba sendiri. Masuk ke nimbus.com pakai akun Google kamu, dan perhatikan address bar serta apa saja yang dibagikan.'
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
