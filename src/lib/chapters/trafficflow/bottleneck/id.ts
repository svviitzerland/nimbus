import type { BottleneckText } from '../types';

export const id: BottleneckText = {
	title: 'Apa itu bottleneck?',
	intro: [
		'Ini toko online kamu. Pengunjung bukanya dari HP masing masing, dan di belakang layar tiap permintaan diladenin server lalu mampir ke satu <b>database</b> buat ngambil data.',
		'Pas pengunjung sedikit semua lancar. Tapi pas rame, semuanya numpuk di titik yang paling lambat, yaitu database tadi. Satu titik yang ngebatasin laju semua orang itu namanya <b>bottleneck</b>.',
		'Coba tambah pengunjung sampai databasenya kewalahan. Pengunjung bakal ngantri di depan database (yang merah itu lagi nunggu) dan halaman mereka jadi lama kebuka. Terus perbesar databasenya, antriannya kelar dan halaman cepat lagi.',
		'[ingat] Bottleneck adalah bagian yang membatasi kinerja sistem. Tingkatkan bagian itu, lalu ukur hasilnya.'
	],
	reactions: {
		jam: 'Nah, databasenya kewalahan. Cuma satu titik ini yang lambat, tapi semua pengunjung kena imbasnya, halamannya jadi lama kebuka.',
		fixed:
			'Lancar lagi. Tapi memperbesar satu kotak ada batasnya. Di bab berikutnya, <b>Lalu Lintas</b>, kita belajar cara lain ngatasin bottleneck, kayak nambah server dan ngebagi beban.'
	},
	okStatus: 'Lancar',
	jamStatus: 'Kewalahan',
	queueLabel: 'antri',
	customerLabel: 'Yang dilihat pengunjung',
	devLabel: 'Di belakang layar',
	visitorsLabel: 'pengunjung',
	shopUrl: 'nimbus.com',
	loadingLabel: 'Memuat',
	okPageLabel: 'Terbuka',
	secUnit: 'dtk',
	dbLabel: 'Database',
	bottleneckTag: 'bottleneck',
	addBtn: 'Tambah pengunjung',
	fixBtn: 'Perbesar database'
};
