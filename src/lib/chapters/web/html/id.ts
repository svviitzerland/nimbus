import type { HtmlText } from './types';

export const id: HtmlText = {
	title: 'Apa itu HTML',
	intro: [
		'Waktu kamu buka <b>nimbus.com</b>, server ngirim sebuah file ke browser kamu. Dan ini kejutannya, file itu cuma <b>teks biasa</b>. Huruf dan kata, sama kayak yang kamu ketik di chat.',
		'Teks biasa itu nggak punya bentuk. Browser nggak tahu baris mana yang judul besar, mana yang kalimat, atau di mana tombolnya harus ada. Jadi semuanya dia gabung jadi satu baris panjang.',
		'Di sinilah <b>HTML</b> masuk. Anggap aja HTML itu <b>kerangka</b> sebuah halaman. Dia membungkus potongan teks pakai label kecil yang namanya <b>tag</b>, jadi tiap potongan tahu dirinya itu apa.',
		'Tag itu dibuka lalu ditutup, kayak sepasang kurung. <b>&lt;h1&gt;</b> membuka judul dan <b>&lt;/h1&gt;</b> menutupnya (lihat garis miringnya). Apa pun yang ada di antara keduanya jadi judul.',
		'Ada beberapa tag yang bakal kamu temui di mana mana. <b>&lt;h1&gt;</b> buat judul, <b>&lt;p&gt;</b> buat paragraf, <b>&lt;button&gt;</b> buat tombol, <b>&lt;a&gt;</b> buat link, dan <b>&lt;img&gt;</b> buat gambar. Yang terakhir ini nggak punya teks di dalamnya, jadi nggak perlu ditutup.',
		'[fyi] Kerangka cuma bilang tiap bagian itu apa. Soal tampilannya (warna, huruf, jarak) itu tugas [[CSS|web/css]], dan bikin halamannya bereaksi waktu dipencet itu tugas [[JavaScript|web/js]]. Nanti kita bahas dua duanya.',
		'Giliran kamu! nimbus.com sekarang masih polos. Yuk bangun halaman depannya lewat empat misi kecil. Pencet tag buat menambahkannya, atau ketik sendiri, terus lihat browsernya ikut berubah.'
	],
	reactions: {
		heading:
			'Nah, itu dia judul beneran. Sekarang browser tahu baris itu judul besar halamannya, jadi ditampilkan gede dan tebal.',
		paragraph:
			'Mantap, paragraf. <b>&lt;p&gt;</b> bilang ke browser ini blok teks biasa, jadi dia dapat barisnya sendiri dengan sedikit jarak di sekitarnya.',
		button:
			'Ada tombol! Coba pencet, belum terjadi apa apa kan? Soalnya HTML cuma bikin bentuknya. Bikin tombolnya beneran ngapa ngapain itu tugas [[JavaScript|web/js]].',
		image:
			'Lihat, Nim muncul di halaman. <b>&lt;img&gt;</b> nunjuk ke gambar lewat <b>src</b>, dan <b>alt</b> menjelaskan gambarnya buat yang nggak bisa melihatnya. Nggak perlu tag penutup.',
		link: '[fyi] Itu namanya link. <b>href</b> bilang link itu menuju ke mana. Link inilah yang bikin kumpulan halaman jadi sebuah jaringan (web), tiap halaman saling nunjuk ke halaman lain.',
		unclosed:
			'Hmm, ada satu tag yang masih kebuka. Tiap tag pembuka kayak <b>&lt;p&gt;</b> butuh pasangannya yang pakai garis miring, <b>&lt;/p&gt;</b>, kalau nggak browser harus nebak sendiri di mana ujungnya.',
		done: 'Keren, nimbus.com sekarang punya kerangka beneran. Ada judul, paragraf, tombol, dan gambar. Tapi tampilannya masih polos banget ya, nah buat mendandaninya itu tugas [[CSS|web/css]].'
	},
	missionsLabel: 'Bangun halaman depan nimbus.com',
	missions: {
		heading: 'Kasih halamannya judul pakai h1',
		paragraph: 'Tambahkan paragraf pakai p',
		button: 'Tambahkan tombol',
		image: 'Pasang gambar Nim pakai img'
	},
	chipsLabel: 'Pencet tag buat menambahkannya',
	editorLabel: 'index.html',
	previewLabel: 'nimbus.com',
	starter: 'Selamat datang di Nimbus\nWebsite pertamamu di cloud\nMulai sekarang',
	snippets: {
		heading: 'Selamat datang di Nimbus',
		paragraph: 'Website pertamamu di cloud.',
		button: 'Mulai sekarang',
		link: 'Baca blognya',
		alt: 'Nim si awan'
	},
	unclosedHint: '{open} masih kebuka, tutup pakai {close}',
	allDone: 'Empat misi beres, mantap',
	reset: 'Ulang dari awal'
};
