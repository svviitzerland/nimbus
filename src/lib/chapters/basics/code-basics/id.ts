import type { CodeBasicsText } from './types';

export const id: CodeBasicsText = {
	title: 'Variabel, fungsi, dan list',
	intro: [
		'Kita balik lagi ke dapur dari [[Program dan algoritma|basics/program]]. Waktu bikin teh, program harus mengingat sesuatu, misalnya berapa sendok gula. Tiap hal itu disimpan di <b>variabel</b>, sebuah kotak berlabel nama yang menyimpan satu nilai. Kotak ini namanya sugar (gula), dan isinya 2.',
		'Isi kotaknya bisa diganti, makanya namanya variabel (bisa berubah ubah). Tulis sugar = 3, angka 2 dibuang dan angka 3 masuk. Labelnya tetap, cuma isinya yang ganti. Di kode, tanda = artinya masukkan nilai ini ke kotak, bukan sama dengan.',
		'[ingat] Bayangkan toples di rak dapur, masing masing ada stikernya. Stiker itu <b>nama</b>, dan isi toplesnya itu <b>nilai</b>. Kamu minta toples lewat stikernya, dan kamu dapat apa pun yang ada di dalamnya.',
		'Nilai punya beberapa jenis, namanya <b>tipe data</b>. <b>Angka</b> bisa dihitung, misalnya 2. <b>Teks</b> itu huruf di dalam tanda kutip, misalnya "Nim" (programmer menyebutnya string). Lalu <b>benar atau salah</b> menjawab pertanyaan ya atau tidak, misalnya airnya sudah panas atau belum (namanya boolean).',
		'Kadang satu nilai nggak cukup. Langkah langkah resep dimasukkan ke sebuah <b>list</b> (disebut juga array), satu kotak panjang yang menyimpan banyak nilai berurutan. Tiap nilai punya nomor posisi, dan komputer mulai menghitung dari 0, jadi steps[0] itu "cup" (gelas).',
		'Cara kedua menyimpan banyak nilai bentuknya mirip kartu kontak di HP kamu. Tiap nilai duduk di sebelah <b>key</b> (kunci), semacam label kecil seperti name, phone, atau email. Kamu cari nilainya lewat key, bukan lewat posisi. Python menyebutnya <b>dictionary</b>, JavaScript menyebutnya <b>object</b>.',
		'Sekarang resep tehnya sendiri. Daripada menulis semua langkahnya tiap kali, kita bungkus dan kasih nama, make_tea. Itulah <b>fungsi</b>, resep yang bisa dipakai berulang. Yang masuk (berapa sendok gula) disebut <b>input</b>, dan yang keluar (secangkir teh) disebut <b>output</b>.',
		'Untuk memakainya, kamu <b>panggil</b> fungsinya lewat namanya dan taruh inputnya di dalam kurung. make_tea(2) menghasilkan teh manis, make_tea(0) menghasilkan teh tawar. Ditulis sekali, dipakai sesering yang kamu mau.',
		'[ingat] Fungsi itu kayak rice cooker. Beras dan air masuk (inputnya), kamu pencet satu tombol (memanggilnya), dan nasi matang keluar (outputnya). Kamu nggak perlu tahu apa yang terjadi di dalamnya.',
		'Semua program yang bakal kamu baca dibangun dari potongan ini, kotak bernama, list, kartu, dan resep. Kalau mau, pilih berapa sendok gula yang Nim mau, lalu panggil make_tea sendiri.'
	],
	reactions: {
		call: 'Kamu memanggil make_tea, dan semua langkah di dalamnya jalan sendiri, berurutan. Resepnya sama, inputnya punyamu, tehnya baru.',
		plain:
			'Nol sendok gula, jadi teh tawar. Fungsinya sama sekali nggak berubah, cuma inputnya, dan itu aja sudah mengubah outputnya.'
	},
	panels: [
		{
			tag: 'Variabel',
			title: 'Kotak yang punya nama',
			body: '<b>Variabel</b> punya nama (labelnya) dan nilai (isinya). Kode di sini pakai <b>Python</b>, bahasa yang kebaca hampir seperti bahasa Inggris biasa.'
		},
		{
			tag: 'Variabel',
			title: 'Nilainya bisa berubah',
			body: 'Masukkan nilai baru, nilai lama hilang. Namanya tetap sama, jadi bagian program yang lain masih bisa menemukannya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Toples berstiker',
			body: 'Stiker itu <b>nama</b>, isinya itu <b>nilai</b>. Minta lewat stiker, dapat isinya.'
		},
		{
			tag: 'Tipe data',
			title: 'Angka, teks, benar atau salah',
			body: '<b>2</b> itu angka, <b>"Nim"</b> itu teks (string), dan <b>True</b> itu jawaban ya atau tidak (boolean). Teks selalu ada di dalam tanda kutip.'
		},
		{
			tag: 'List',
			title: 'Banyak nilai, berurutan',
			body: '<b>List</b> (atau array) menyimpan nilai berjejer. Tiap nilai punya posisi yang dihitung dari <b>0</b>, dan kamu ambil satu pakai kurung siku.'
		},
		{
			tag: 'Key dan value',
			title: 'Kartu kontak',
			body: 'Tiap nilai punya <b>key</b> di sebelahnya. Kamu sebut key, misalnya email, dan dapat nilainya. Di sini urutan nggak penting, key yang penting.'
		},
		{
			tag: 'Fungsi',
			title: 'Resep yang bisa dipakai lagi',
			body: '<b>def</b> memulai sebuah fungsi. Namanya make_tea, <b>input</b> masuk di dalam kurung, dan <b>return</b> mengembalikan <b>output</b>.'
		},
		{
			tag: 'Memanggil',
			title: 'Pakai lewat namanya',
			body: 'Tulis namanya, taruh input di dalam kurung, dan seluruh resepnya jalan. Input beda, output juga beda.'
		},
		{
			tag: 'Biar nempel',
			title: 'Rice cooker',
			body: 'Masuk beras dan air, pencet satu tombol, keluar nasi. Input, panggil, output.'
		},
		{
			tag: 'Coba',
			title: 'Panggil make_tea sendiri',
			body: 'Pilih berapa sendok gula, lalu panggil fungsinya. Resepnya tetap sama, cuma inputmu yang berubah.'
		}
	],
	nameTag: 'nama',
	valueTag: 'nilai',
	types: { number: 'angka', text: 'teks', bool: 'benar atau salah' },
	listNote: 'Posisi dimulai dari 0',
	cardTitle: 'Kontak',
	cardNote: 'Cari nilai lewat key',
	inputTag: 'input',
	outputTag: 'output',
	teaOut: 'teh, {n} sendok gula',
	plainOut: 'teh tawar',
	reuseNote: 'Ditulis sekali, dipakai dua kali',
	cooker: { input: 'beras dan air', button: 'masak', output: 'nasi' },
	playHint: 'Sendok gula',
	callButton: 'Panggil make_tea'
};
