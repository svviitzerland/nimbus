import type { Guess, LlmText } from './types';

const after = (): Guess[] => [
	['bareng', 36],
	['.', 30],
	['dan', 20],
	['tiap', 14]
];
const end = (): Guess[] => [
	['.', 70],
	['tiap', 20],
	['dan', 10]
];
const stop = (): Guess[] => [
	['.', 80],
	['tiap', 20]
];

export const id: LlmText = {
	title: 'LLM dan token',
	intro: [
		'Kamu mungkin pernah ngobrol sama ChatGPT, Gemini, atau Claude. Kamu nanya sesuatu, lalu jawaban yang lancar muncul kata demi kata, kayak ada orang yang lagi mengetik balik. Otak di dalam mereka namanya <b>LLM</b>, singkatan dari large language model (model bahasa besar).',
		'Nah, ini bagian yang mengejutkan. LLM cuma mengerjakan satu tugas kecil, berulang ulang. Dia menebak apa yang muncul <b>berikutnya</b>. Keyboard HP kamu juga melakukan hal yang sama waktu menyarankan kata selanjutnya di atas tombol.',
		'Pertama, model memotong tulisanmu jadi potongan kecil yang namanya <b>token</b>. Satu token seringnya satu kata utuh, kadang setengah kata, kadang cuma tanda titik. Lalu tiap token diubah jadi angka, karena komputer cuma bisa mengolah angka.',
		'Sekarang bagian menebak. Sesudah "Nim suka makan", model memberi peluang ke tiap token yang mungkin muncul. "nasi" dapat 40 persen, "mie" 24, terus turun sampai yang aneh aneh.',
		'Dia memilih satu, menempelkannya di ujung, lalu menebak lagi dari kalimat yang lebih panjang. Tebak, pilih, tempel, ulangi. Jawaban chatbot yang panjang itu cuma putaran ini, diulang ratusan kali dalam sekejap.',
		'Ada satu kenop namanya <b>temperature</b> (suhu). Kalau diturunkan, tebakan teratas hampir selalu menang (aman, agak membosankan). Kalau dinaikkan, batangnya jadi lebih rata, jadi kata kata yang nggak terduga bisa nyelip (kreatif, kadang ngawur).',
		'[ingat] LLM itu fitur tebak kata di keyboard HP kamu, tapi versi super. Keyboard menebak satu kata lalu berhenti. LLM terus menebak sampai satu jawaban utuh selesai ditulis.',
		'[fyi] LLM asli adalah [[neural network|ai/neural-net]] raksasa yang dilatih pakai segunung buku dan situs web. Makanya dia bisa terdengar yakin padahal salah. Dia cuma tahu apa yang biasanya muncul berikutnya, bukan apa yang benar.',
		'Mau lihat dia menulis sesuatu yang baru? Kocok akhiran lain dan lihat dia menebak sampai ketemu titik. Ini opsional kok.'
	],
	reactions: {
		roll: 'Akhiran baru, disusun satu token demi satu token. Kali ini dia selalu ambil tebakan teratas, jadi hasilnya rapi dan gampang ditebak.',
		surprise:
			'Haha, dia nggak selalu ambil tebakan teratas! Token yang peluangnya lebih kecil menang undian. Makanya nanya hal yang sama dua kali ke chatbot bisa dapat dua jawaban berbeda.'
	},
	panels: [
		{
			tag: 'Chatbot',
			title: 'Jawaban, kata demi kata',
			body: 'Di balik jendela chat ada sebuah <b>LLM</b>. Balasannya muncul sedikit demi sedikit karena memang dibuat sedikit demi sedikit.'
		},
		{
			tag: 'Kata berikutnya',
			title: 'Persis kayak keyboard kamu',
			body: 'HP kamu melihat yang sudah kamu ketik, lalu menawarkan tiga kata berikutnya yang paling mungkin. LLM mengerjakan tugas yang sama, cuma jauh lebih jago.'
		},
		{
			tag: 'Token',
			title: 'Tulisan jadi potongan',
			body: 'Kata yang umum tetap utuh, kata yang panjang dipotong (bel plus ajar), dan titik jadi potongan sendiri. Angka di bawah tiap potongan itulah yang benar benar dibaca model.'
		},
		{
			tag: 'Tebakan',
			title: 'Semua pilihan dapat peluang',
			body: 'Tiap batang adalah satu tebakan buat token berikutnya. Makin panjang batangnya, makin mungkin. Kalau dijumlah, semua peluangnya pas 100 persen.'
		},
		{
			tag: 'Putaran',
			title: 'Tebak, pilih, tempel, ulangi',
			body: 'Token yang terpilih masuk ke kalimat, lalu model menebak lagi dari kalimat baru yang lebih panjang. Dia nggak pernah merencanakan seluruh jawaban dari awal.'
		},
		{
			tag: 'Suhu',
			title: 'Aman atau liar',
			body: 'Suhu rendah bikin batang teratas jadi besar banget, jadi jawabannya gampang ditebak. Suhu tinggi meratakan batangnya, jadi kata yang jarang juga dapat kesempatan.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tebak kata versi super',
			body: 'Keyboard menebak satu kata. LLM terus menebak, token demi token, sampai jawabannya selesai.'
		},
		{
			tag: 'Coba',
			title: 'Kocok akhiran lain',
			body: 'Tiap kocokan memilih secara acak pakai batang peluangnya, jadi awal yang sama bisa berakhir jadi kalimat yang beda.'
		}
	],
	picture: 'Sebuah HP tempat AI menulis kalimat satu token demi satu token',
	chatTitle: 'nimbus chat',
	you: 'Kamu',
	ai: 'AI',
	chatAsk: 'Nim sukanya makan apa?',
	start: 'Nim suka makan',
	suggestions: ['nasi', 'mie', 'roti'],
	tokenWords: [['Nim'], ['sedang'], ['bel', 'ajar'], ['jaring', 'an'], ['.']],
	tokensCount: '{n} token',
	idsNote: 'Angka di bawah tiap token itulah yang dilihat model',
	nextLabel: 'Tebakan teratas buat token berikutnya',
	path: ['nasi', 'bareng', 'teman', '.'],
	table: {
		makan: [
			['nasi', 40],
			['mie', 24],
			['roti', 16],
			['pizza', 12],
			['awan', 8]
		],
		nasi: after(),
		mie: after(),
		roti: after(),
		pizza: after(),
		awan: [
			['.', 45],
			['bareng', 30],
			['tiap', 25]
		],
		bareng: [
			['teman', 42],
			['sambal', 26],
			['keju', 18],
			['ayam', 14]
		],
		teman: end(),
		sambal: end(),
		keju: end(),
		ayam: end(),
		dan: [
			['teh', 45],
			['kue', 35],
			['sup', 20]
		],
		teh: stop(),
		kue: stop(),
		sup: stop(),
		tiap: [
			['hari', 60],
			['malam', 40]
		],
		hari: [['.', 100]],
		malam: [['.', 100]]
	},
	tempLabel: 'Suhu',
	cold: 'Aman',
	hot: 'Liar',
	rule: 'Tebak kata, tapi versi super',
	rollBtn: 'Kocok akhiran lain'
};
