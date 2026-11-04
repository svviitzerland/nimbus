import type { JsText } from './types';

export const id: JsText = {
	title: 'Apa itu JavaScript',
	intro: [
		'Toko nimbus.com kamu sudah punya kerangka (HTML) dan baju (CSS). Tapi coba pencet tombolnya, nggak terjadi apa apa. Halamannya belum bisa bereaksi, cuma diam sambil tampil cakep.',
		'Bereaksi itu tugasnya <b>JavaScript</b>, bahasa ketiga yang dimengerti semua browser. Isinya daftar perintah yang diikuti browser dari atas ke bawah. Nim nulis yang pertama, sebuah kotak namanya <b>variabel</b> yang mengingat angka.',
		'Berikutnya kodenya harus menemukan bagian yang mau dia urus, tombolnya dan angka di keranjang. Anggap aja kayak menunjuk barang di halaman lalu kasih nama.',
		'Sekarang bagian pentingnya. <b>addEventListener</b> artinya "dengarkan ini". Di sini dia mendengarkan klik, dan dua baris di dalamnya jalan tiap kali ada klik.',
		'Lihat tombolnya dipencet. Tiap pencetan memicu klik, listenernya mendengar, menambah satu ke hitungan, lalu menulis angka barunya di halaman.',
		'[fyi] Walaupun namanya mirip, JavaScript nggak ada hubungannya sama Java. Dia dibikin cuma sekitar sepuluh hari di tahun 1995 buat browser Netscape, dan namanya lebih ke strategi marketing, soalnya Java lagi ngetren waktu itu.',
		'Tapi JavaScript itu galak. Nim menghapus satu kurung kecil, dan browser berhenti membaca seluruh script. Lihat, tombolnya tetap dipencet tapi nggak ada yang terhitung, dan consolenya menampilkan error.',
		'Kurungnya dikembalikan, semuanya jalan lagi. Developer melakukan ini seharian, baca errornya, cari barisnya, betulkan.',
		'[ingat] Hampir semua JavaScript di halaman kerjanya tiga hal, <b>cari, dengar, ubah</b>. Kayak satpam rumah, dia tahu pintu mana yang dijaga, nunggu bel bunyi, lalu bukain pintu.',
		'Sekarang tokonya punya kamu. Pencet Tambah ke keranjang sendiri kalau mau, atau ganti jadi nambah 2 per pencetan dan lihat kodenya menulis ulang dirinya. Berikutnya, kita intip apa yang sebenarnya diubah JavaScript, namanya [[DOM|web/dom]].'
	],
	reactions: {
		tap: 'Itu pencetanmu sendiri! Listenernya nggak bisa bedain kamu sama Nim, dia cuma dengar ada klik lalu menjalankan dua barisnya.',
		step: 'Cuma satu angka di kode yang berubah, dan tombolnya sekarang berperilaku beda. Itulah inti pemrograman, perintah kecil yang bisa kamu utak atik.'
	},
	steps: [
		{
			tag: 'script.js',
			title: 'Halaman yang cuma diam',
			body: 'HTML kasih bagian bagiannya dan CSS kasih tampilannya, tapi belum ada yang mendengarkan pencetanmu.'
		},
		{
			title: 'Variabel',
			body: '<b>let count = 0</b> bikin kotak berlabel yang menyimpan angka. Kodenya bisa membaca dan mengubahnya nanti.'
		},
		{
			title: 'Mencari bagian',
			body: '<b>querySelector</b> menemukan satu bagian halaman, di sini tombol dan angka keranjang, supaya kodenya bisa memakainya.'
		},
		{
			title: 'Listener',
			body: 'Dia menunggu <b>click</b>. Baris di dalam kurung kurawal jalan setiap kali dia mendengarnya.'
		},
		{
			title: 'Jalan',
			body: 'Tiap pencetan menambah satu ke <b>count</b>, lalu menaruh angka barunya di halaman. Perhatikan keranjangnya.'
		},
		{
			title: 'Bukan Java',
			body: 'Dua nama ini cuma mirip di atas kertas. JavaScript jalan di semua browser, Java itu bahasa lain buat urusan lain.'
		},
		{
			title: 'Kurang satu kurung',
			body: 'Browser nggak bisa membaca scriptnya, jadi nggak ada yang dijalankan. Nggak ada yang mendengarkan, dan console bilang kenapa.'
		},
		{
			title: 'Beres',
			body: 'Kurungnya kembali, seluruh script jalan lagi, listenernya kembali, dan pencetan terhitung.'
		},
		{
			tag: 'Cara ingat',
			title: 'Cari, dengar, ubah',
			body: '<b>querySelector</b> mencari, <b>addEventListener</b> mendengar, dan baris di dalamnya mengubah halaman.'
		},
		{
			title: 'Toko kamu',
			body: 'Pencet tombol di preview, atau ganti berapa yang ditambah tiap pencetan. Scriptnya cuma hidup di dalam preview.'
		}
	],
	comment: 'masih kosong, jadi tombolnya nggak ngapa ngapain',
	jsLabel: 'script.js',
	previewLabel: 'nimbus.com/shop',
	consoleLabel: 'Console',
	consoleEmpty: 'Nggak ada error, aman',
	page: {
		product: 'Boneka Nim',
		price: 'Rp150.000',
		button: 'Tambah ke keranjang',
		cart: 'Keranjang'
	},
	stepLabel: 'Tiap pencetan nambah'
};
