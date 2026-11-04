import type { ComponentsText } from './types';

export const id: ComponentsText = {
	title: 'Komponen',
	intro: [
		'Perhatikan baik baik halaman toko ini. Kartu kecil yang sama muncul berulang ulang, ada gambar, nama, dan harga. Cuma isinya yang beda, bentuknya tetap sama.',
		'Framework bikin kamu bisa menulis kartu itu <b>sekali saja</b>, sebagai <b>komponen</b>. Komponen itu potongan halaman yang bisa dipakai ulang, kayak satu balok LEGO yang bisa dipasang di mana aja. Ini dia Card, masih kosong.',
		'Biar tiap salinan beda, kamu kasih dia data yang namanya <b>props</b> (singkatan dari properties). Lihat. Nama dan harga masuk, kartu jadi keluar, empat kali, dari Card yang sama.',
		'Satu halaman utuh dibangun dengan cara ini, komponen di dalam komponen. Header itu satu komponen, tiap kartu juga, bahkan tombol pun bisa jadi komponen sendiri.',
		'Sekarang bagian paling seru. Tambahkan tombol Tambah ke keranjang ke Card <b>sekali</b>, dan semua kartu di halaman langsung punya tombol itu bersamaan. Inilah untungnya pakai [[framework|web/why-framework]].',
		'[fyi] Nimbus sendiri juga tersusun dari komponen. Nim, balon bicara, dan tombol Lanjut masing masing ditulis sekali lalu dipakai ulang di tiap pelajaran yang kamu buka.',
		'[ingat] Komponen itu cetakan kue, props itu toppingnya. Cetakannya satu, kuenya banyak, toppingnya beda beda.',
		'Kalau mau, giliran kamu. Copot tombolnya dari Card, atau pasang lagi, lalu lihat keempat kartu ikut berubah.'
	],
	reactions: {
		plain:
			'Hilang dari Card, hilang juga dari semua kartu. Kamu mengubah satu cetakan, bukan empat halaman.',
		upgrade:
			'Balik ke Card, balik juga ke keempatnya. Di toko dengan seribu produk, itu cukup satu kali ubah, bukan seribu.'
	},
	steps: [
		{
			title: 'Bentuk yang sama',
			body: 'Halaman toko mengulang satu <b>pola</b>. Gambar, nama, harga, terus berulang dengan isi yang beda.'
		},
		{
			title: 'Komponen',
			body: 'Potongan halaman yang bisa dipakai ulang, ditulis <b>sekali</b>. Di Svelte dia punya file sendiri, di sini <b>Card.svelte</b>.'
		},
		{
			title: 'Props',
			body: '<b>Props</b> itu detail yang kamu kasih masuk. Card sama, props beda, jadi satu menampilkan mug dan berikutnya topi.'
		},
		{
			title: 'Potongan dalam potongan',
			body: 'Halaman itu susunan komponen. Header, tiap kartu, dan tiap tombol bisa jadi potongan sendiri.'
		},
		{
			title: 'Ubah sekali',
			body: 'Ubah komponennya dan <b>semua salinan</b> ikut berubah, jadi seluruh toko tetap seragam.'
		},
		{
			title: 'Nimbus juga',
			tag: 'Info',
			body: 'Nim, balon bicara, dan tombol Lanjut itu komponen, ditulis sekali dan dipakai ulang di tiap pelajaran.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: 'Komponen itu <b>cetakan kue</b>, props itu <b>toppingnya</b>.'
		}
	],
	recipeLabel: 'Card.svelte',
	propsLabel: 'props',
	pageLabel: 'nimbus.com/shop',
	headerTag: 'Header',
	cardTag: 'Card',
	products: [
		{ name: 'Mug Nim', price: 12 },
		{ name: 'Topi Nim', price: 15 },
		{ name: 'Kaos Awan', price: 20 },
		{ name: 'Stiker', price: 3 }
	],
	money: 'Rp{n}rb',
	addToCart: 'Ke keranjang',
	removeButton: 'Copot tombol dari Card',
	addButton: 'Pasang lagi tombol di Card'
};
