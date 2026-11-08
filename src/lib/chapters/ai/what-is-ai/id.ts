import type { WhatIsAiText } from './types';

export const id: WhatIsAiText = {
	title: 'Apa itu AI',
	intro: [
		'Bayangkan kalkulator. Kamu ketik 7 kali 8, dia jawab 56. Dia sama sekali nggak mikir. Ada orang yang menulis aturan perkalian itu dengan tangan, dan programnya tinggal mengikuti, langkah demi langkah. Itu namanya <b>program biasa</b>.',
		'Tapi kadang mesin bisa melakukan hal yang <i>kelihatan</i> pintar, misalnya mengalahkanmu main catur atau mengenali wajahmu. Semua mesin seperti itu masuk ke satu payung besar bernama <b>AI</b>, singkatan dari artificial intelligence (kecerdasan buatan).',
		'<b>Machine learning</b>, disingkat ML, adalah bagian dari AI yang mempelajari pola dari data. Pengembang menulis algoritma pelatihannya, lalu proses pelatihan menyesuaikan parameter model berdasarkan contoh.',
		'<b>Deep learning</b> memakai [[neural network|ai/neural-net]] dengan banyak lapisan. Pendekatan ini digunakan untuk tugas seperti pengenalan gambar, suara, dan pengolahan bahasa.',
		'Lalu paling tengah ada <b>AI generatif</b> (generative AI). Dia nggak cuma mengenali, tapi <i>membuat</i> hal baru. Chatbot seperti ChatGPT yang menulis jawaban, dan aplikasi yang melukis gambar dari satu kalimat, tinggal di sini.',
		'[fyi] Chatbot adalah bentuk antarmuka percakapan. Ada chatbot dengan jawaban dari aturan tetap dan ada yang memakai model generatif. Bentuk tampilannya saja tidak menunjukkan metode di belakangnya.',
		'[ingat] Pada program berbasis aturan, manusia menulis aturannya. Pada machine learning, proses training menyesuaikan model menggunakan data.',
		'Ini lingkarannya, bersarang kayak bawang, plus ruang di luar buat yang sama sekali bukan AI. Ketuk satu kartu, lalu ketuk lingkaran tempat dia seharusnya.'
	],
	reactions: {
		calc: 'Kalkulator contoh ini menjalankan aturan aritmetika yang diprogram. Ia tidak melatih model dari data.',
		calc_wrong:
			'Hmm, kalkulator pernah belajar hal baru nggak? Semua langkah di dalamnya ditulis orang, dan dia cuma menjalankan itu. Coba lagi ya.',
		chess:
			'Bot catur pada kartu ini memakai pencarian dan aturan evaluasi yang diprogram. Itu contoh AI tanpa machine learning. Program catur lain dapat memakai ML.',
		chess_wrong:
			'Dia memang kelihatan pintar, jadi pasti ada di bawah payung. Tapi dia belajar dari contoh, atau semua aturannya ditulis tangan? Coba lingkaran lain.',
		spam: 'Filter pada kartu ini dilatih dari contoh email berlabel spam dan bukan spam. Parameter model belajar membedakan keduanya.',
		spam_wrong:
			'Coba pikir, aturannya datang dari mana? Nggak ada yang mendaftar semua trik spam, dia belajar dari tumpukan contoh. Tapi dia cuma memilah email, nggak membuat apa apa, dan nggak butuh jaringan raksasa. Coba lagi.',
		price:
			'Ini machine learning. Model belajar dari data penjualan berisi luas, lokasi, dan harga untuk memperkirakan harga rumah lain.',
		price_wrong:
			'Dia menebak dari penjualan rumah lama, jadi dia memang belajar dari contoh. Tapi hasilnya cuma satu angka, nggak perlu neural network raksasa. Coba lagi.',
		face: 'Tepat, deep learning. Wajah itu terlalu ribet buat aturan yang ditulis tangan (cahaya, sudut, potongan rambut barumu). Jadi neural network berlapis lapis belajar dari jutaan foto wajah.',
		face_wrong:
			'Nggak mungkin ada orang yang menulis aturan buat setiap wajah, jadi dia belajar dari contoh. Tapi wajah itu ribet, butuh neural network besar yang berlapis lapis. Dan dia mengenali kamu, bukan menggambar kamu. Coba lagi.',
		chat: 'Chatbot pada kartu ini memakai model generatif untuk menyusun token jawaban berdasarkan konteks. Hasilnya tetap perlu diperiksa.',
		chat_wrong:
			'Perhatikan deskripsi kartu. Bot ini menyusun jawaban dengan model generatif, bukan memilih balasan dari daftar tetap.',
		image:
			'Model generatif menyusun gambar dari prompt. Hasilnya dapat menyerupai pola dalam data pelatihan.',
		image_wrong:
			'Kartu ini menggambarkan model yang menghasilkan gambar. Pilih kategori AI generatif.'
	},
	rings: {
		out: 'Bukan AI',
		ai: 'AI',
		ml: 'Machine learning (ML)',
		dl: 'Deep learning',
		gen: 'AI generatif'
	},
	cards: [
		{ id: 'chat', name: 'Chatbot', sub: 'menuliskan jawaban untukmu' },
		{ id: 'calc', name: 'Kalkulator', sub: 'menghitung yang kamu ketik' },
		{ id: 'face', name: 'Buka kunci wajah', sub: 'HP mengenali wajahmu' },
		{ id: 'spam', name: 'Filter spam', sub: 'menyaring email sampah' },
		{ id: 'chess', name: 'Bot catur', sub: 'semua aturannya ditulis tangan' },
		{ id: 'image', name: 'Pembuat gambar', sub: 'melukis dari kalimat' },
		{ id: 'price', name: 'Penebak harga rumah', sub: 'belajar dari penjualan lama' }
	],
	pickHint: 'Pilih satu kartu dulu',
	ringHint: 'Sekarang ketuk lingkaran untuk {name}',
	doneNote: 'Beres, semua kartu sudah ketemu lingkarannya'
};
