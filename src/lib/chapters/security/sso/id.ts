import type { SsoText } from './types';

export const id: SsoText = {
	title: 'SSO dan OAuth',
	intro: [
		'Coba hitung akunmu sebentar. Belanja, game, sekolah, chat. Semuanya minta password, jadi kebanyakan orang akhirnya pakai password yang sama di mana mana. Begitu satu situs bocor, yang lain ikut rubuh kayak domino.',
		'<b>SSO</b> (single sign on) membalik keadaannya. Satu akun yang dipercaya menjamin dirimu di banyak tempat. Itu tombol <b>Sign in with Google</b> yang sering kamu lihat di banyak situs.',
		'Sebelum ada ini, ada situs yang terang terangan minta password emailmu biar bisa mengintip kontakmu buat nyari teman. Itu kayak ngasih kunci rumah ke orang asing cuma biar dia bisa lihat buku tamumu.',
		'Tahun 2007 sekelompok developer, salah satunya Blaine Cook dari Twitter, mulai membangun cara yang lebih baik bernama <b>OAuth</b>. Lihat jalannya. Kamu pencet tombol Google, lalu nimbus.com mengirim browsermu ke halaman milik Google sendiri. Perhatikan address barnya.',
		'Kamu mengetik password di accounts.google.com, Google yang asli. nimbus.com nggak pernah melihatnya, sedetik pun nggak.',
		'Lalu Google tanya ke kamu, apa saja yang boleh diketahui nimbus.com, misalnya nama, email, dan foto. Baca layar ini sebelum memencet. Tahun 2014 sebuah aplikasi kuis di Facebook minta izin terlalu banyak dan akhirnya mengumpulkan data sampai 87 juta orang, yang jadi skandal Cambridge Analytica.',
		'Kamu pencet izinkan, dan Google memberi nimbus.com sebuah <b>token</b>. Bayangkan kunci valet, kunci cadangan mobil yang bisa buat nyetir tapi nggak bisa buka bagasi. Token cuma bisa melakukan yang kamu izinkan, dan itu bukan passwordmu. OAuth 2.0, versi yang dipakai sekarang, jadi standar internet tahun 2012.',
		'[ingat] <b>Password pulang ke rumahnya sendiri.</b> Password Google cuma diketik di google.com, bukan di tempat lain. Kalau halaman toko memintanya, tutup aja tabnya.',
		'[fyi] Kata sama, dunia beda. Sign in with Google di toko itu SSO buat siapa pun di internet. Di sekolah atau kantor, SSO biasanya lewat sistem identitas milik organisasinya sendiri. Kamu login sekali di pagi hari, lalu email, chat, dan file langsung terbuka, idenya sama dengan [[Identity and Access|networking/iam]].',
		'Satu kekuatan lagi. Kamu bisa menarik tokennya kapan aja dari akun Googlemu, dan nimbus.com langsung kehilangan akses. Coba pencet tombolnya kalau mau, passwordmu bahkan nggak perlu diganti.'
	],
	reactions: {
		revoke:
			'Hilang. Token nimbus.com langsung mati begitu kamu mencabutnya, jadi tokonya nggak bisa lihat apa apa lagi. Password Googlemu nggak berubah, dan memang nggak perlu.'
	},
	steps: [
		{
			tag: 'Masalahnya',
			title: 'Domino password',
			body: 'Satu password dipakai di banyak situs. Begitu situs paling lemah bocor, <b>semua</b> akun dengan password itu terbuka.'
		},
		{
			tag: 'Idenya',
			title: 'Single sign on',
			body: 'Satu akun yang dipercaya (misalnya Google) <b>menjamin</b> dirimu, jadi situs lain nggak butuh password sendiri.'
		},
		{
			tag: 'Cara lama',
			title: 'Nyerahin kunci',
			body: 'Dulu ada situs yang minta <b>password emailmu</b>. Dengan itu mereka bisa baca semuanya, bukan cuma kontak.'
		},
		{
			tag: 'Langkah 1',
			title: 'Dikirim ke Google',
			body: 'nimbus.com nggak minta password. Dia <b>mengirim browsermu</b> ke accounts.google.com.'
		},
		{
			tag: 'Langkah 2',
			title: 'Login di Google',
			body: 'Passwordnya cuma ke Google. nimbus.com bahkan nggak ada di halaman itu.'
		},
		{
			tag: 'Langkah 3',
			title: 'Izin',
			body: 'Google menampilkan apa yang diminta nimbus.com. Izinkan yang <b>benar benar perlu</b> buat toko.'
		},
		{
			tag: 'Langkah 4',
			title: 'Tokennya',
			body: 'nimbus.com dapat <b>token</b>, tiket terbatas, plus data yang kamu izinkan. Bukan passwordnya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Password pulang',
			body: 'Password Google tempatnya di <b>google.com</b>. Cek address bar sebelum mengetiknya.'
		},
		{
			tag: 'Di kantor',
			title: 'Sekali login, semua aplikasi',
			body: 'Sekolah dan kantor pakai ide yang sama. Sekali login di pagi hari membuka <b>email, chat, dan file</b>.'
		},
		{
			tag: 'Opsional',
			title: 'Tarik lagi',
			body: 'Cabut aksesnya dan tokennya berhenti bekerja. Passwordmu tetap sama persis.'
		}
	],
	sites: ['toko', 'game', 'sekolah', 'chat', 'email'],
	signInTitle: 'Masuk ke nimbus.com',
	googleBtn: 'Sign in with Google',
	orPassword: 'atau bikin password baru lagi',
	emailField: 'email',
	passwordField: 'password baru',
	badTitle: 'Cari temanmu',
	badField: 'Password emailmu',
	badSub: 'Janji cuma lihat kontak kok',
	googleTitle: 'Login',
	googleSub: 'untuk lanjut ke nimbus.com',
	googleEmail: 'kamu@gmail.com',
	nextBtn: 'Lanjut',
	consentTitle: 'nimbus.com ingin',
	scopes: {
		name: 'Melihat namamu',
		email: 'Melihat alamat emailmu',
		photo: 'Melihat foto profilmu'
	},
	allowBtn: 'Izinkan',
	welcomeTitle: 'Berhasil masuk',
	welcomeSub: 'sebagai kamu@gmail.com',
	gotTitle: 'Yang diterima nimbus.com',
	tokenChip: 'access token',
	passwordRow: 'Password Googlemu',
	neverTag: 'nggak pernah',
	apps: ['Email', 'Chat', 'File'],
	revokeBtn: 'Cabut akses nimbus.com',
	revokedTitle: 'Sudah keluar',
	revokedNote: 'Tokennya nggak berlaku lagi'
};
