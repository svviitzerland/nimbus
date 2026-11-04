import type { NeuralNetText } from './types';

export const id: NeuralNetText = {
	title: 'Apa itu neural network',
	intro: [
		'Tiap ada berita soal AI, pasti muncul kata <b>neural network</b>. Kedengarannya canggih banget, tapi isinya sebenarnya cuma hitungan kecil yang disusun rapi. Ini satu yang beneran, cukup kecil buat kita bongkar.',
		'Tiap lingkaran adalah <b>neuron</b>, semacam kalkulator mini. Mereka berdiri dalam kolom yang disebut <b>lapisan</b> (layer). Angka masuk dari kiri (masukan), lewat tengah (lapisan tersembunyi), dan jawabannya keluar di kanan (keluaran).',
		'Tiap garis yang menyambungkan dua neuron punya <b>bobot</b> (weight), yaitu angka yang bilang seberapa penting sinyal itu. Garis biru tebal didengar banget, garis merah malah menahan.',
		'Kerja neuron cuma satu. Dia menjumlahkan semua yang masuk, masing masing dikali bobot garisnya. Kalau totalnya cukup besar, dia <b>menyala</b> dan meneruskan sinyalnya. Perhatikan neuron yang paling bawah.',
		'[ingat] Jumlahkan dulu, baru nyala. Neuron itu kayak ketel air, panasnya datang dari mana mana dan terkumpul, begitu cukup panas langsung bunyi tuiit.',
		'Sekarang tugas beneran. Aku selalu bingung mau bawa payung atau nggak, jadi jaringan ini yang memutuskan dari tiga petunjuk, langit mendung, udara lembap, dan ramalan hujan. Ini empat hari kemarin lengkap dengan jawaban benarnya. Lihat dia mencoba tiap hari.',
		'Cuma dua yang benar, bobotnya belum pas. Jadi jaringannya <b>berlatih</b> (training). Dia cek seberapa meleset tiap tebakan, lalu menggeser semua bobot sedikit ke arah yang bikin melesetnya berkurang. Lihat garisnya berubah.',
		'Empat dari empat, tanpa ada yang menyentuh apa pun. Cara menggeser bobot sedikit demi sedikit ini namanya [[gradient descent|ai/learning-loop]], resep di balik hampir semua AI modern. Model besar melakukan persis ini, cuma garisnya ada miliaran.',
		'[fyi] Namanya memang terinspirasi dari sel saraf di otak yang juga saling oper sinyal. Tapi jangan dibayangkan terlalu jauh, aslinya cuma perkalian dan penjumlahan yang diulang jutaan kali.',
		'Kalau penasaran, ketuk garis mana saja dan geser bobotnya. Lihat nyala neuronnya berubah, dan cek apakah keempat hari tetap benar.'
	],
	reactions: {
		select:
			'Garis itu satu bobot. Biru mendorong neuron berikutnya biar menyala, merah menahannya. Geser angkanya dan perhatikan.',
		tweak:
			'Nyalanya berubah, tapi jawabannya bertahan. Jaringan punya sedikit kelonggaran, satu bobot jarang bisa membalik semuanya.',
		worse:
			'Waduh, satu hari jadi salah. Satu bobot ternyata cukup buat merusak jawaban, makanya training selalu mengecek semua hari sekaligus.',
		better: 'Balik lagi empat dari empat. Kamu barusan melakukan sedikit training pakai tangan.'
	},
	panels: [
		{
			tag: 'Neural network',
			title: 'Hitungan kecil yang rapi',
			body: 'Sinyal mengalir dari kiri ke kanan lewat garis. Lingkaran yang lebih terang adalah neuron yang sedang menyala.'
		},
		{
			tag: 'Lapisan',
			title: 'Kolom kolom neuron',
			body: '<b>Lapisan masukan</b> memegang petunjuk, <b>lapisan tersembunyi</b> berpikir di tengah, dan <b>lapisan keluaran</b> memberi jawaban.'
		},
		{
			tag: 'Bobot',
			title: 'Seberapa penting tiap garis',
			body: 'Ketebalan menunjukkan besarnya bobot. Biru artinya mendorong neuron berikutnya naik, merah artinya menekannya turun.'
		},
		{
			tag: 'Neuron',
			title: 'Jumlahkan, lalu nyala',
			body: 'Meteran di samping neuron adalah totalnya. Tiap petunjuk yang menyala menambah bobotnya. Lewat garis tanda, neuronnya menyala.'
		},
		{
			tag: 'Cara ingat',
			title: 'Kayak ketel air',
			body: 'Panas terkumpul dari mana mana, dan baru bunyi kalau sudah cukup panas. Neuron menjumlahkan sinyal dan baru menyala setelah lewat tandanya.'
		},
		{
			tag: 'Tugasnya',
			title: 'Payung atau nggak',
			body: 'Tiap hari ada petunjuk yang nyala (1) atau mati (0). Neuron jawaban menyala terang untuk bawa payung dan redup kalau nggak perlu.'
		},
		{
			tag: 'Training',
			title: 'Geser semua bobot sedikit',
			body: 'Tiap putaran dia membandingkan jawabannya dengan yang benar, lalu menggeser tiap garis sedikit. Perhatikan tebal dan warnanya berubah.'
		},
		{
			tag: 'Sudah terlatih',
			title: 'Empat hari benar semua',
			body: 'Nggak ada yang menulis aturan "ada ramalan hujan berarti bawa payung". Jaringannya menemukan sendiri lewat bobotnya.'
		},
		{
			tag: 'Coba',
			title: 'Ubah satu bobot',
			body: 'Ketuk sebuah garis, lalu geser bobotnya. Ada garis yang hampir nggak berpengaruh, ada juga yang bisa membalik jawaban sendirian.'
		}
	],
	inputs: ['Mendung', 'Lembap', 'Ramalan'],
	layerIn: 'Masukan',
	layerHidden: 'Lapisan tersembunyi',
	layerOut: 'Keluaran',
	outputLabel: 'Payung?',
	dayLabel: 'Hari {n}',
	answerYes: 'bawa payung',
	answerNo: 'tanpa payung',
	score: '{n} dari 4 hari benar',
	training: 'Lagi belajar, putaran {n}',
	trained: 'Selesai belajar dalam {n} putaran',
	total: 'total',
	bar: 'nyala',
	rule: 'Jumlahkan dulu, baru nyala',
	verdictYes: 'Bawa payung',
	verdictNo: 'Nggak usah bawa payung',
	tapHint: 'Ketuk garis mana saja buat mengatur bobotnya',
	edgeLabel: 'Dari {a} ke {b}',
	neuronName: 'neuron tengah {n}',
	outputName: 'neuron jawaban',
	weightLabel: 'Bobot',
	stronger: 'Perkuat',
	weaker: 'Perlemah',
	reset: 'Kembalikan'
};
