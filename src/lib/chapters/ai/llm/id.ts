import type { LlmText } from './types';

const end = (): [string, number][] => [
	['.', 60],
	['lalu', 25],
	['tiap', 15]
];

export const id: LlmText = {
	title: 'LLM dan token',
	intro: [
		'Kamu mungkin pernah ngobrol sama ChatGPT, Gemini, atau Claude. Tulisannya lancar banget, rasanya kayak ada orang yang mengetik balik. Di dalam masing masing ada <b>LLM</b>, singkatan dari large language model (model bahasa besar).',
		'LLM menghasilkan teks dengan memprediksi <b>token berikutnya</b> berdasarkan konteks. Token terpilih ditambahkan ke konteks, lalu proses diulang sampai keluaran selesai.',
		'Potongan itu namanya <b>token</b>. Satu token seringnya satu kata utuh, kadang setengah kata, kadang cuma tanda koma. Kata "servernya" bisa jadi "server" plus "nya". Tiap token lalu diubah jadi angka, karena komputer cuma bisa mengolah angka.',
		'Buat tiap token berikutnya, model memberi skor ke ribuan pilihan lalu mengubahnya jadi peluang. "Nim suka makan" bisa lanjut ke "nasi" dengan peluang 40 persen, "mie" 24 persen, dan seterusnya. Lalu dia memilih satu, menambahkannya, dan menebak lagi.',
		'<b>Temperature</b> mengubah distribusi peluang token. Nilai rendah membuat pilihan lebih terkonsentrasi pada token berpeluang tinggi. Nilai tinggi memperbesar variasi, tanpa menjamin jawaban lebih benar atau lebih berguna.',
		'[fyi] LLM asli adalah [[neural network|ai/neural-net]] raksasa dengan miliaran bobot yang dilatih buat menebak seperti ini. Punyaku di bawah cuma tabel kata buatan tangan, tapi putarannya sama persis, tebak, pilih, tambahkan, ulangi. Makanya LLM bisa terdengar yakin padahal salah, dia cuma tahu apa yang biasanya muncul berikutnya.',
		'[ingat] <b>Prediksi, pilih, tambahkan, ulangi.</b> Inilah putaran generasi token. Kebenaran jawaban perlu diperiksa terpisah dari kelancaran teksnya.',
		'Ketik satu kalimat (atau ketuk contoh) dan lihat kalimatnya terpecah jadi token. Lalu pilih token berikutnya beberapa kali, dan mainkan suhunya buat lihat tebakannya berubah.'
	],
	reactions: {
		typed:
			'Lihat kalimatnya terpecah? Kata pendek yang umum tetap utuh, kata panjang dipotong, dan titik jadi token sendiri. Angka kecil di bawahnya itulah yang sebenarnya dibaca model.',
		pick: 'Satu token bertambah! Model cuma melihat kata kata sebelumnya, memberi skor ke pilihannya, lalu memilih satu. Sekarang dia mengulang semuanya buat token berikutnya.',
		cold: 'Peluang lebih terkonsentrasi pada pilihan teratas. Keluaran cenderung lebih konsisten, tetapi temperature rendah tidak menjamin kebenaran fakta.',
		hot: 'Distribusi peluang lebih rata, sehingga token yang semula kurang mungkin lebih sering terpilih. Variasi meningkat, tetapi kualitas tetap perlu diuji.',
		surprise:
			'Haha, dia nggak ambil tebakan teratas! Dengan sedikit suhu, token yang kurang mungkin tetap bisa menang undian. Jalankan dua kali, kalimatnya bisa beda.',
		done: 'Kamu barusan membuat teks dengan cara LLM bekerja, satu token demi satu token. Tiap jawaban panjang dari chatbot itu putaran yang sama, diulang ratusan kali dalam sekejap.'
	},
	inputLabel: 'Kalimatmu',
	presets: ['Nim suka makan', 'Servernya lagi', 'Aku mau belajar'],
	tokensCount: '{n} token',
	idsNote: 'Angka di bawah tiap token adalah cara model melihatnya',
	nextTitle: 'Tebakan teratas buat token berikutnya',
	tempLabel: 'Suhu',
	tempCold: 'Variasi rendah',
	tempHot: 'Variasi tinggi',
	pickBtn: 'Pilih token berikutnya',
	full: 'Kalimatnya sudah panjang, coba mulai yang baru',
	reset: 'Ulangi',
	splits: {
		servernya: ['server', 'nya'],
		belajar: ['bel', 'ajar'],
		jaringan: ['jar', 'ingan'],
		semuanya: ['semua', 'nya'],
		ngoding: ['ng', 'oding'],
		rasanya: ['rasa', 'nya'],
		nimbus: ['nim', 'bus'],
		karena: ['kar', 'ena'],
		ngebut: ['nge', 'but']
	},
	table: {
		'.': [
			['Nim', 40],
			['Lalu', 25],
			['Aku', 20],
			['Servernya', 15]
		],
		nim: [
			['suka', 40],
			['lagi', 30],
			['mau', 30]
		],
		aku: [
			['mau', 50],
			['suka', 30],
			['lagi', 20]
		],
		suka: [
			['makan', 70],
			['belajar', 30]
		],
		mau: [
			['belajar', 50],
			['makan', 30],
			['tidur', 20]
		],
		makan: [
			['nasi', 40],
			['mie', 24],
			['roti', 16],
			['bakso', 12],
			['awan', 8]
		],
		nasi: [
			['.', 40],
			['goreng', 28],
			['sama', 20],
			['tiap', 12]
		],
		goreng: [
			['.', 50],
			['sama', 25],
			['tiap', 25]
		],
		mie: [
			['.', 40],
			['ayam', 28],
			['sama', 20],
			['tiap', 12]
		],
		ayam: [
			['.', 50],
			['sama', 25],
			['tiap', 25]
		],
		roti: [
			['.', 40],
			['sama', 30],
			['lalu', 20],
			['tiap', 10]
		],
		bakso: [
			['.', 40],
			['sama', 30],
			['lalu', 20],
			['tiap', 10]
		],
		awan: [
			['.', 30],
			['karena', 30],
			['sama', 25],
			['tiap', 15]
		],
		sama: [
			['teman', 50],
			['kucing', 30],
			['Nim', 20]
		],
		teman: end(),
		kucing: end(),
		tiap: [
			['hari', 55],
			['pagi', 30],
			['malam', 15]
		],
		hari: [
			['.', 70],
			['lalu', 30]
		],
		pagi: [
			['.', 70],
			['lalu', 30]
		],
		malam: [
			['.', 70],
			['lalu', 30]
		],
		lalu: [
			['minum', 35],
			['tidur', 25],
			['belajar', 25],
			['ngoding', 15]
		],
		minum: [
			['teh', 45],
			['air', 35],
			['kopi', 20]
		],
		teh: end(),
		air: end(),
		kopi: end(),
		tidur: [
			['.', 50],
			['siang', 30],
			['lagi', 20]
		],
		siang: [
			['.', 70],
			['lalu', 30]
		],
		karena: [
			['rasanya', 60],
			['empuk', 40]
		],
		rasanya: [
			['manis', 50],
			['enak', 30],
			['empuk', 20]
		],
		manis: [
			['.', 60],
			['sekali', 40]
		],
		enak: [
			['.', 60],
			['sekali', 40]
		],
		empuk: [
			['.', 60],
			['sekali', 40]
		],
		sekali: [
			['.', 80],
			['lalu', 20]
		],
		servernya: [
			['lagi', 60],
			['sudah', 25],
			['jalan', 15]
		],
		server: [
			['lagi', 60],
			['sudah', 25],
			['jalan', 15]
		],
		lagi: [
			['sibuk', 30],
			['ngebut', 25],
			['mati', 20],
			['tidur', 15],
			['senang', 10]
		],
		sibuk: [
			['.', 50],
			['banget', 30],
			['lalu', 20]
		],
		ngebut: [
			['.', 50],
			['banget', 30],
			['lalu', 20]
		],
		mati: [
			['.', 50],
			['lagi', 30],
			['lalu', 20]
		],
		senang: [
			['.', 50],
			['banget', 30],
			['lalu', 20]
		],
		banget: [
			['.', 80],
			['lalu', 20]
		],
		sudah: [
			['jalan', 50],
			['mati', 30],
			['siap', 20]
		],
		jalan: [
			['.', 40],
			['lancar', 40],
			['lagi', 20]
		],
		lancar: end(),
		siap: end(),
		belajar: [
			['AI', 30],
			['semuanya', 25],
			['ngoding', 25],
			['jaringan', 20]
		],
		ai: end(),
		ngoding: end(),
		jaringan: end(),
		semuanya: end()
	},
	fallback: [
		['.', 30],
		['lalu', 25],
		['dan', 20],
		['juga', 15],
		['banget', 10]
	]
};
