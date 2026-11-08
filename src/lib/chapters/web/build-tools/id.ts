import type { BuildToolsText } from './types';

export const id: BuildToolsText = {
	title: 'Build tools',
	intro: [
		'Waktu kamu membangun nimbus.com, kamu menulis kode buat manusia. Banyak file kecil, nama yang jelas, spasi, dan komentar yang menjelaskan sesuatu. Enak buat kamu, tapi boros buat browser.',
		'Tiap file itu satu perjalanan terpisah lewat jaringan, dan tiap spasi atau komentar itu beban tambahan yang harus diunduh. Di HP yang lambat, sembilan file gemuk bisa bikin nunggu lama sebelum halamannya jalan.',
		'<b>Build tool</b> memperbaiki itu tepat sebelum situsmu tayang. Dia <b>membundel</b> banyak file jadi beberapa saja, <b>meminify</b> dengan membuang spasi dan komentar serta memendekkan nama, lalu <b>mengompres</b> biar perjalanannya makin ringan.',
		'Kamu tetap mengedit versi yang ramah manusia, dan build tool mengeluarkan versi mungil khusus buat browser. Framework sangat bergantung pada ini, soalnya semua [[komponen|web/components]] kamu pada akhirnya harus jadi [[JavaScript|web/js]] dan [[CSS|web/css]] biasa.',
		'[fyi] Build tool yang populer antara lain <b>Vite</b>, <b>webpack</b>, dan <b>esbuild</b>. Vite dibuat oleh pencipta Vue, dan Vite juga yang membangun situs ini.',
		'[ingat] Bundle menggabungkan modul kode. Minify mempersingkat kode tanpa mengubah perilakunya. Compression memperkecil data yang dikirim.',
		'Ini sembilan file sumber nimbus.com. Pilih langkah build mana yang mau dinyalakan, pencet Build, lalu lihat seberapa ringan situsnya jadinya.'
	],
	reactions: {
		none: 'Kalau semua langkah dimatikan, build cuma menyalin file apa adanya. Tetap sembilan perjalanan, tetap seberat tadi. Coba nyalakan satu langkah.',
		partial:
			'Udah lebih ringan! Tiap langkah membantu dengan caranya sendiri, bundel mengurangi jumlah perjalanan dan dua lainnya mengurangi beratnya. Coba lihat kalau ketiganya nyala.',
		best: 'Lihat tuh, sembilan file jadi tiga, dan unduhannya menyusut tinggal sepotong kecil dari aslinya. Situsnya sama, fiturnya sama, cuma dikemas buat perjalanan.',
		peek: '[fyi] Itu kode yang sudah diminify. Spasi hilang, komentar hilang, nama panjang jadi satu huruf. Susah dibaca manusia, tapi browser sama sekali nggak peduli.'
	},
	srcLabel: 'Kode sumbermu',
	outLabel: 'Yang dikirim ke internet',
	steps: {
		bundle: { label: 'Bundle', sub: 'Gabung file jadi satu' },
		minify: { label: 'Minify', sub: 'Buang spasi dan komentar' },
		compress: { label: 'Compress', sub: 'Peras buat perjalanan' }
	},
	build: 'Build',
	building: 'Lagi build',
	filesLabel: 'File',
	sizeLabel: 'Unduhan',
	loadLabel: 'HP lambat',
	loadValue: '{s} detik',
	outEmpty: 'Pencet Build buat bikin versi onlinenya',
	peek: 'Intip isi cart.js',
	before: 'Sebelum',
	after: 'Setelah minify'
};
