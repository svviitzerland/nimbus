import type { CssText } from './types';

export const id: CssText = {
	title: 'Apa itu CSS',
	intro: [
		'Halaman nimbus.com sudah memiliki judul, paragraf, tombol, dan gambar. Sekarang kita atur warna, ukuran, serta jaraknya.',
		'<b>CSS</b>, Cascading Style Sheets, mengatur tampilan elemen HTML. Aturannya dapat mengubah warna teks, tata letak, dan bentuk tombol.',
		'CSS itu daftar aturan kecil. Tiap aturan pertama milih sesuatu di halaman pakai <b>selector</b>, misalnya <b>h1</b> buat semua judul, lalu nulis apa yang mau diubah di dalam kurung kurawal.',
		'Tiap baris di dalam aturan itu pasangan <b>property</b> dan <b>value</b>. Di <b>color tomato</b>, color itu property dan tomato itu value. Warna, huruf, jarak, dan tata letak semuanya bekerja dengan cara yang sama, satu baris demi satu baris.',
		'[fyi] Kata cascading artinya aturan bisa bertumpuk. Kalau dua aturan nggak sepakat, yang lebih spesifik menang, dan kalau sama spesifiknya, yang ditulis belakangan yang menang. Makanya satu baris tambahan bisa mengubah satu halaman penuh.',
		'[ingat] Selector memilih elemen, property memilih hal yang diubah, dan value menentukan nilainya. Pada h1 dengan color tomato, warna teks judul menjadi merah tomat.',
		'Giliran kamu! Stylesheet nimbus.com sudah punya beberapa value yang polos. Ganti satu baris tiap kali, dengan mengetik atau memencet value, dan lihat halamannya mulai dandan.'
	],
	reactions: {
		background:
			'Satu halaman ganti warna cuma dengan satu baris. Aturannya milih <b>body</b>, tag yang membungkus semua yang kamu lihat, jadi warna latarnya menyebar ke seluruh halaman.',
		color:
			'Sekarang judulnya punya warna sendiri. Cuma <b>h1</b> yang berubah, karena selectornya cuma milih tag itu. Paragrafnya tetap sama persis.',
		font: 'Huruf baru, dan semua teks ikut ganti sekaligus. Tag di dalam <b>body</b> meminjam hurufnya dari body (namanya pewarisan atau inheritance), jadi kamu cukup nulis sekali.',
		button:
			'Sudutnya jadi lembut! <b>border-radius</b> membulatkan ujung sebuah kotak. Tombol, kartu, dan foto profil di semua aplikasi yang kamu pakai dibentuk pakai baris kayak gini.',
		typo: 'Hmm, ada satu baris yang dilewati browser. CSS nggak pernah protes kalau ada salah ketik, dia diam diam mengabaikan baris itu. Jadi kalau halamannya nggak mau berubah, cari typo dulu.',
		center:
			'[fyi] <b>text-align</b> menaruh teks di tengah kotaknya. Mengatur kotak kotak ini bagian terbesar dari CSS, dan nanti kamu bakal lihat halaman menyusun ulang dirinya buat HP di [[desain responsif|web/responsive]].',
		done: 'HTML yang sama, tampilan yang beda total. Begitulah pembagiannya, HTML bilang sesuatu itu apa dan CSS bilang tampilannya gimana. Berikutnya, yuk bikin tombol itu beneran ngapa ngapain pakai [[JavaScript|web/js]].'
	},
	missionsLabel: 'Atur tampilan nimbus.com',
	missions: {
		background: 'Warnai latar halaman',
		color: 'Kasih warna ke judul',
		font: 'Pilih huruf baru',
		button: 'Bulatkan sudut tombol'
	},
	tryLabel: 'Pencet value buat mencobanya',
	extraLabel: 'Sedikit tambahan',
	cssLabel: 'style.css',
	htmlLabel: 'index.html',
	previewLabel: 'nimbus.com',
	page: {
		heading: 'Selamat datang di Nimbus',
		paragraph: 'Website pertamamu di cloud.',
		button: 'Mulai sekarang',
		alt: 'Nim si awan'
	},
	starterComment: 'Ganti satu value, lalu lihat halamannya',
	typoHint: 'Browser melewati "{line}" karena dia nggak mengenalnya',
	allDone: 'Empat perubahan CSS selesai',
	reset: 'Ulang dari awal'
};
