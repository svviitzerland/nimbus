import type { ExperimentText } from '../../types';
export const id: ExperimentText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope:
		'Model lokal POST berbasis cookie. Saat Strict mati, lab mengasumsikan cookie boleh dikirim lintas situs. Perilaku nyata bergantung pada atribut cookie dan browser.',
	title: 'CSRF',
	intro: [
		'Kamu masih login di nimbus.com, lalu membuka halaman lain. Dalam kondisi tertentu, halaman lain dapat menyuruh browser mengirim request ke nimbus.com. Browser bisa menyertakan cookie sesi secara otomatis.',
		'<b>CSRF</b>, cross site request forgery, memanfaatkan keadaan itu untuk menjalankan tindakan yang tidak dimaksudkan pengguna. Cookie membuktikan sesi, tetapi belum membuktikan bahwa kamu ingin mengubah profil.',
		'Kirim request dari halaman luar pada lab. Nama akun berubah meski kamu tidak mengisinya di Nimbus. Penyerang tidak harus bisa membaca response agar perubahan di server terjadi.',
		'Aktifkan pemeriksaan <b>token CSRF</b>. Form resmi memiliki token yang terkait dengan sesi dan dapat diperiksa server. Halaman luar dalam model ini tidak tahu token itu, jadi request ditolak.',
		'<b>SameSite</b> mengatur kapan cookie ikut dalam request lintas situs. Pilihan Strict pada lab menahan cookie dari halaman luar. Aplikasi sungguhan juga dapat memeriksa Origin dan memakai perlindungan framework yang sesuai.',
		'[ingat] <b>Cookie mengenali sesi, token membantu memeriksa asal tindakan.</b> Uji juga form resmi supaya pertahanan tetap membiarkan pengguna bekerja.'
	],
	reactions: {
		forged:
			'Request palsu membawa cookie login dan nama akun berubah. Tanpa token, server belum membedakan tindakan resmi dari request yang dipicu halaman luar.',
		blocked:
			'Token tidak valid, server menjawab 403 dan tidak mengubah nama. Sekarang coba request dari form Nimbus.',
		valid:
			'Form Nimbus punya sesi dan token yang sesuai. Perubahan yang diminta pengguna tetap berhasil.',
		cookie:
			'Cookie tidak ikut pada request lintas situs ini, jadi server tidak mengenali sesi dan menjawab 401.'
	},
	goal: 'Lindungi perubahan profil tanpa mematikan form',
	tasks: ['Coba request dari luar', 'Tolak token yang hilang', 'Uji form resmi'],
	hint: 'Kirim dari luar dengan kedua perlindungan mati. Nyalakan token dan ulangi. Pilih nimbus.com lalu kirim lagi.',
	labels: {
		source: 'Halaman pemicu request',
		outside: 'Halaman luar Nimbus',
		send: 'Kirim perubahan nama',
		token: 'Server memeriksa token CSRF',
		strict: 'Cookie memakai SameSite Strict',
		cookieNote:
			'Model dimulai dengan cookie lintas situs diizinkan. SameSite Lax memiliki aturan lain dan tidak dimodelkan di sini.',
		request: 'Request ke server Nimbus',
		account: 'Nama akun tersimpan',
		waiting: 'Belum ada response'
	}
};
