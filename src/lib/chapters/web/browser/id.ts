import type { BrowserText } from './types';

export const id: BrowserText = {
	title: 'Cara kerja browser',
	intro: [
		'Kamu ketik <b>nimbus.com</b> dan halamannya muncul hampir seketika. Rasanya kayak satu barang yang datang, padahal di belakang layar browser kamu lagi ngurusin setumpuk file dan nyusun halamannya sepotong demi sepotong.',
		'Pertama dia minta halamannya ke server lewat request [[HTTP|web/http]]. Yang balik adalah file <b>HTML</b>, kerangka halamannya, cuma teks yang dibungkus [[tag|web/html]].',
		'Browser membaca HTML itu dari atas ke bawah lalu mengubahnya jadi sebuah pohon, tiap judul, paragraf, dan tombol jadi satu cabang. Pohon itu namanya <b>DOM</b>. Sambil membaca, dia nemu file lain yang dibutuhkan halamannya dan minta juga.',
		'Biasanya ada file <b>CSS</b> buat tampilannya (warna, huruf, jarak), gambar kayak <b>nim.png</b>, dan file <b>JavaScript</b> yang bikin halaman bisa gerak dan bereaksi. Masing masing punya request kecilnya sendiri.',
		'Tiap ada potongan baru, browser ngitung di mana tiap kotak harus ditaruh (namanya <b>layout</b>) lalu mewarnai piksel di layar kamu (namanya <b>paint</b>). Biasanya semua ini selesai jauh di bawah satu detik.',
		'[fyi] Kata sama, dunia beda. <b>Rendering</b> artinya mengubah kode jadi tampilan yang kamu lihat. Browser melakukannya di HP kamu, tapi server juga bisa merender HTML sebelum dikirim, para developer menyebutnya server side rendering. Kerjaannya sama, tempatnya beda.',
		'Giliran kamu, versi gerak lambat. Minta nimbus.com, lalu biarkan tiap file datang satu per satu, dan lihat halamannya tumbuh, kerangka dulu, lalu warna, lalu bagian yang bergerak.'
	],
	reactions: {
		html: 'HTML nya sampai, dan browser langsung bikin DOM lalu melukisnya. Polos banget kan? Huruf bawaan, link bergaris bawah, tombol abu abu. Itulah kerangka mentahnya. Gambarnya juga belum ada, soalnya dia file terpisah yang masih di jalan.',
		css: 'style.css mendarat. Browser mencocokkan tiap aturan ke bagian DOM nya, menata ulang kotak kotaknya, lalu melukis lagi. Isinya sama, tampilannya beda total. CSS nggak pernah mengubah isi halaman, cuma tampilannya.',
		img: 'nim.png sampai dan dilukis di tempat yang sudah disiapkan HTML. Gambar sering jadi file paling berat, makanya di internet lemot kamu lihat teksnya dulu, gambarnya nyusul belakangan.',
		deadbutton:
			'Kamu pencet Suka dan nggak terjadi apa apa. Tombolnya udah digambar, tapi belum ada JavaScript yang ngasih tahu dia harus ngapain. HTML dan CSS cuma bisa menampilkan, nggak bisa bereaksi.',
		js: 'app.js sekarang jalan. Pencet Suka dan lihat angkanya nambah, terus perhatiin baris kecil di bawahnya ganti sendiri. Habis itu coba matikan CSS atau JavaScript buat lihat tugas masing masing.',
		liked:
			'Angkanya naik tanpa minta halaman baru ke server. Itu JavaScript yang mengubah DOM langsung di HP kamu, dan browser cuma melukis ulang bagian kecil itu.',
		nocss:
			'CSS dimatikan, dan halamannya langsung balik ke kerangka. Semuanya masih ada dan Suka masih jalan, cuma bajunya aja yang lepas.',
		nojs: 'JavaScript dimatikan. Tampilannya masih cakep, tapi Suka jadi mati dan baris kecilnya membeku. Ada situs yang rusak total tanpa JavaScript, jadi halaman yang baik tetap menampilkan isinya walau tanpa itu.',
		again:
			'Balik ke tab kosong. Coba jalankan lagi dan perhatikan urutannya, selalu kerangka dulu, lalu tampilan, lalu bagian yang bergerak.'
	},
	steps: ['Minta nimbus.com', 'Ambil style.css', 'Ambil nim.png', 'Ambil app.js'],
	again: 'Kosongkan tab',
	networkLabel: 'File yang datang',
	downloading: '{file} lagi di jalan',
	fileRoles: {
		html: 'kerangkanya',
		css: 'tampilannya',
		img: 'sebuah gambar',
		js: 'bagian yang bergerak'
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
