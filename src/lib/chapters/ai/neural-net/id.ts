import type { NeuralNetText } from './types';

export const id: NeuralNetText = {
	title: 'Apa itu neural network',
	intro: [
		'Tiap ada berita soal AI, pasti muncul kata <b>neural network</b>. Kedengarannya canggih banget, tapi isinya sebenarnya cuma hitungan kecil yang disusun rapi. Yuk kita bongkar.',
		'Bayangkan banyak <b>kalkulator mini</b> yang dijejer jadi beberapa barisan. Tiap kalkulator ini namanya <b>neuron</b>, dan tiap barisan namanya <b>lapisan</b> (layer). Angka masuk dari kiri, dioper ke kanan, sampai jawabannya keluar di ujung.',
		'Tiap garis yang menyambungkan dua neuron punya <b>bobot</b> (weight), yaitu angka yang bilang seberapa penting sinyal itu. Bobot besar artinya didengar banget, bobot negatif artinya malah bikin ragu.',
		'Kerja neuron cuma satu. Dia menjumlahkan semua angka yang masuk (masing masing dikali bobot garisnya), lalu <b>menyala</b> kalau totalnya cukup besar. Makin besar totalnya, makin terang nyalanya.',
		'[fyi] Namanya memang terinspirasi dari sel saraf di otak yang juga saling oper sinyal. Tapi jangan dibayangkan terlalu jauh, aslinya cuma perkalian dan penjumlahan yang diulang jutaan kali.',
		'Nah, aku lagi bingung mau bawa payung atau tidak. Jaringan kecil ini yang memutuskan dari tiga petunjuk, langit mendung, udara lembap, dan ramalan hujan. Di atas ada empat hari kemarin lengkap dengan jawaban yang benar.',
		'Ketuk lingkaran di kiri buat lihat sinyalnya mengalir. Lalu ketuk garis mana saja dan atur bobotnya sampai keempat hari ditebak benar. Kalau buntu, biarkan jaringannya belajar sendiri.'
	],
	reactions: {
		input:
			'Lihat angkanya mengalir? Masukan cuma 1 atau 0 (ya atau tidak). Tiap neuron di tengah menjumlahkan yang masuk lalu menyala sesuai totalnya, dan neuron terakhir yang memutuskan soal payung.',
		select:
			'Garis itu satu bobot. Biru artinya mendorong neuron biar menyala, merah artinya menahan. Makin tebal garisnya, makin besar pengaruhnya. Coba geser angkanya.',
		tweak:
			'Kamu baru saja mengubah bobot. Perhatikan nyala neuronnya ikut berubah, dan skor di atas juga bisa naik atau turun.',
		better: 'Naik! Satu hari lagi ditebak dengan benar. Terus cari garis yang pas.',
		worse:
			'Waduh, malah turun. Kadang membenarkan satu hari bikin hari lain jadi salah, justru itu serunya.',
		hand: 'Keren, empat dari empat! Kamu barusan melatih neural network pakai tangan. Bayangkan kalau garisnya ada miliaran, makanya komputer disuruh melakukannya sendiri.',
		learning:
			'Sekarang dia mencoba sendiri. Tiap langkah dia cek seberapa meleset tebakannya, lalu menggeser semua bobot sedikit ke arah yang bikin melesetnya berkurang.',
		trained:
			'Beres, empat dari empat tanpa kamu sentuh. Cara menggeser bobot sedikit demi sedikit ini namanya [[gradient descent|ai/learning-loop]], resep di balik hampir semua AI modern.'
	},
	inputs: ['Mendung', 'Lembap', 'Ramalan hujan'],
	layerIn: 'Masukan',
	layerHidden: 'Lapisan tengah',
	layerOut: 'Keluaran',
	outputLabel: 'Payung?',
	dayLabel: 'Hari {n}',
	answerYes: 'bawa payung',
	answerNo: 'tanpa payung',
	score: '{n} dari 4 hari benar',
	trainBtn: 'Biar dia belajar sendiri',
	training: 'Lagi belajar, langkah {n}',
	trained: 'Selesai belajar dalam {n} langkah',
	reset: 'Ulangi',
	pickHint: 'Ketuk garis mana saja buat mengatur bobotnya',
	inputHint: 'Ketuk lingkaran di kiri buat nyalain atau matiin petunjuknya',
	edgeLabel: 'Dari {a} ke {b}',
	neuronName: 'neuron tengah {n}',
	outputName: 'neuron jawaban',
	weightLabel: 'Bobot',
	stronger: 'Perkuat',
	weaker: 'Perlemah',
	verdictYes: 'Bawa payung',
	verdictNo: 'Tidak usah bawa payung',
	confidence: '{n}% yakin bakal hujan'
};
