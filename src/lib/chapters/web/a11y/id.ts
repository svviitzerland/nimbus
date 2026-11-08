import type { A11yText } from './types';

export const id: A11yText = {
	title: 'Aksesibilitas',
	intro: [
		'Coba tutup mata, lalu pesan sesuatu lewat HP. Kedengarannya mustahil? Jutaan orang melakukannya tiap hari. Mereka tunanetra atau penglihatannya terbatas, dan mereka memakai web lewat <b>screen reader</b> (pembaca layar).',
		'Screen reader itu aplikasi yang membacakan halaman keras keras, satu bagian demi satu bagian. Kamu geser atau tekan Tab buat pindah, dan dia bilang tiap bagian itu apa, misalnya judul atau tombol, plus isinya.',
		'Tapi dia cuma bisa membaca apa yang dikasih tahu kodenya. Gambar tanpa teks <b>alt</b> cuma jadi nama file. Kotak isian tanpa <b>label</b> cuma jadi "kolom teks, kosong". Kotak yang bisa diklik tapi bukan tombol beneran malah dilewati sama sekali.',
		'Bikin halaman bisa dipakai semua orang itu namanya <b>aksesibilitas</b>, sering disingkat a11y (huruf a, lalu 11 huruf, lalu y). Ini juga mencakup orang yang nggak bisa pakai mouse, yang penglihatannya lemah, dan siapa pun yang menyipitkan mata ke HP di bawah terik matahari.',
		'Warna juga penting. Teks abu abu muda di atas putih memang kelihatan elegan, tapi banyak orang nggak bisa membacanya. Seberapa beda teks dengan latarnya disebut <b>kontras</b>, dan ada batas minimal yang harus dicapai.',
		'[fyi] Kata yang sama, dunia yang beda. Jalur landai di samping tangga itu aksesibilitas di sebuah gedung. Awalnya dibikin buat kursi roda, eh ternyata semua orang yang dorong stroller atau geret koper juga suka. Web juga begitu.',
		'[ingat] Hafalkan tiga pasangan ini, <b>gambar pakai alt, kotak pakai label, klik pakai button</b>. Tambah satu angka, teks kecil minimal 4,5 banding 1.',
		'Giliran kamu! Pakai penutup mata dan dengarkan halaman daftar nimbus.com lewat screen reader. Betulkan tiap bagian yang kedengarannya salah, lalu betulkan teks yang susah dilihat.'
	],
	reactions: {
		blind:
			'Semuanya gelap. Sekarang satu satunya cara tahu isi halaman ini adalah dengan mendengarkan. Telusuri satu bagian demi satu bagian.',
		alt: 'Jauh lebih baik. Tadi pembacanya cuma bisa menyebut nama file. Dengan teks <b>alt</b> dia menjelaskan gambarnya, alt yang sama yang kamu temui di [[HTML|web/html]].',
		label:
			'Sekarang pembacanya bilang kotak itu buat apa. <b>label</b> yang terhubung ke kotak juga membantu orang yang bisa melihat, pencet tulisannya dan kursor langsung masuk ke kotak.',
		button:
			'Tombol beneran! Pembacanya mengumumkannya, Tab bisa mencapainya, dan Enter bisa menekannya. Kotak biasa yang cuma mendengarkan klik nggak dapat semua itu secara gratis.',
		contrast:
			'Akhirnya terbaca. Rasio 4,5 banding 1 itu batas minimal resmi buat teks biasa di WCAG, buku aturan aksesibilitas web yang dipakai di seluruh dunia.',
		done: 'nimbus.com sekarang bisa dipakai dengan mata tertutup, tanpa mouse, dan di bawah terik matahari. Aksesibilitas yang baik kebanyakan cuma HTML yang dipakai sesuai fungsinya, dan itu bagian besar dari [[UX|web/ui-ux]] yang baik juga.'
	},
	missionsLabel: 'Bikin nimbus.com bisa dipakai semua orang',
	missions: {
		alt: 'Kasih gambarnya keterangan',
		label: 'Kasih tahu kotak itu buat apa',
		button: 'Bikin tombolnya bisa dicapai',
		contrast: 'Bikin teks kecilnya terbaca'
	},
	blindfold: 'Penutup mata',
	next: 'Bagian berikutnya',
	restart: 'Dari atas',
	voice: 'Suara',
	voiceLang: 'id-ID',
	readerLabel: 'Kata screen reader',
	readerIdle: 'Belum ada, pindah ke bagian berikutnya buat mulai',
	cover: 'Kamu nggak bisa melihat layar, dengarkan aja',
	roles: { image: 'gambar', heading: 'judul level 1', editText: 'kolom teks', button: 'tombol' },
	blank: 'kosong',
	skipped: '(hening, pembacanya langsung melompati sebuah kotak yang bisa diklik)',
	endOfPage: 'akhir halaman',
	page: {
		heading: 'Gabung newsletter Nimbus',
		tagline: 'Tips cloud tiap Jumat, dijamin tanpa spam.',
		email: 'Email',
		subscribe: 'Langganan',
		alt: 'Nim si awan, logo Nimbus'
	},
	fixLabel: 'Betulkan',
	fixes: {
		alt: 'Tambahkan teks alt yang menjelaskan gambarnya',
		label: 'Tambahkan label ke kotaknya',
		button: 'Pakai tombol beneran yang punya nama'
	},
	contrastLabel: 'Kontras teks kecil',
	ratio: '{n} banding 1',
	need: 'minimal 4,5',
	darker: 'Warna teks, terang ke gelap',
	allDone: 'Empat perbaikan aksesibilitas selesai'
};
