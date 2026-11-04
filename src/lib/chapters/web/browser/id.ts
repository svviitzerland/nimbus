import type { BrowserText } from './types';

export const id: BrowserText = {
	title: 'Cara kerja browser',
	intro: [
		'Kamu ketik <b>nimbus.com</b> dan halamannya muncul hampir seketika. Rasanya kayak satu barang yang datang, padahal browser kamu lagi diam diam nyusun halamannya sepotong demi sepotong. Yuk kita pelanin dan tonton.',
		'Pertama browser minta halamannya ke server lewat request [[HTTP|web/http]]. Yang balik satu file, <b>index.html</b>. Isinya cuma teks dengan [[tag|web/html]], jadi di layar belum ada apa apa.',
		'Browser membaca HTML itu dari atas ke bawah lalu mengubahnya jadi pohon keluarga. Tiap judul, paragraf, dan tombol jadi satu cabang. Pohon itu punya nama, <b>DOM</b>.',
		'Sekarang dia ngitung di mana tiap kotak harus ditaruh (namanya <b>layout</b>) lalu mewarnai pikselnya (namanya <b>paint</b>). Ini tampilan pertamanya. Huruf polos, tombol abu abu, dan satu tempat kosong yang nunggu gambar.',
		'Waktu membaca HTML tadi, browser sadar halamannya juga butuh <b>style.css</b>. File itu datang, tiap aturannya nemu cabangnya di pohon, dan halamannya dilukis ulang dengan warna aslinya.',
		'Lalu <b>nim.png</b> nyampe. Gambar sering jadi file paling berat, jadi biasanya datang paling akhir. Dia langsung masuk ke tempat yang udah disiapin HTML.',
		'Terakhir <b>app.js</b>, si JavaScript. Sekarang halamannya bisa bereaksi. Lihat tombol Suka ngitung sendiri, tanpa minta halaman baru ke server.',
		'[ingat] Ingat <b>3K, Kerangka, Kostum, Kelakuan.</b> HTML itu kerangkanya, CSS kostumnya, JavaScript kelakuannya. Datangnya juga biasanya urut begitu.',
		'[fyi] Kata sama, dunia beda. <b>Rendering</b> artinya mengubah kode jadi tampilan yang kamu lihat. Browser melakukannya di HP kamu, tapi server juga bisa merender HTML sebelum dikirim, para developer menyebutnya [[server side rendering|web/rendering]]. Kerjaannya sama, tempatnya beda.',
		'Penasaran CSS sebenarnya ngapain? Geser tombolnya buat mencopot CSS dan lihat halamannya kehilangan kostum. Atau nikmatin aja halaman jadinya, itu juga boleh.'
	],
	reactions: {
		nocss:
			'CSS dicopot, dan halamannya langsung balik ke kerangka. Tulisan, gambar, dan tombolnya masih ada semua, cuma kostumnya yang lepas. CSS mengubah tampilan, bukan isi.',
		cssback:
			'CSS nyala lagi. Browser mencocokkan tiap aturan ke pohonnya lagi lalu melukis ulang, sekejap mata.'
	},
	steps: [
		{
			tag: 'Awalnya',
			title: 'Ngetik nimbus.com',
			body: 'Semuanya mulai dari kolom alamat. Di baliknya, browser siap ngambil setumpuk kecil file.'
		},
		{
			tag: 'File 1',
			title: 'index.html',
			body: 'Halamannya, ditulis sebagai teks dengan tag. Dia bilang <b>apa</b> isi halamannya, bukan gimana tampilannya.'
		},
		{
			tag: 'Pohonnya',
			title: 'DOM',
			body: 'Pohon keluarga halaman. <b>body</b> itu induknya, dan judul, paragraf, serta tombol itu anak anaknya.'
		},
		{
			tag: 'Menggambar',
			title: 'Layout dan paint',
			body: '<b>Layout</b> nentuin posisi tiap kotak, <b>paint</b> mewarnai pikselnya. Ini diulang tiap ada yang baru datang.'
		},
		{
			tag: 'File 2',
			title: 'style.css',
			body: 'Warna, huruf, jarak, sudut yang membulat. Isinya tetap sama, cuma tampilannya yang berubah.'
		},
		{
			tag: 'File 3',
			title: 'nim.png',
			body: 'Gambar itu file sendiri dengan request sendiri. Teksnya nggak pernah nungguin dia.'
		},
		{
			tag: 'File 4',
			title: 'app.js',
			body: 'JavaScript mengubah pohonnya sambil kamu lihat, jadi halamannya bereaksi tanpa dimuat ulang.'
		},
		{
			tag: 'Cara gampang',
			title: '3K',
			body: '<b>Kerangka</b> itu HTML, <b>Kostum</b> itu CSS, <b>Kelakuan</b> itu JavaScript. Biasanya datang dengan urutan itu juga.'
		},
		{
			tag: 'Kata sama',
			title: 'Rendering',
			body: 'Mengubah kode jadi piksel. Biasanya terjadi di perangkatmu, kalau server side rendering mulainya di server.'
		},
		{
			tag: 'Opsional',
			title: 'Copot CSS nya',
			body: 'Geser tombolnya dan halamannya balik ke kerangka polos. Semua isinya masih ada, cuma tampilannya yang hilang.'
		}
	],
	filesLabel: 'File yang datang',
	domLabel: 'Pohon DOM',
	blank: 'Belum ada yang dilukis',
	page: {
		nav: ['Beranda', 'Blog', 'Tentang'],
		heading: 'Selamat datang di Nimbus',
		text: 'Belajar cara kerja internet, satu langkah kecil tiap kali.',
		alt: 'Nim si awan',
		like: 'Suka',
		tips: [
			'Tiap halaman itu setumpuk kecil file',
			'CSS mengubah tampilan, bukan isi',
			'JavaScript yang bikin halaman bereaksi',
			'Gambar biasanya datang paling akhir'
		]
	},
	cssToggle: 'CSS',
	on: 'nyala',
	off: 'mati'
};
