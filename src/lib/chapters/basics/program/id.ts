import type { ProgramText } from './types';

export const id: ProgramText = {
	title: 'Program dan algoritma',
	intro: [
		'Kita mulai dari dapur dulu, jauh dari komputer. Nim pengin secangkir teh, jadi kita tulis cara bikinnya, langkah demi langkah. Lihat resepnya terisi sendiri.',
		'Daftar itu punya nama keren, <b>algoritma</b>. Artinya cuma daftar langkah yang jelas buat menyelesaikan suatu masalah. Resep itu algoritma. Petunjuk jalan yang kamu kirim ke teman biar dia sampai ke rumahmu juga (belok kiri di toko roti, pagar ketiga sebelah kanan).',
		'Siapa penemu algoritma? Sebenarnya nggak ada satu orang. Sekitar 300 SM, <b>Euklides</b> di Yunani sudah menulis langkah langkah mencari angka terbesar yang bisa membagi dua bilangan. Namanya sendiri datang dari <b>Al Khawarizmi</b>, ilmuwan di Baghdad sekitar tahun 820. Bukunya tentang cara berhitung langkah demi langkah diterjemahkan ke bahasa Latin, dan namanya ditulis <b>Algoritmi</b>. Dari situlah kata algoritma lahir.',
		'<b>Program</b> itu algoritma yang ditulis dalam bahasa yang bisa diikuti komputer. Langkahnya sama, urutannya sama, cuma ditulis dengan cara yang dimengerti mesin. Semua aplikasi di HP kamu sebenarnya ya itu.',
		'Nah, ini yang penting. Komputer mengikuti langkahnya <b>persis</b>, satu per satu, dan nggak pernah nebak maksud kamu. Kalau ada langkah yang hilang atau salah tempat, dia tetap jalanin apa yang tertulis. Kesalahan kayak gitu disebut <b>bug</b>.',
		'Sekarang bagian serunya. Semua algoritma di dunia, dari bikin teh sampai meluncurkan roket, dibangun dari tiga balok dasar aja. Yang pertama <b>urutan</b> (sequence), langkah dikerjakan satu demi satu, dari atas ke bawah.',
		'Yang kedua <b>pilihan</b> (choice). Algoritmanya bertanya, lalu memilih jalan. Kalau airnya sudah panas, langsung tuang. Kalau belum, rebus dulu.',
		'Yang ketiga <b>pengulangan</b> (repetition). Ada langkah yang diulang terus sampai sesuatu terpenuhi. Aduk, cicip, belum manis? Aduk lagi, sampai manis.',
		'[ingat] Ada tiga kata kecil yang jadi petunjuknya. <b>Lalu</b> berarti urutan, <b>kalau</b> berarti pilihan, <b>sampai</b> berarti pengulangan. Lalu, kalau, sampai. Hafal tiga kata ini, kamu bisa baca hampir semua algoritma.',
		'[fyi] Kata yang sama, dunia yang beda. Program TV atau susunan acara nikahan juga daftar hal yang terjadi berurutan. Program komputer idenya sama, cuma ditulis buat mesin yang menganggap tiap kata secara harfiah.',
		'Kalau penasaran, coba tukar dua baris resepnya dan lihat Nim tetap mengikuti urutan baru itu tanpa mikir dua kali. Ini cuma opsional kok, tehnya nggak bakal marah.'
	],
	reactions: {
		spill:
			'Byur! Baris 1 sekarang bilang tuang, padahal gelasnya belum ada, jadi airnya tumpah ke meja. Nim nggak nebak, Nim cuma melakukan persis yang tertulis. Itulah bug.',
		fixed:
			'Urutannya balik benar, tehnya sempurna lagi. Langkahnya sama persis, cuma urutannya yang berubah, dan itu aja sudah bikin beda total.'
	},
	panels: [
		{
			tag: 'Algoritma',
			title: 'Daftar langkah yang jelas',
			body: '<b>Algoritma</b> adalah kumpulan langkah untuk menyelesaikan masalah. Cukup jelas sampai siapa pun yang mengikutinya dapat hasil yang sama.'
		},
		{
			tag: 'Sejarah',
			title: 'Dari mana kata algoritma?',
			body: 'Dari nama <b>Al Khawarizmi</b>, ilmuwan Baghdad abad kesembilan. Langkah langkahnya sendiri jauh lebih tua, dan tahun 1843 <b>Ada Lovelace</b> menulis algoritma pertama untuk sebuah mesin hitung.'
		},
		{
			tag: 'Program',
			title: 'Langkah yang bisa dibaca komputer',
			body: 'Resep yang sama, sekarang ditulis dalam bahasa pemrograman (yang ini Python). Komputer membacanya dari atas ke bawah.'
		},
		{
			tag: 'Mengikuti',
			title: 'Persis seperti tertulis',
			body: 'Nim mengerjakan tiap baris sesuai urutan, nggak lebih dan nggak kurang. Baris yang menyala adalah yang sedang dijalankan.'
		},
		{
			tag: 'Balok 1',
			title: 'Urutan',
			body: 'Gambar ini namanya <b>flowchart</b> (diagram alir), peta dari sebuah algoritma. Kotak yang disambung panah dikerjakan satu demi satu, dan urutannya penting.'
		},
		{
			tag: 'Balok 2',
			title: 'Pilihan',
			body: 'Belah ketupat mengajukan pertanyaan ya atau tidak. <b>Ya</b> lewat satu jalan, <b>belum</b> lewat jalan lain, lalu keduanya ketemu lagi di bawah.'
		},
		{
			tag: 'Balok 3',
			title: 'Pengulangan',
			body: 'Panahnya balik ke atas. Aduk, cek, aduk lagi, dan baru lanjut kalau jawabannya ya. Programmer menyebutnya <b>loop</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Lalu, kalau, sampai',
			body: 'Urutan, pilihan, pengulangan. Semua aplikasi yang kamu pakai cuma tiga balok ini yang ditumpuk berkali kali.'
		},
		{
			tag: 'Coba',
			title: 'Satu tukar, satu bug',
			body: 'Tukar dua baris, komputer tetap mengikutinya baris demi baris. Nggak ada yang rusak, cuma urutannya yang salah.'
		}
	],
	history: {
		heading: 'Jejak algoritma',
		people: [
			{
				year: '± 300 SM',
				name: 'Euklides',
				place: 'Yunani',
				body: 'Menulis langkah mencari angka terbesar yang bisa membagi dua bilangan. Masih dipakai sampai sekarang.'
			},
			{
				year: '± 820',
				name: 'Al Khawarizmi',
				place: 'Baghdad',
				body: 'Menulis buku cara berhitung langkah demi langkah. Namanya jadi asal kata algoritma.'
			},
			{
				year: '1843',
				name: 'Ada Lovelace',
				place: 'Inggris',
				body: 'Menulis algoritma pertama untuk mesin hitung, sering disebut program komputer pertama.'
			}
		],
		word: ['Al Khawarizmi', 'Algoritmi', 'algoritma']
	},
	recipeTitle: 'Resep teh',
	programTitle: 'Resep yang sama, buat komputer',
	steps: {
		cup: 'Ambil gelas',
		bag: 'Masukkan teh celup ke gelas',
		boil: 'Kalau airnya belum panas, rebus dulu',
		pour: 'Tuang air ke gelas',
		stir: 'Tambah gula, aduk sampai manis'
	},
	flow: {
		start: 'Mulai',
		cup: 'Ambil gelas',
		bag: 'Masukkan teh',
		hot: 'Air panas?',
		boil: 'Rebus dulu',
		pour: 'Tuang air',
		sweet: 'Sudah manis?',
		stir: 'Aduk',
		done: 'Teh siap',
		yes: 'ya',
		no: 'belum'
	},
	blocks: {
		sequence: { name: 'Urutan', word: 'lalu' },
		choice: { name: 'Pilihan', word: 'kalau' },
		repetition: { name: 'Pengulangan', word: 'sampai' }
	},
	rule: 'Lalu itu urutan, kalau itu pilihan, sampai itu pengulangan.',
	swap: 'Tukar baris 1 dan 4',
	unswap: 'Kembalikan',
	result: {
		idle: 'Nim siap di dapur',
		working: 'Nim menjalankan baris {n}, persis seperti tertulis',
		tea: 'Secangkir teh panas dan manis',
		spill: 'Air tumpah ke meja, gelasnya kosong'
	}
};
