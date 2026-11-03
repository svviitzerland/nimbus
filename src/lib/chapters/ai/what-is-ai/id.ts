import type { WhatIsAiText } from './types';

export const id: WhatIsAiText = {
	title: 'Apa itu AI',
	intro: [
		'Bayangkan kalkulator. Kamu ketik 7 kali 8, dia jawab 56. Dia sama sekali nggak mikir. Ada orang yang menulis aturan perkalian itu dengan tangan, dan programnya tinggal mengikuti, langkah demi langkah. Itu namanya <b>program biasa</b>.',
		'Tapi kadang mesin bisa melakukan hal yang <i>kelihatan</i> pintar, misalnya mengalahkanmu main catur atau mengenali wajahmu. Semua mesin seperti itu masuk ke satu payung besar bernama <b>AI</b>, singkatan dari artificial intelligence (kecerdasan buatan).',
		'Di dalam payung itu ada <b>machine learning</b>, atau disingkat <b>ML</b> (sama saja, ML cuma nama pendeknya). Di sini nggak ada yang menulis aturannya. Kamu kasih ribuan contoh, lalu mesinnya menemukan polanya sendiri.',
		'Di dalam ML ada <b>deep learning</b>. Ini machine learning yang dibangun dari [[neural network|ai/neural-net]], banyak lapisan potongan hitungan kecil yang ditumpuk. Kasih contoh yang cukup, dia jadi jago banget soal gambar, suara, dan bahasa.',
		'Lalu paling tengah ada <b>AI generatif</b> (generative AI). Dia nggak cuma mengenali, tapi <i>membuat</i> hal baru. Chatbot seperti ChatGPT yang menulis jawaban, dan aplikasi yang melukis gambar dari satu kalimat, tinggal di sini.',
		'[fyi] Jadi setiap chatbot itu AI, tapi nggak semua AI itu chatbot. Sekarang kalau orang bilang "AI", seringnya yang dimaksud cuma lingkaran paling kecil itu, padahal payungnya jauh lebih luas.',
		'Ini lingkarannya, bersarang kayak bawang, plus ruang di luar buat yang sama sekali bukan AI. Ketuk satu kartu, lalu ketuk lingkaran tempat dia seharusnya.'
	],
	reactions: {
		calc: 'Betul, bukan AI sama sekali. Kalkulator nggak pernah belajar atau menebak, dia cuma mengikuti aturan yang ditulis orang. Berguna, tapi nggak pintar.',
		calc_wrong:
			'Hmm, kalkulator pernah belajar hal baru nggak? Semua langkah di dalamnya ditulis orang, dan dia cuma menjalankan itu. Coba lagi ya.',
		chess:
			'Pas, AI tapi bukan ML. Bot ini main kayak lawan yang cerdik, tapi semua aturannya diketik oleh pembuatnya. Dia nggak belajar dari contoh, jadi tetap di lingkaran luar.',
		chess_wrong:
			'Dia memang kelihatan pintar, jadi pasti ada di bawah payung. Tapi dia belajar dari contoh, atau semua aturannya ditulis tangan? Coba lingkaran lain.',
		spam: 'Benar, machine learning. Nggak ada yang menulis aturan buat setiap email penipuan. Filternya mempelajari jutaan email yang ditandai orang sebagai spam, lalu menemukan polanya sendiri.',
		spam_wrong:
			'Coba pikir, aturannya datang dari mana? Nggak ada yang mendaftar semua trik spam, dia belajar dari tumpukan contoh. Tapi dia cuma memilah email, nggak membuat apa apa, dan nggak butuh jaringan raksasa. Coba lagi.',
		price:
			'Mantap, ini machine learning juga. Kasih ribuan data penjualan rumah lama (luas, lokasi, harga), dia belajar menebak harga rumah yang belum pernah dia lihat.',
		price_wrong:
			'Dia menebak dari penjualan rumah lama, jadi dia memang belajar dari contoh. Tapi hasilnya cuma satu angka, nggak perlu neural network raksasa. Coba lagi.',
		face: 'Tepat, deep learning. Wajah itu terlalu ribet buat aturan yang ditulis tangan (cahaya, sudut, potongan rambut barumu). Jadi neural network berlapis lapis belajar dari jutaan foto wajah.',
		face_wrong:
			'Nggak mungkin ada orang yang menulis aturan buat setiap wajah, jadi dia belajar dari contoh. Tapi wajah itu ribet, butuh neural network besar yang berlapis lapis. Dan dia mengenali kamu, bukan menggambar kamu. Coba lagi.',
		chat: 'Yap, AI generatif! Dia membaca pertanyaanmu lalu menulis jawaban baru kata demi kata, jawaban yang belum pernah ditulis siapa pun. Itulah bagian membuatnya.',
		chat_wrong:
			'Chatbot itu cuma mengenali sesuatu, atau membuat sesuatu yang baru? Setiap jawabannya ditulis dari nol. Cari lingkaran yang tugasnya membuat.',
		image:
			'Betul, AI generatif juga. Kamu ketik "kucing main selancar pas senja", dia melukis gambar yang sebelumnya nggak pernah ada.',
		image_wrong:
			'Gambar itu nggak ada di mana pun sampai aplikasinya membuatnya. Lingkaran mana yang isinya soal membuat hal baru?'
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
