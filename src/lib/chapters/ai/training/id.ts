import type { TrainingText } from './types';

export const id: TrainingText = {
	title: 'Apa itu machine learning',
	intro: [
		'Misalnya kamu mau komputer bisa membedakan apel dan jeruk pakai kode biasa. Kamu bakal menulis aturan dengan tangan, misalnya "merah dan kecil berarti apel". Lalu datang apel yang agak oranye, dan aturanmu langsung berantakan.',
		'<b>Machine learning</b> membalik cara itu. Bukannya menulis aturan, kamu tunjukkan banyak contoh yang sudah ada jawaban benarnya (namanya <b>label</b>), lalu mesinnya menemukan polanya sendiri.',
		'Proses menemukan pola itu disebut <b>training</b> (pelatihan), dan pola yang dia dapat disebut <b>model</b>. Setelah itu kamu bisa kasih buah yang belum pernah dia lihat, dan dia menebak. Tebakan itu namanya <b>prediksi</b>.',
		'[fyi] Folder spam di emailmu, video yang disarankan YouTube, dan kamera yang bikin latar belakang blur, semuanya bekerja begini. Nggak ada yang mengetik aturannya, semuanya lahir dari contoh.',
		'Modelku mungil, dia cuma melihat dua hal dari buah, warna dan ukurannya. Masukkan enam buah pertama ke keranjang yang benar, latih modelnya, lalu biarkan dia menyortir sisanya sendiri.'
	],
	reactions: {
		label:
			'Itu namanya label. Kamu baru saja memberi tahu mesin jawaban benar untuk satu contoh. Dataset sungguhan dilabeli seperti ini ribuan kali, sering oleh orang yang klik seharian.',
		ready:
			'Enam contoh, semua sudah berlabel. Sekarang tekan tombol latih dan biarkan dia mencari polanya.',
		trained:
			'Beres! Dia meringkas enam contohmu jadi apel rata rata dan jeruk rata rata. Ringkasan kecil itulah modelnya. Sekarang kirim buah yang belum pernah dia lihat.',
		right:
			'Tepat, dan nggak ada yang menulis aturan untuknya. Dia cuma mengecek buah baru itu lebih dekat ke rata rata yang mana, dari warna dan ukurannya.',
		wrong:
			'Wah, tebakannya salah. Coba lihat keranjangnya, buah bertitik merah diajarkan dengan label yang salah, dan model dengan setia mempelajari kekeliruanmu. Mulai lagi dan ajari ulang ya.',
		done: 'Kelima buah disortir sendiri! Itulah machine learning, contoh masuk, pola keluar, lalu menebak hal baru. Model besar cuma pakai jauh lebih banyak contoh dan petunjuk, misalnya [[neural network|ai/neural-net]].'
	},
	apple: 'apel',
	orange: 'jeruk',
	basket: 'Masukkan ke keranjang {label}',
	labelHint: 'Keranjang mana? {n} dari 6 berlabel',
	readyHint: 'Keenamnya berlabel, siap belajar',
	trainBtn: 'Latih modelnya',
	training: 'Sedang mempelajari contoh',
	nextBtn: 'Kirim buah baru',
	guess: 'Kayaknya {label} ({n}% yakin)',
	sorted: '{n} dari 5 buah baru disortir',
	doneNote: 'Semua buah baru disortir oleh model',
	learnedTitle: 'Yang dia pelajari',
	notYet: 'Belum ada, dia butuh contoh dulu',
	avg: '{label} rata rata',
	sees: 'Dia cuma melihat warna dan ukuran',
	byYou: 'dilabeli kamu',
	byModel: 'disortir model',
	reset: 'Mulai lagi'
};
