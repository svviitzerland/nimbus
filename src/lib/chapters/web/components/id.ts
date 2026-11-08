import type { ComponentsText } from './types';

export const id: ComponentsText = {
	title: 'Komponen',
	intro: [
		'Coba perhatikan halaman toko mana pun. Kartu kecil yang sama muncul lagi dan lagi, ada gambar, nama, dan harga. Cuma isinya yang berubah, bentuknya tetap sama.',
		'Framework bikin kamu bisa menulis kartu itu <b>sekali</b> aja, sebagai <b>komponen</b>. Komponen itu potongan halaman yang bisa dipakai ulang, kayak balok LEGO. Tombol, kartu, menu, bahkan header utuh, masing masing bisa jadi komponen sendiri.',
		'Biar tiap salinannya beda, kamu kasih data ke dalamnya, namanya <b>props</b> (singkatan dari properties). Kartunya sama, propsnya beda, jadi yang satu nampilin mug dan yang berikutnya topi.',
		'[fyi] Inilah hasil manis dari [[framework|web/why-framework]]. Nimbus sendiri juga tersusun dari komponen. Nim, balon kata, dan tombol Next ditulis sekali lalu dipakai ulang di semua pelajaran.',
		'[ingat] Komponen menggabungkan tampilan dan perilaku yang dapat dipakai ulang. Props memasukkan data ke setiap pemakaian komponen.',
		'Ini komponen Card dan daftar produk nimbus.com. Isi tokonya dengan memakai ulang Card yang sama buat tiap produk, lalu ubah Card sekali dan lihat apa yang terjadi.'
	],
	reactions: {
		first:
			'Itu kartu pertamamu. Komponen itu resepnya, dan props (nama dan harga) yang bikin salinan ini jadi mug.',
		all: 'Empat kartu dari satu resep. Kamu nggak pernah nulis kartunya empat kali, cuma ngasih data yang beda. Sekarang coba ubah resepnya.',
		upgrade:
			'Sekali ubah Card, dan semua produk langsung dapat tombol. Di situs beneran dengan ratusan produk, ini hemat waktu berjam jam dan bikin semua kartu tetap seragam.'
	},
	recipeLabel: 'Card.svelte',
	dataLabel: 'Produk',
	previewLabel: 'nimbus.com/shop',
	products: [
		{ name: 'Mug Nim', price: 12 },
		{ name: 'Topi Nim', price: 15 },
		{ name: 'Kaos Awan', price: 20 },
		{ name: 'Paket stiker', price: 3 }
	],
	money: 'Rp{n}rb',
	use: 'Pakai Card',
	used: 'Sudah dipasang',
	empty: 'Belum ada barang dijual',
	upgrade: 'Tambah tombol ke Card',
	addToCart: 'Masukkan keranjang',
	upgradeHint: 'Pasang keempat kartunya dulu'
};
