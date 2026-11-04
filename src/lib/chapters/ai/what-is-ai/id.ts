import type { WhatIsAiText } from './types';

export const id: WhatIsAiText = {
	title: 'Apa itu AI',
	intro: [
		'Bayangin kalkulator. Kamu ketik 7 kali 8, dia jawab 56. Dia sama sekali nggak mikir. Ada orang yang menulis aturan perkalian, dan mesinnya cuma mengikuti. Itu <b>program biasa</b>, jadi dia berdiri di luar semua lingkaran di gambar.',
		'Orang sudah lama memimpikan mesin yang lebih pintar. Tahun 1950, matematikawan Inggris bernama <b>Alan Turing</b> melempar pertanyaan terkenal, "bisakah mesin berpikir?" Tahun 1956, sekelompok ilmuwan kumpul di sebuah lokakarya musim panas soal mimpi itu dan memberinya nama, <b>artificial intelligence</b> (kecerdasan buatan).',
		'Jadi <b>AI</b> itu lingkaran paling besar. Isinya semua mesin yang melakukan sesuatu yang <i>kelihatan</i> pintar. Bot catur masuk sini. Mainnya kayak lawan yang cerdik, tapi semua aturannya diketik manual oleh orang.',
		'Di dalam AI ada <b>machine learning</b>, disingkat <b>ML</b>. Di sini nggak ada yang menulis aturan. Kamu kasih mesinnya banyak contoh, dan dia cari polanya sendiri. Filter spam belajar dari jutaan email yang sudah ditandai spam oleh orang, lalu paham spam itu kayak gimana.',
		'[ingat] Program biasa itu resep yang ditulis orang. Machine learning itu anak yang nyicip banyak masakan, lalu nemu resepnya sendiri.',
		'Di dalam ML ada <b>deep learning</b>. Ini machine learning yang pakai [[neural network|ai/neural-net]], banyak lapisan potongan kecil yang ditumpuk. Kalau contohnya cukup banyak, dia jago banget urusan yang berantakan kayak wajah, suara, dan bahasa. Begitulah face unlock tahu itu kamu.',
		'Paling tengah ada <b>generative AI</b>. Dia nggak cuma mengenali, dia <i>membuat</i> hal baru. Chatbot yang menulis jawaban dan aplikasi yang melukis gambar dari satu kalimat tinggal di sini.',
		'[ingat] Lingkarannya bersarang kayak lapisan bawang, dan lapisan dalam selalu bagian dari lapisan luarnya. Semua chatbot itu AI, tapi nggak semua AI itu chatbot, sama kayak semua anak kucing itu kucing, tapi nggak semua kucing itu anak kucing.',
		'Penasaran kenapa sesuatu ada di lingkaran tertentu? Ketuk contoh mana aja, nanti Nim ceritain. Ini opsional kok, lingkarannya sudah lengkap.'
	],
	reactions: {
		calc: 'Kalkulator tetap di luar. Dia nggak pernah belajar atau menebak apa pun, cuma mengikuti aturan yang ditulis orang. Berguna, tapi nggak pintar.',
		chess:
			'Bot catur itu AI, tapi bukan ML. Mainnya cerdik, tapi semua aturannya dari pembuatnya. Dia nggak pernah belajar dari contoh, jadi tetap di lingkaran luar.',
		spam: 'Filter spam itu machine learning. Nggak ada yang menulis aturan buat tiap email penipuan, dia belajar dari tumpukan email yang sudah dipilah orang dan menemukan polanya sendiri.',
		face: 'Face unlock itu deep learning. Wajah terlalu berantakan buat aturan tulisan tangan (cahayanya, sudutnya, potongan rambut barumu), jadi neural network belajar dari jutaan foto wajah.',
		chat: 'Chatbot itu generative AI. Dia menulis jawaban baru kata demi kata, jawaban yang belum pernah ditulis siapa pun. Itulah bagian membuatnya.',
		image:
			'Aplikasi gambar juga generative AI. Kamu ketik satu kalimat, dia melukis gambar yang sebelumnya belum pernah ada.'
	},
	panels: [
		{
			tag: 'Bukan AI',
			title: 'Program biasa',
			body: 'Orang menulis semua aturannya, mesin mengikutinya persis. Dia nggak pernah belajar hal baru.'
		},
		{
			tag: 'Sedikit sejarah',
			title: 'Bisakah mesin berpikir?',
			body: 'Turing menanyakannya tahun <b>1950</b>. Nama <b>artificial intelligence</b> muncul tahun <b>1956</b>, di lokakarya musim panas para ilmuwan di Amerika Serikat.'
		},
		{
			tag: 'Lingkaran 1',
			title: 'Artificial intelligence',
			body: 'Mesin apa pun yang bertingkah pintar, kayak main catur atau mencari rute. Pintarnya bisa saja dari aturan yang ditulis manual.'
		},
		{
			tag: 'Lingkaran 2',
			title: 'Machine learning',
			body: 'Bagian dari AI yang belajar dari <b>contoh</b>, bukan dikasih tahu aturannya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Aturan atau contoh',
			body: 'Dikasih aturan, itu program biasa. Dikasih contoh lalu cari aturannya sendiri, itu machine learning.'
		},
		{
			tag: 'Lingkaran 3',
			title: 'Deep learning',
			body: 'Machine learning yang pakai <b>neural network</b> besar dengan banyak lapisan. Jagoan untuk foto, suara, dan teks.'
		},
		{
			tag: 'Lingkaran 4',
			title: 'Generative AI',
			body: 'Deep learning yang <b>membuat</b> hal baru (teks, gambar, musik), bukan cuma memilah yang dia lihat.'
		},
		{
			tag: 'Biar nempel',
			title: 'Lingkaran di dalam lingkaran',
			body: 'Tiap lingkaran adalah bagian dari lingkaran di luarnya. Kalau orang sekarang bilang AI, sering yang dimaksud cuma lingkaran paling kecil.'
		},
		{
			tag: 'Coba',
			title: 'Tinggal di mana?',
			body: 'Ketuk satu contoh untuk menyalakan lingkarannya dan dengar alasannya.'
		}
	],
	rings: {
		ai: 'Artificial intelligence',
		ml: 'Machine learning',
		dl: 'Deep learning',
		gen: 'Generative AI'
	},
	things: {
		calc: 'kalkulator',
		chess: 'bot catur',
		spam: 'filter spam',
		face: 'face unlock',
		chat: 'chatbot',
		image: 'AI gambar'
	},
	quote: 'Bisakah mesin berpikir?',
	quoteBy: 'Alan Turing, 1950',
	photo: { alt: 'Foto Alan Turing saat remaja', caption: 'Alan Turing, sekitar 1928' },
	rule: 'Dikasih aturan, program. Dikasih contoh, machine learning.',
	nest: 'Semua chatbot itu AI, nggak semua AI itu chatbot.',
	tapHint: 'Ketuk contoh mana aja'
};
