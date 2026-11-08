import type { ApiText } from '../../types';

export const id: ApiText = {
	title: 'Frontend, backend, dan API',
	intro: [
		'Tadi browser dapat halaman web utuh. Tapi aplikasi yang kamu pakai tiap hari kerjanya beda. Bagian yang kamu lihat dan pencet, daftar dan tombolnya, itu namanya <b>frontend</b>.',
		'Frontend ini tidak menyimpan data aslinya. Produk, harga, dan akun yang sebenarnya ada di komputer jauh, namanya <b>backend</b>. Frontend cuma menampilkan, backend yang menyimpan.',
		'Keduanya nyambung lewat <b>API</b>, semacam pelayan di antara mereka. Frontend minta satu hal, API mengantar permintaannya ke backend, backend kasih datanya, lalu dibawa balik ke layar.',
		'Lihat sendiri. Layar HP-mu masih kosong karena belum minta apa apa. Pencet minta data, dan perhatikan perjalanannya bolak balik lewat API sampai layarnya terisi.',
		'[ingat] API menentukan cara aplikasi saling meminta dan bertukar data.'
	],
	reactions: {
		fetch:
			'Nah, gitu cara API bekerja. Frontend minta, backend yang punya datanya menjawab, dan layar pun terisi. Hampir semua aplikasi begini. Nanti kita lihat, API sendiri punya beberapa gaya.'
	},
	frontendLabel: 'Frontend',
	frontendSub: 'yang kamu lihat',
	backendLabel: 'Backend',
	backendSub: 'tempat data',
	apiLabel: 'API',
	appTitle: 'Toko Nimbus',
	tableLabel: 'products',
	emptyHint: 'Belum ada data',
	fetchBtn: 'Minta data ke server',
	reqLabel: 'minta produk',
	respLabel: 'data produk',
	products: [
		{ id: 1, name: 'Stiker Awan', price: 15000 },
		{ id: 2, name: 'Topi Nimbus', price: 90000 },
		{ id: 3, name: 'Kaos Server', price: 120000 }
	]
};
