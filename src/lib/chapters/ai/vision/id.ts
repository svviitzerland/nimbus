import type { VisionText } from './types';

export const id: VisionText = {
	title: 'Computer vision',
	intro: [
		'Buat kamu, foto kucing ya kucing. Buat komputer, foto itu cuma kisi raksasa berisi kotak warna mungil bernama <b>piksel</b>, jutaan angka dan nggak lebih. Terus gimana caranya dia bisa menemukan kucing di situ?',
		'<b>Computer vision</b> adalah bagian AI yang memahami gambar, dan cara kerjanya seperti [[neural network|ai/neural-net]] dengan banyak lapisan. Tiap lapisan melihat temuan lapisan sebelumnya lalu merangkai sesuatu yang sedikit lebih besar.',
		'Lapisan pertama cuma mencari <b>tepi</b> (edge), tempat terang bertemu gelap, yang mendatar, yang tegak, yang miring. Lapisan berikutnya menggabungkan tepi jadi <b>bentuk</b> seperti sudut, lengkungan, dan lingkaran. Lapisan yang lebih dalam menggabungkan bentuk jadi <b>objek</b>, dua telinga lancip ditambah kumis ditambah mata bulat, keluarlah "kucing".',
		'Nggak ada yang memberi tahu lapisan itu harus mencari apa. Saat pelatihan (dengan langkah turun bukit [[gradient descent|ai/learning-loop]] yang sama) jaringannya sendiri yang menemukan tepi dan bentuk mana yang layak diperhatikan.',
		'[fyi] HP yang terbuka pakai wajahmu, Google Lens yang membaca menu, mobil tanpa sopir yang melihat pejalan kaki, sampai alat dokter yang memeriksa rontgen, semuanya menumpuk lapisan persis begini, cuma pikselnya jutaan.',
		'[ingat] Pada contoh jaringan ini, lapisan awal mendeteksi pola sederhana. Lapisan berikutnya menggabungkannya menjadi fitur yang lebih kompleks.',
		'Gambar pada kisi 100 piksel, lalu lihat pola yang ditandai tiap lapisan simulasi. Coba ubah gambar untuk membandingkan hasilnya.'
	],
	reactions: {
		draw: 'Lihat lapisan pertama. Tiap piksel yang kamu isi dicek dengan tetangganya, bersebelahan berarti tepi datar, bertumpuk berarti tepi tegak, dan serong berarti miring.',
		loop: 'Lingkaran tertutup! Lapisan kedua sadar garismu saling menyambung dan mengurung ruang kosong. Itu petunjuk besar untuk benda seperti kotak, cincin, mata, dan roda.',
		line: 'Dia melihat garis. Cuma satu jenis tepi, tanpa sudut, tanpa lingkaran tertutup, jadi lapisan terakhir cukup yakin.',
		cross:
			'Tanda silang! Dua goresan yang bertemu di tengah membentuk persilangan, dan satu bagian bentuk itu yang menentukan jawabannya.',
		box: 'Kotak. Tepi lurus, kira kira empat sudut, dan lingkaran tertutup. Perhatikan tebakannya berubah cuma karena bagian di bawahnya berubah.',
		ring: 'Cincin. Lingkaran tertutup dengan banyak bagian miring atau anak tangga kecil terbaca bulat, bukan kotak.',
		clear:
			'Bersih lagi. Semua lapisan padam, karena nggak ada lagi yang bisa ditemukan oleh tepinya.',
		done: 'Tiga benda berbeda dikenali! Tepi, lalu bentuk, lalu objek. Model sungguhan melakukan hal yang sama dengan foto kucing, cuma lapisannya mempelajari sendiri tepi dan bentuknya dari jutaan contoh.'
	},
	canvasLabel: 'Kisi gambar, ketuk atau geser untuk mewarnai piksel',
	drawHint: 'Ketuk atau geser di kisi untuk menggambar',
	clear: 'Hapus',
	goal: '{n} dari 3 benda terlihat',
	layer1: 'Lapisan 1, tepi',
	layer2: 'Lapisan 2, bentuk',
	layer3: 'Lapisan 3, objek',
	edges: ['datar', 'tegak', 'miring', 'miring'],
	parts: ['lurus', 'miring', 'sudut', 'silang', 'tertutup'],
	objects: ['garis', 'silang', 'kotak', 'cincin'],
	unsure: 'belum yakin',
	guess: 'Kayaknya ini {x}'
};
