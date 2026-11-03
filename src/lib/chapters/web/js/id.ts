import type { JsText } from './types';

export const id: JsText = {
	title: 'Apa itu JavaScript',
	intro: [
		'Halaman nimbus.com kamu sudah punya kerangka (HTML) dan baju (CSS). Tapi coba pencet tombolnya, nggak terjadi apa apa. Halamannya belum bisa bereaksi, cuma diam doang sambil tampil cakep.',
		'Bereaksi itu tugasnya <b>JavaScript</b>, bahasa ketiga yang dimengerti semua browser. Isinya daftar perintah yang diikuti browser, misalnya "kalau ada yang pencet tombol ini, tambah satu ke keranjang".',
		'Kebanyakan JavaScript di halaman itu kerjanya menunggu sesuatu terjadi, entah dipencet, ada tombol keyboard ditekan, atau halaman digulir. Kamu kasih tahu dia harus nunggu apa dan ngapain setelahnya. Nunggu lalu bereaksi inilah yang bikin halaman terasa hidup.',
		'Sedikit kosakata. <b>let count = 0</b> bikin sebuah kotak namanya <b>variabel</b> yang menyimpan angka. <b>addEventListener</b> artinya "dengarkan ini". Kode di dalam kurung kurawal jalan tiap kali dia mendengarnya.',
		'[fyi] Walaupun namanya mirip, JavaScript nggak ada hubungannya sama Java. Dia dibikin cuma sekitar 10 hari di tahun 1995 buat browser Netscape, dan namanya lebih ke strategi marketing, soalnya Java lagi ngetren waktu itu.',
		'JavaScript juga galak. Kurang satu kurung aja, browser berhenti membaca seluruh script itu, jadi nggak ada isinya yang jalan. Sebentar lagi kamu lihat sendiri.',
		'Giliran kamu! Ini toko kecil di nimbus.com. Bikin keranjangnya menghitung, ubah berapa yang ditambah tiap pencetan, lalu rusak satu baris dengan sengaja dan lihat apa yang terjadi.'
	],
	reactions: {
		count:
			'Dia menghitung! Tiap pencetan memicu event <b>click</b>, listenernya mendengar, menambah satu ke <b>count</b>, lalu menulis angka barunya di halaman.',
		step: 'Sekarang satu pencetan nambahnya lebih banyak. Kamu cuma ganti satu angka di kode dan tombolnya berperilaku beda. Itulah inti pemrograman, perintah kecil yang bisa kamu utak atik.',
		broken:
			'Waduh, lihat consolenya. Browser ketemu sesuatu yang nggak bisa dia baca dan langsung berhenti di situ. Errornya bahkan kasih tahu baris mana yang harus kamu cek.',
		dead: 'Tuh kan, tombolnya mati. Scriptnya rusak sebelum sampai ke <b>addEventListener</b>, jadi nggak ada lagi yang mendengarkan pencetanmu.',
		fixed:
			'Hidup lagi! Baris dibetulkan, script jalan lagi, dan listenernya kembali. Developer melakukan ini seharian, merusak sesuatu, baca errornya, lalu membetulkannya.',
		loop: '[fyi] Nim mematikan loop di taman bermain kecil ini, jadi loop yang nggak pernah selesai nggak bisa bikin halamanmu macet. Halaman beneran pakai loop di mana mana kok.',
		done: 'Kamu bikin halaman bereaksi, merusaknya, lalu membetulkannya lagi. Berikutnya, yuk intip apa sebenarnya yang diubah JavaScript di balik layar, namanya [[DOM|web/dom]].'
	},
	missionsLabel: 'Hidupkan tokonya',
	missions: {
		count: 'Pencet Tambah ke keranjang dan lihat hitungannya',
		step: 'Bikin satu pencetan nambah 2',
		broken: 'Rusak satu baris dengan sengaja',
		fixed: 'Betulkan sampai tombolnya jalan lagi'
	},
	chipsLabel: 'Jalan pintas kalau ngetik ribet',
	chips: { step: 'Bikin nambah 2', breakIt: 'Hapus satu kurung', fix: 'Kembalikan' },
	jsLabel: 'script.js',
	htmlLabel: 'index.html',
	previewLabel: 'nimbus.com/shop',
	consoleLabel: 'Console',
	consoleEmpty: 'Nggak ada error, aman',
	page: {
		product: 'Boneka Nim',
		price: 'Rp150.000',
		button: 'Tambah ke keranjang',
		cart: 'Keranjang'
	},
	comment: 'Ini jalan di dalam halaman',
	loopHint: 'Loop dimatikan di sini, jadi versi ini nggak dijalankan',
	allDone: 'Empat misi beres, sekarang kamu bisa sedikit JavaScript',
	reset: 'Ulang dari awal'
};
