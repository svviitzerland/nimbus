import type { BuildToolsText } from './types';

export const id: BuildToolsText = {
	title: 'Build tools',
	intro: [
		'Waktu membangun nimbus.com, kamu menulis kode buat manusia. Banyak file kecil, nama yang panjang dan jelas, spasi yang rapi, dan komentar (catatan buat dirimu sendiri yang dilewati komputer). Enak dibaca.',
		'Buat browser, itu boros. Tiap file itu satu perjalanan terpisah lewat jaringan, dan tiap spasi dan komentar itu beban tambahan yang harus diunduh. Lihat, enam file berarti enam kali jalan ke HP.',
		'Jadi tepat sebelum situsnya online, sebuah <b>build tool</b> turun tangan. Ini program yang mengambil kodemu yang ramah manusia lalu mengemasnya buat perjalanan. Kerjanya ada tiga.',
		'Kerja pertama, <b>bundle</b>. Banyak file digabung jadi sedikit. Enam perjalanan jadi dua.',
		'Kerja kedua, <b>minify</b>. Spasi dan komentar dibuang, nama yang panjang jadi satu huruf. Susah kamu baca, tapi browser sama sekali nggak keberatan.',
		'Kerja ketiga, <b>compress</b>. Filenya dipadatkan kayak file zip, jadi makin ringan di jalan, lalu browser membukanya lagi waktu sampai.',
		'Kamu tetap mengedit versi yang ramah, dan build tool bikin versi mungil khusus buat browser. Framework sangat mengandalkan ini, karena semua [[komponen|web/components]] kamu harus jadi [[JavaScript|web/js]] dan CSS biasa pada akhirnya.',
		'[fyi] Build tool yang populer antara lain <b>Vite</b>, <b>webpack</b>, dan <b>esbuild</b>. Vite dibuat oleh pembuat Vue, dan dialah yang membangun situs ini.',
		'[ingat] Kayak packing mudik. Bundle itu masukin semua barang ke satu koper, minify itu tinggalkan yang nggak perlu, compress itu plastik vakum yang bikin bajunya kempes.',
		'Kalau mau, giliran kamu. Matikan dan nyalakan build tool, lalu lihat ukuran unduhannya berubah.'
	],
	reactions: {
		off: 'Tanpa build tool, browser dapat file persis seperti yang kamu tulis. Enam kali jalan, lengkap dengan spasi dan komentar, unduhannya jauh lebih berat.',
		on: 'Build tool nyala lagi. Dua file kecil, bukan enam file besar, situsnya sama, fiturnya sama, cuma dikemas buat perjalanan.'
	},
	steps: [
		{
			title: 'Kode buat manusia',
			body: 'Banyak file kecil, nama panjang yang jelas, dan <b>komentar</b>. Gampang dibaca dan diubah, tapi berat.'
		},
		{
			title: 'Perjalanan dan beban',
			body: 'Tiap file itu <b>satu perjalanan</b> lewat jaringan, dan tiap karakter tambahan itu <b>beban</b>. Lambat kalau sinyal HP lemah.'
		},
		{
			title: 'Build tool',
			body: 'Program yang jalan <b>sebelum</b> situsmu online dan mengemas kodemu buat browser.'
		},
		{
			title: 'Bundle',
			body: 'Menggabungkan <b>banyak file jadi sedikit</b>, jadi browser lebih jarang bolak balik.'
		},
		{
			title: 'Minify',
			body: 'Membuang spasi dan komentar dan memendekkan nama. <b>function addToCart(item)</b> jadi <b>function a(t)</b>.'
		},
		{
			title: 'Compress',
			body: 'Memadatkan file kayak <b>zip</b> buat perjalanan. Browser membukanya lagi waktu sampai.'
		},
		{
			title: 'Dua versi',
			body: 'Kamu mengedit versi yang <b>ramah</b>. Browser dapat versi yang <b>dikemas</b>. Build tool yang mengubahnya.'
		},
		{
			title: 'Alat sungguhan',
			tag: 'Info',
			body: '<b>Vite</b>, <b>webpack</b>, dan <b>esbuild</b> yang paling sering dipakai. Nimbus dibangun pakai Vite.'
		},
		{
			title: 'Packing mudik',
			tag: 'Biar nempel',
			body: 'Bundle itu <b>satu koper</b>, minify itu <b>tinggalkan yang nggak perlu</b>, compress itu <b>plastik vakum</b>.'
		}
	],
	srcLabel: 'Kode kamu',
	outLabel: 'Yang online',
	toolLabel: 'Build tool',
	jobs: { bundle: 'Bundle', minify: 'Minify', compress: 'Compress' },
	tripsTpl: '{n} kali jalan',
	sizeLabel: 'Unduhan',
	kbTpl: '{n} KB',
	turnOff: 'Matikan build tool',
	turnOn: 'Nyalakan build tool'
};
