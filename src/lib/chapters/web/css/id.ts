import type { CssText } from './types';

export const id: CssText = {
	title: 'Apa itu CSS',
	intro: [
		'Masih ingat halaman nimbus.com yang kamu bangun pakai [[HTML|web/html]]? Ada judul, paragraf, tombol, dan Nim. Halamannya jalan, tapi polos banget, huruf hitam di atas putih, kayak formulir sekolah tahun 1995.',
		'Soalnya HTML cuma bilang tiap bagian itu apa. Soal tampilannya itu tugas lain, punyanya <b>CSS</b> (singkatan dari Cascading Style Sheets). Kalau HTML itu kerangka, CSS itu bajunya. Lihat, Nim mulai nulis satu aturan buat <b>body</b>, seluruh halaman.',
		'Di dalam kurung kurawal ada perintah kecil, masing masing pasangan <b>property</b> dan <b>value</b>. Di sini propertynya background dan valuenya biru muda. Satu baris, dan seluruh halaman berubah.',
		'Sekarang aturan yang cuma milih <b>h1</b>, si judul. Warnanya jadi merah tomat, dan bagian lain nggak bergeser sedikit pun. Bagian sebelum kurung, namanya <b>selector</b>, yang menentukan siapa yang kena.',
		'Balik ke body, satu baris lagi mengganti huruf. Semua teks ikut ganti sekaligus, karena tag di dalam body meminjam hurufnya dari body. Pinjam meminjam ini namanya <b>inheritance</b> (pewarisan).',
		'Tombolnya dapat aturan sendiri, warna, tanpa garis tepi, sudut bulat, dan sedikit padding (ruang di dalam kotak). Semua tombol yang pernah kamu pencet di aplikasi dibentuk pakai baris kayak gini.',
		'[fyi] Kata cascading artinya aturan bisa bertumpuk. Nim menambah aturan h1 kedua di bawah, dan judulnya jadi biru. Kalau dua aturan menunjuk hal yang sama dengan cara yang sama, yang ditulis belakangan yang menang.',
		'[ingat] Baca tiap aturan kayak kalimat pendek. Selector itu <b>siapa</b>, property itu <b>apa</b>, value itu <b>gimana</b>. Jadi h1, color, tomato artinya si judul, warnanya, merah tomat. Siapa, apa, gimana.',
		'Dari tadi HTML sama sekali nggak berubah, cuma bajunya yang ganti. Kalau mau, pencet salah satu warna di bawah kode dan lihat judulnya ikut. Berikutnya, tombol itu belajar ngapa ngapain pakai [[JavaScript|web/js]].'
	],
	reactions: {
		color:
			'Lihat, cuma aturan h1 terakhir yang berubah, dan judulnya langsung ikut. Itu cascade lagi kerja, aturan yang belakangan tetap menang.'
	},
	steps: [
		{
			tag: 'index.html',
			title: 'Cuma HTML',
			body: 'Halamannya punya struktur tapi belum punya gaya, jadi browser pakai tampilan bawaannya yang polos.'
		},
		{
			title: 'Aturan dimulai',
			body: '<b>body</b> memilih tag yang membungkus semua yang kamu lihat. Kurung kurawal nanti berisi apa yang mau diubah.'
		},
		{
			title: 'Property dan value',
			body: '<b>background</b> itu propertynya, biru muda itu valuenya. Tiap baris ditutup titik koma.'
		},
		{
			title: 'Selector',
			body: 'Aturan cuma menyentuh apa yang dipilih selectornya. <b>h1</b> artinya judul utama, nggak lebih.'
		},
		{
			title: 'Inheritance',
			body: 'Gaya teks mengalir dari induk ke semua isinya, jadi satu baris huruf di body sudah mencakup seluruh halaman.'
		},
		{
			title: 'Membentuk kotak',
			body: 'Tiap elemen itu kotak. <b>padding</b> itu ruang di dalamnya dan <b>border-radius</b> membulatkan sudutnya.'
		},
		{
			title: 'Cascade',
			body: 'Dua aturan h1 beda pendapat soal warna. Keduanya menunjuk judul dengan cara yang sama, jadi yang lebih bawah yang menang.'
		},
		{
			tag: 'Biar nempel',
			title: 'Siapa, apa, gimana',
			body: '<b>h1</b> itu siapa, <b>color</b> itu apa, <b>tomato</b> itu gimana. Semua baris CSS yang bakal kamu baca ikut pola ini.'
		},
		{
			title: 'Stylesheet kamu',
			body: 'Pencet satu warna buat menulis ulang aturan h1 terakhir. Halamannya berubah begitu barisnya selesai ditulis.'
		}
	],
	comment: 'gaya buat nimbus.com',
	cssLabel: 'style.css',
	previewLabel: 'nimbus.com',
	page: {
		heading: 'Selamat datang di Nimbus',
		paragraph: 'Website pertamamu di cloud.',
		button: 'Mulai sekarang',
		alt: 'Nim si awan'
	},
	tryLabel: 'Pilih warna judul'
};
