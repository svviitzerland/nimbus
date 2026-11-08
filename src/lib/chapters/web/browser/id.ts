import type { BrowserText } from './types';

export const id: BrowserText = {
	title: 'Cara kerja browser',
	intro: [
		'Saat nimbus.com dibuka, browser meminta HTML dan sumber daya yang diperlukan. Browser memprosesnya untuk menampilkan halaman dan menjalankan interaksi.',
		'Request [[HTTP|web/http]] pertama pada contoh ini meminta file <b>HTML</b>. File tersebut menyusun elemen halaman menggunakan [[tag|web/html]].',
		'Browser membaca HTML itu dari atas ke bawah lalu mengubahnya jadi sebuah pohon, tiap judul, paragraf, dan tombol jadi satu cabang. Pohon itu namanya <b>DOM</b>. Sambil membaca, dia nemu file lain yang dibutuhkan halamannya dan minta juga.',
		'Biasanya ada file <b>CSS</b> buat tampilannya (warna, huruf, jarak), gambar kayak <b>nim.png</b>, dan file <b>JavaScript</b> yang bikin halaman bisa gerak dan bereaksi. Masing masing punya request kecilnya sendiri.',
		'Tiap ada potongan baru, browser ngitung di mana tiap kotak harus ditaruh (namanya <b>layout</b>) lalu mewarnai piksel di layar kamu (namanya <b>paint</b>). Biasanya semua ini selesai jauh di bawah satu detik.',
		'[fyi] Kata sama, dunia beda. <b>Rendering</b> artinya mengubah kode jadi tampilan yang kamu lihat. Browser melakukannya di HP kamu, tapi server juga bisa merender HTML sebelum dikirim, para developer menyebutnya server side rendering. Kerjaannya sama, tempatnya beda.',
		'[ingat] <b>HTML menyusun isi, CSS mengatur tampilan, JavaScript menambahkan perilaku.</b> Browser memproses ketiganya untuk menampilkan halaman.',
		'Minta nimbus.com, lalu amati perubahan halaman saat HTML, CSS, gambar, dan JavaScript diproses. Urutan dibuat bertahap agar mudah dilihat.'
	],
	reactions: {
		html: 'HTML diterima dan browser membentuk DOM. Halaman masih memakai tampilan bawaan karena CSS belum diterapkan. Gambar diminta melalui request terpisah.',
		css: 'style.css diterima. Browser menerapkan aturan warna, ukuran, dan tata letak pada elemen yang cocok.',
		img: 'nim.png sampai dan dilukis di tempat yang sudah disiapkan HTML. Gambar sering jadi file paling berat, makanya di internet lemot kamu lihat teksnya dulu, gambarnya nyusul belakangan.',
		deadbutton:
			'Tombol sudah ditampilkan, tetapi kode untuk menambah hitungan belum dimuat. Muat JavaScript agar tindakan ini tersedia.',
		js: 'app.js sekarang jalan. Pencet Suka dan lihat angkanya nambah, terus perhatiin baris kecil di bawahnya ganti sendiri. Habis itu coba matikan CSS atau JavaScript buat lihat tugas masing masing.',
		liked:
			'Angkanya naik tanpa minta halaman baru ke server. Itu JavaScript yang mengubah DOM langsung di HP kamu, dan browser cuma melukis ulang bagian kecil itu.',
		nocss:
			'CSS dinonaktifkan. Isi HTML dan tombol Suka tetap ada, tetapi tampilannya kembali memakai gaya bawaan browser.',
		nojs: 'JavaScript dinonaktifkan. Tampilan tetap ada, tetapi tombol Suka tidak lagi menambah hitungan.',
		again: 'Tab dikosongkan. Jalankan lagi untuk melihat peran tiap file dalam contoh ini.'
	},
	steps: ['Minta nimbus.com', 'Ambil style.css', 'Ambil nim.png', 'Ambil app.js'],
	again: 'Kosongkan tab',
	networkLabel: 'File yang datang',
	downloading: '{file} lagi di jalan',
	fileRoles: {
		html: 'struktur halaman',
		css: 'tampilan halaman',
		img: 'sebuah gambar',
		js: 'interaksi halaman'
	},
	work: [
		'Tab kosong, belum minta apa apa',
		'Membaca HTML, menyusun DOM, melukisnya polos',
		'Mencocokkan aturan CSS, menata ulang, melukis berwarna',
		'Melukis gambar di tempatnya',
		'Menjalankan JavaScript, halamannya sekarang bisa bereaksi'
	],
	blank: 'Belum ada apa apa',
	page: {
		nav: ['Beranda', 'Blog', 'Tentang'],
		heading: 'Selamat datang di Nimbus',
		text: 'Belajar cara kerja internet yang sebenarnya, satu game kecil demi satu game kecil.',
		alt: 'Nim si awan',
		like: 'Suka',
		tips: [
			'Tiap halaman itu tumpukan kecil file',
			'CSS mengubah tampilan, bukan isinya',
			'JavaScript yang bikin halaman bereaksi',
			'Gambar biasanya datang paling akhir'
		]
	},
	cssToggle: 'CSS',
	jsToggle: 'JavaScript',
	on: 'nyala',
	off: 'mati'
};
