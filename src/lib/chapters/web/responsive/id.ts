import type { ResponsiveText } from './types';

export const id: ResponsiveText = {
	title: 'Desain responsif',
	intro: [
		'Orang membuka nimbus.com dari macam macam layar. HP di satu tangan, tablet di sofa, laptop lebar di kantor. Satu layar bisa empat kali lebih lebar dari layar lain, tapi halamannya tetap sama.',
		'Dulu, situs dibikin buat satu ukuran layar komputer meja. Buka di HP, semuanya menciut sekecil semut, atau kamu harus geser ke samping terus cuma buat menyelesaikan satu kalimat.',
		'Solusinya <b>desain responsif</b>, satu halaman yang menyusun ulang dirinya biar pas di layar mana pun. Tiga kartu berjejer di laptop berubah jadi satu kolom rapi di HP.',
		'Triknya pakai aturan [[CSS|web/css]] yang namanya <b>media query</b>. Isinya kira kira "pakai baris baris ini cuma kalau layarnya minimal 600 piksel". Lebar tempat tata letaknya berubah disebut <b>breakpoint</b>.',
		'Kebanyakan tim mendesain buat HP dulu, baru menambah media query seiring layarnya membesar. Namanya <b>mobile first</b>, soalnya sekarang kebanyakan orang buka website dari HP.',
		'[fyi] Kata yang sama, dunia yang beda. Programmer juga bilang breakpoint waktu mereka menghentikan program yang lagi jalan buat mengintip isinya. Hal yang beda total, cuma kebetulan namanya sama.',
		'[ingat] Pegangannya gampang, <b>HP dulu, baru melebar</b>. Tulis tata letak HP, lalu tambah satu media query buat tiap layar yang lebih besar. Baca <b>min-width 600px</b> sebagai "mulai 600 piksel ke atas".',
		'Giliran kamu! Geser layarnya dari lebar HP sampai lebar laptop dan lihat nimbus.com menyusun ulang dirinya. Lalu matikan CSS responsifnya dan rasakan penderitaan sebuah HP.'
	],
	reactions: {
		phone:
			'Ukuran HP. Semuanya bertumpuk jadi satu kolom dan menunya dilipat jadi satu tombol. Nggak ada yang perlu digeser ke samping, jempolmu cukup gulir ke bawah.',
		tablet:
			'Lewat 600 piksel, media query pertama mulai bekerja. Sekarang ada tempat buat dua kartu berdampingan, dan gambarnya naik ke sebelah judul.',
		laptop:
			'Lewat 900 piksel, media query kedua bangun. Link menunya keluar lagi dan tiga kartu duduk dalam satu baris. HTML yang dipakai sama terus dari tadi, cuma CSS yang memilih beda.',
		fixed:
			'Aduh. Tanpa aturan responsif, halamannya ngotot selebar 960 piksel, jadi di HP kamu harus geser ke samping buat baca apa pun. Banyak situs rasanya begini sebelum zaman smartphone.',
		done: 'Satu halaman yang pas di semua layar. Desain responsif itu cuma CSS yang ngecek lebar layar dulu sebelum memilih tata letak. Berikutnya, bikin halamannya bisa dipakai semua orang, namanya [[aksesibilitas|web/a11y]].'
	},
	missionsLabel: 'Coba nimbus.com di semua layar',
	missions: {
		phone: 'Kecilkan sampai seukuran HP',
		tablet: 'Berhenti di ukuran tablet',
		laptop: 'Lebarkan sampai seukuran laptop',
		fixed: 'Matikan responsif di ukuran HP'
	},
	widthLabel: 'Lebar layar',
	presets: { phone: 'HP', tablet: 'Tablet', laptop: 'Laptop' },
	toggleLabel: 'CSS responsif',
	on: 'nyala',
	off: 'mati',
	rulesLabel: 'Media query di style.css',
	previewLabel: 'nimbus.com',
	layouts: {
		phone: 'Satu kolom',
		tablet: 'Dua kolom',
		laptop: 'Tiga kolom',
		fixed: 'Terkunci di 960 piksel'
	},
	page: {
		menu: 'Menu',
		links: ['Beranda', 'Belajar', 'Blog'],
		heroTitle: 'Belajar teknologi dari nol',
		heroText: 'Pelajaran singkat bareng Nim, langsung di browsermu.',
		cta: 'Mulai sekarang',
		cards: [
			{ title: 'Jaringan', text: 'Cara perangkat ngobrol.' },
			{ title: 'Web', text: 'Cara halaman dibangun.' },
			{ title: 'Cloud', text: 'Server yang kamu sewa.' }
		]
	},
	allDone: 'Empat misi beres, nimbus.com pas di semua layar'
};
