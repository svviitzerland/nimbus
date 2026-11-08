import type { HtmlText } from './types';

export const id: HtmlText = {
	title: 'Apa itu HTML',
	intro: [
		'Server mengirim dokumen <b>HTML</b> ke browser. Dokumen ini berupa teks yang menjelaskan isi dan struktur halaman.',
		'Teks biasa itu nggak punya bentuk. Browser nggak tahu baris mana yang judul besar, mana yang kalimat, atau di mana tombolnya harus ada. Jadi semuanya dia gabung jadi satu baris panjang.',
		'<b>HTML</b> memberi jenis pada elemen halaman, misalnya judul, paragraf, dan tombol. Elemen ditulis menggunakan <b>tag</b>.',
		'Tag itu dibuka lalu ditutup, kayak sepasang kurung. <b>&lt;h1&gt;</b> membuka judul dan <b>&lt;/h1&gt;</b> menutupnya (lihat garis miringnya). Apa pun yang ada di antara keduanya jadi judul.',
		'Ada beberapa tag yang bakal kamu temui di mana mana. <b>&lt;h1&gt;</b> buat judul, <b>&lt;p&gt;</b> buat paragraf, <b>&lt;button&gt;</b> buat tombol, <b>&lt;a&gt;</b> buat link, dan <b>&lt;img&gt;</b> buat gambar. Yang terakhir ini nggak punya teks di dalamnya, jadi nggak perlu ditutup.',
		'Pada link <b>&lt;a href="/about"&gt;</b>, href menentukan halaman tujuan. Form memakai <b>&lt;form&gt;</b> untuk mengelompokkan isian dan <b>&lt;input&gt;</b> untuk menerima ketikan. Coba tag link di sini. Pengiriman dan validasi form bisa kamu mainkan di [[Form dan validasi|web/forms]].',
		'[fyi] HTML menyusun elemen. [[CSS|web/css]] mengatur tampilannya, sedangkan [[JavaScript|web/js]] menambahkan perilaku dan interaksi.',
		'[ingat] <b>HTML menentukan jenis dan susunan elemen.</b> [[CSS|web/css]] mengatur tampilannya. [[JavaScript|web/js]] menambahkan perilaku dan interaksi.',
		'Giliran kamu! nimbus.com sekarang masih polos. Yuk bangun halaman depannya lewat empat misi kecil. Pencet tag buat menambahkannya, atau ketik sendiri, terus lihat browsernya ikut berubah.'
	],
	reactions: {
		heading:
			'Nah, itu dia judul beneran. Sekarang browser tahu baris itu judul besar halamannya, jadi ditampilkan gede dan tebal.',
		paragraph:
			'<b>&lt;p&gt;</b> menandai paragraf. Browser menampilkannya sebagai blok teks dengan gaya bawaan yang dapat diubah lewat CSS.',
		button:
			'Ada tombol! Coba pencet, belum terjadi apa apa kan? Soalnya HTML cuma bikin bentuknya. Bikin tombolnya beneran ngapa ngapain itu tugas [[JavaScript|web/js]].',
		image:
			'Lihat, Nim muncul di halaman. <b>&lt;img&gt;</b> nunjuk ke gambar lewat <b>src</b>, dan <b>alt</b> menjelaskan gambarnya buat yang nggak bisa melihatnya. Nggak perlu tag penutup.',
		link: '[fyi] Itu namanya link. <b>href</b> bilang link itu menuju ke mana. Link inilah yang bikin kumpulan halaman jadi sebuah jaringan (web), tiap halaman saling nunjuk ke halaman lain.',
		unclosed:
			'Hmm, ada satu tag yang masih kebuka. Tiap tag pembuka kayak <b>&lt;p&gt;</b> butuh pasangannya yang pakai garis miring, <b>&lt;/p&gt;</b>, kalau nggak browser harus nebak sendiri di mana ujungnya.',
		done: 'Halaman sudah memiliki judul, paragraf, tombol, dan gambar. Struktur HTML ini dapat diberi tata letak serta warna menggunakan [[CSS|web/css]].'
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
	allDone: 'Empat elemen HTML selesai',
	reset: 'Ulang dari awal'
};
