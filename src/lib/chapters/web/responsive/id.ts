import type { ResponsiveText } from './types';

export const id: ResponsiveText = {
	title: 'Desain responsif',
	intro: [
		'Orang membuka nimbus.com dari macam macam layar, HP di satu tangan, tablet di sofa, laptop lebar di kantor. Ini dia di laptop, tampilannya oke.',
		'Tapi halaman ini dibangun cara lama, dikunci selebar 960 piksel. Lihat layarnya mengecil jadi HP. Halamannya nggak mau muat, jadi kamu harus geser ke samping terus cuma buat baca satu kalimat.',
		'Solusinya <b>desain responsif</b>, satu halaman yang menyusun ulang dirinya supaya pas di layar apa pun. Nim menulis ulang [[CSS|web/css]] nya, mulai dari HP. Kartunya satu kolom, nggak ada yang lebih lebar dari layar.',
		'Sekarang layarnya membesar jadi tablet. Nim menambah <b>media query</b>, sebuah blok CSS yang cuma berlaku kalau layarnya minimal 600 piksel. Dua kartu per baris, dan halamannya menyusun ulang sendiri.',
		'Satu lagi buat laptop, mulai 900 piksel. Tiga kartu sebaris dan link menunya keluar. Lebar tempat tata letaknya berubah, di sini 600 dan 900, namanya <b>breakpoint</b>.',
		'Lihat layarnya membesar dan mengecil sendiri. Tiap kali lewat breakpoint, kartunya loncat ke susunan baru. HTML nya sama terus, cuma CSS nya yang memilih beda.',
		'[fyi] Kata yang sama, dunia yang beda. Programmer juga bilang breakpoint waktu mereka menghentikan program yang lagi jalan buat mengintip isinya. Hal yang beda total, cuma kebetulan namanya sama.',
		'[ingat] Pegangannya gampang, <b>HP dulu, baru melebar</b>. Tulis tata letak HP, lalu tambah satu media query buat tiap layar yang lebih besar. Baca <b>min-width 600px</b> sebagai "mulai 600 piksel ke atas".',
		'Itulah desain responsif, CSS yang mengecek lebar layar sebelum memilih tata letak. Geser slidernya kalau mau menangkap loncatannya sendiri. Berikutnya, halaman buat semua orang, [[aksesibilitas|web/a11y]].'
	],
	reactions: {
		drag: 'Sekarang kamu yang jadi layarnya. Perhatikan momen kamu lewat 600 atau 900, itu media query lagi nyala atau mati.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'Satu halaman, banyak layar',
			body: 'Lebar HP sekitar 360 piksel, laptop 1000 lebih. Halaman yang sama harus tampil pas di semuanya.'
		},
		{
			title: 'Lebar yang dikunci',
			body: '<b>width 960px</b> memaksa halamannya tetap selebar laptop. Di HP dia tumpah keluar dari tepi layar.'
		},
		{
			title: 'HP dulu',
			body: 'Mulai dari layar paling kecil. Satu kolom, jadi nggak ada yang lebih lebar dari HP nya.'
		},
		{
			title: 'Media query',
			body: 'Blok yang dimulai <b>@media</b> cuma berlaku kalau layarnya minimal 600 piksel. Di HP blok itu dilewati.'
		},
		{
			title: 'Breakpoint',
			body: 'Penggaris menandai 600 dan 900, breakpoint halaman ini. Lewat 900, media query kedua ikut bangun.'
		},
		{
			title: 'Menyusun ulang',
			body: 'Browser terus mengecek lebarnya. Lewat breakpoint, dia langsung menyusun ulang halamannya.'
		},
		{
			title: 'Dua arti',
			body: 'Di dunia debugging, breakpoint itu titik berhenti program. Kata yang sama, alat yang beda total.'
		},
		{
			tag: 'Cara ingat',
			title: 'HP dulu, baru melebar',
			body: '<b>min-width</b> artinya "mulai lebar ini ke atas". Tata letak HP duluan, satu media query per layar yang lebih besar.'
		},
		{
			title: 'Giliran kamu, kalau mau',
			body: 'Geser slidernya buat mengubah lebar layar sendiri dan tangkap momen tata letaknya loncat.'
		}
	],
	cssLabel: 'style.css',
	previewLabel: 'nimbus.com',
	widthLabel: 'lebar {n} piksel',
	sizes: { phone: 'HP', tablet: 'tablet', laptop: 'laptop' },
	sliderLabel: 'Lebar layar',
	page: {
		menu: 'Menu',
		links: ['Beranda', 'Belajar', 'Blog'],
		heroTitle: 'Belajar teknologi dari nol',
		heroText: 'Pelajaran singkat bareng Nim, langsung di browsermu.',
		cards: [
			{ title: 'Jaringan', text: 'Cara perangkat ngobrol.' },
			{ title: 'Web', text: 'Cara halaman dibangun.' },
			{ title: 'Cloud', text: 'Server yang kamu sewa.' }
		]
	}
};
