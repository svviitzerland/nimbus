import type { WhyFrameworkText } from './types';

export const id: WhyFrameworkText = {
	title: 'Apa itu framework',
	intro: [
		'nimbus.com awalnya kecil, cuma satu halaman depan yang ditulis manual pakai [[HTML|web/html]]. Lalu dia tumbuh. Ada halaman toko, keranjang, checkout, hasil pencarian, email struk. Masing masing file sendiri.',
		'Sekarang mug Nim lagi diskon. Harganya ada di sepuluh file berbeda, dan harus ada yang nyari lalu ngubah satu per satu. Ketinggalan satu aja, keranjang bilang harga A tapi checkout bilang harga B.',
		'<b>Framework</b> itu struktur siap pakai buat bikin aplikasi, biar kamu nggak ngulang ngulang hal yang sama. Tiap data disimpan di <b>satu tempat</b>, dan semua halaman yang memakainya ikut berubah sendiri waktu datanya diganti.',
		'Buat halaman di browser, nama nama besarnya itu <b>React</b> (buatan Facebook), <b>Vue</b>, <b>Svelte</b>, dan <b>Angular</b> (buatan Google). Semuanya jalan di atas [[JavaScript|web/js]], dan semuanya menyelesaikan masalah yang sama dengan gaya yang sedikit beda.',
		'[fyi] Halaman yang lagi kamu buka ini dibangun pakai Svelte. Tiap pelajaran memakai ulang Nim yang sama, balon kata yang sama, dan tombol yang sama, persis trik yang bakal kamu lihat di [[komponen|web/components]].',
		'[ingat] Simpan data yang sama di satu sumber, lalu gunakan kembali pada komponen yang membutuhkannya.',
		'Giliran kamu. Harga mug turun dari 12 jadi 9. Pertama, ubah kesepuluh tempat itu secara manual lalu publish, habis itu coba cara framework dan rasakan bedanya.'
	],
	reactions: {
		missed:
			'Waduh, situsnya tayang dengan harga campur aduk. Pembeli lihat satu harga di keranjang dan harga lain di checkout. Persis begini bug menyelinap kalau data yang sama disalin ke mana mana.',
		handDone:
			'Kesepuluhnya beres. Berhasil sih, tapi bayangin toko beneran dengan ratusan halaman dan puluhan harga. Sekarang pindah ke tab framework.',
		framework:
			'Sekali ubah, dan kesepuluh tempat langsung ikut. Harganya tinggal di satu tempat dan semua halaman membacanya dari situ. Itulah inti dari apa yang dikasih sebuah framework.'
	},
	modes: { hand: 'Manual', framework: 'Pakai framework' },
	handHint: 'Tap tiap file buat ganti harga mug jadi 9, lalu publish',
	frameworkHint: 'Ubah harganya sekali dan lihat semua halaman',
	places: [
		'home.html',
		'shop.html',
		'mug.html',
		'cart.html',
		'checkout.html',
		'search.html',
		'deals.html',
		'wishlist.html',
		'receipt.html',
		'email.html'
	],
	money: 'Rp{n}rb',
	publish: 'Publish',
	publishedOk: 'Tayang dengan harga yang sama di semua halaman',
	publishedMissed: 'Tayang, tapi {n} halaman masih pakai harga lama',
	edits: '{n} kali edit',
	priceLabel: 'harga',
	cheaper: 'Turunkan harga',
	pricier: 'Naikkan harga',
	reset: 'Ulang dari awal'
};
