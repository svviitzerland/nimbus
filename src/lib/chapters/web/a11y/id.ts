import type { A11yText } from './types';

export const id: A11yText = {
	title: 'Aksesibilitas',
	intro: [
		'Coba tutup mata, lalu pesan sesuatu lewat HP. Kedengarannya mustahil? Jutaan orang melakukannya tiap hari. Mereka tunanetra atau penglihatannya terbatas, dan mereka memakai web lewat <b>screen reader</b> (pembaca layar).',
		'Screen reader itu aplikasi yang membacakan halaman keras keras, satu bagian demi satu bagian. Lihat dia menelusuri halaman daftar nimbus.com. Ada bagian yang kedengarannya aneh, dan ada satu yang nggak pernah dibaca sama sekali.',
		'Dia cuma bisa membaca apa yang dikasih tahu kodenya. Gambarnya nggak punya teks <b>alt</b>, jadi yang bisa dia sebut cuma nama file. Nim menambah keterangan singkat, dan sekarang gambarnya masuk akal walau cuma didengar.',
		'Kotak isiannya cuma bilang "kolom teks, kosong". Kolom buat apa? Nim menambah <b>label</b> dan menyambungkannya ke kotak, jadi pembacanya bilang Email duluan.',
		'Kotak Langganan kelihatannya tombol, tapi sebenarnya div biasa, jadi pembacanya melompatinya begitu aja. Nim menggantinya dengan <b>button</b> beneran, dan sekarang dia diumumkan, bisa dicapai pakai tombol Tab, dan bisa ditekan pakai Enter.',
		'Bikin halaman bisa dipakai semua orang itu namanya <b>aksesibilitas</b>, sering ditulis a11y (huruf a, lalu 11 huruf, lalu y). Ini juga membantu orang yang nggak bisa pakai mouse, dan siapa pun yang menyipitkan mata ke HP di bawah terik matahari.',
		'Warna juga penting. Abu abu muda di atas putih memang kelihatan elegan, tapi banyak orang nggak bisa membacanya. Seberapa menonjol teks dari latarnya disebut <b>kontras</b>, dan teks biasa butuh minimal 4,5 banding 1. Nim menggelapkannya.',
		'[fyi] Kata yang sama, dunia yang beda. Jalur landai di samping tangga itu aksesibilitas di sebuah gedung. Awalnya dibikin buat kursi roda, eh ternyata semua orang yang dorong stroller atau geret koper juga suka. Web juga begitu.',
		'[ingat] Hafalkan tiga pasangan ini, <b>gambar pakai alt, kotak pakai label, klik pakai button</b>. Tambah satu angka, teks kecil minimal 4,5 banding 1.',
		'nimbus.com sekarang bisa dipakai dengan mata tertutup. Pakai penutup mata kalau mau mengikutinya cuma lewat telinga. Aksesibilitas yang baik kebanyakan cuma HTML yang dipakai sesuai fungsinya, dan itu bagian besar dari [[UX|web/ui-ux]] yang baik.'
	],
	reactions: {
		blind:
			'Semuanya gelap. Sekarang teks di bawah, dan suaranya kalau perangkatmu punya, jadi satu satunya cara tahu isi halaman ini.'
	},
	steps: [
		{
			tag: 'Screen reader',
			title: 'Membacakan halaman',
			body: 'Aplikasi yang membaca halaman satu bagian demi satu bagian. Semua HP dan laptop sudah punya bawaannya.'
		},
		{
			title: 'Mendengarkan halaman',
			body: 'Cincinnya menunjukkan posisi pembaca, pita di bawah menunjukkan apa yang dia ucapkan. Ada yang janggal.'
		},
		{
			title: 'Teks alt',
			body: '<b>alt</b> menjelaskan gambar dengan kata kata. Tanpa itu, pembacanya cuma bisa menyebut nama file.'
		},
		{
			title: 'Label',
			body: '<b>label</b> memberi nama kotak isian. Disambung ke kotaknya lewat <b>for</b> dan <b>id</b>, jadi pembacanya tahu isinya buat apa.'
		},
		{
			title: 'Tombol beneran',
			body: '<b>div</b> cuma mirip tombol. <b>button</b> beneran diumumkan, bisa dicapai pakai Tab, dan ditekan pakai Enter.'
		},
		{
			title: 'Buat semua orang',
			body: 'Pengguna keyboard, orang yang penglihatannya lemah, orang di bawah terik matahari. HTML yang baik menolong semuanya sekaligus.'
		},
		{
			title: 'Kontras',
			body: 'Seberapa menonjol teks dari latarnya. Teks biasa butuh minimal <b>4,5 banding 1</b>.'
		},
		{
			title: 'Jalur landai',
			body: 'Dibikin buat kursi roda, disukai stroller dan koper. Halaman yang aksesibel juga lebih gampang buat semua orang.'
		},
		{
			tag: 'Cara ingat',
			title: 'Gambar, kotak, klik',
			body: 'Gambar pakai <b>alt</b>, kotak pakai <b>label</b>, klik pakai <b>button</b>. Teks kecil minimal 4,5 banding 1.'
		},
		{
			title: 'Coba penutup mata',
			body: 'Tutup layarnya dan ikuti halaman cuma lewat telinga, kayak pengguna screen reader.'
		}
	],
	htmlLabel: 'daftar.html',
	previewLabel: 'nimbus.com/gabung',
	readerLabel: 'Kata screen reader',
	readerIdle: 'Belum ada, pembacanya sebentar lagi mulai',
	roles: { image: 'gambar', heading: 'judul level 1', editText: 'kolom teks', button: 'tombol' },
	blank: 'kosong',
	skipped: '(hening, dia melompati sebuah kotak yang bisa diklik)',
	endOfPage: 'akhir halaman',
	voiceLang: 'id-ID',
	page: {
		heading: 'Gabung newsletter Nimbus',
		tagline: 'Tips cloud tiap Jumat, tanpa spam.',
		email: 'Email',
		subscribe: 'Langganan',
		alt: 'Nim si awan, logo Nimbus'
	},
	contrastLabel: 'Kontras teks kecil',
	ratio: '{n} banding 1',
	need: 'minimal 4,5',
	blindfold: 'Penutup mata',
	cover: 'Kamu nggak bisa lihat layarnya, dengarkan aja'
};
