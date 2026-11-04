import type { TrainingText } from './types';

export const id: TrainingText = {
	title: 'Apa itu machine learning',
	intro: [
		'Misalnya kamu mau komputer bisa membedakan apel dan jeruk pakai kode biasa. Kamu bakal menulis aturannya sendiri, misalnya "merah dan kecil berarti apel". Lalu datang apel yang agak oranye, dan aturanmu malah menyebutnya jeruk. Waduh.',
		'<b>Machine learning</b> membalik cara itu. Bukannya menulis aturan, kamu tunjukkan contoh yang sudah ada jawaban benarnya (namanya <b>label</b>). Ini dia enam buah, masing masing sudah dimasukkan ke keranjang yang benar oleh orang.',
		'[ingat] Dikasih tahu versus dikasih lihat. Kode biasa <b>dikasih tahu</b> aturannya. Machine learning <b>dikasih lihat</b> contoh, lalu menyimpulkan aturannya sendiri, kayak anak kecil yang tahu apa itu anjing karena sering ketemu anjing, bukan karena baca definisinya.',
		'Sekarang bagian belajarnya, namanya <b>training</b> (pelatihan). Mesin menaruh setiap contoh sesuai warna dan ukurannya, lalu mencari garis batas yang memisahkan apel di satu sisi dan jeruk di sisi lain. Garis itu pola yang dia temukan, dan hasil akhirnya disebut <b>model</b>.',
		'Lalu datang buah yang belum pernah dia lihat. Model mengecek buah itu jatuh di sisi mana dari garis batas, lalu menebak. Tebakan itu namanya <b>prediksi</b>. Nggak ada yang menulis aturan, tapi dia bisa menyortir buah baru sendiri.',
		'[fyi] Folder spam di emailmu, video yang disarankan YouTube, dan kamera yang bikin latar belakang blur, semuanya bekerja begini. Nggak ada yang mengetik aturannya, semuanya lahir dari contoh. Model besar cuma pakai jauh lebih banyak contoh dan petunjuk, kayak [[neural network|ai/neural-net]].',
		'Ingat apel agak oranye yang bikin aturan buatan tangan kita gagal? Kalau mau, kirim dia ke model dan lihat apa yang terjadi.'
	],
	reactions: {
		tricky:
			'Apel! Warnanya memang agak oranye, tapi ukurannya kecil, dan di contoh tadi buah yang kecil itu apel. Model menimbang dua petunjuk sekaligus, hal yang nggak pernah dilakukan aturan tunggal buatan tangan kita.'
	},
	panels: [
		{
			tag: 'Kode biasa',
			title: 'Aturan buatan tangan',
			body: 'Orang menebak aturannya lalu mengetiknya. Aman, sampai dunia kasih sesuatu yang nggak diduga aturannya.'
		},
		{
			tag: 'Contoh',
			title: 'Buah beserta label',
			body: 'Tiap contoh datang dengan jawaban benarnya, yaitu <b>label</b>. Di sini labelnya cukup keranjang tempat buah itu berada.'
		},
		{
			tag: 'Cara ingat',
			title: 'Dikasih tahu atau dikasih lihat',
			body: 'Kode biasa dikasih tahu aturannya. Machine learning dikasih lihat contoh dan menemukan aturannya sendiri.'
		},
		{
			tag: 'Training',
			title: 'Mencari pola',
			body: 'Tiap buah ditaruh berdasarkan dua petunjuk, warna dan ukuran. Mesin menggambar garis batas yang paling rapi memisahkan dua kelompok itu. Garis itulah <b>model</b>nya.'
		},
		{
			tag: 'Prediksi',
			title: 'Menyortir hal baru',
			body: 'Buah baru ditaruh dengan dua petunjuk yang sama. Dia jatuh di sisi garis yang mana, itulah tebakannya.'
		},
		{
			tag: 'Di dunia nyata',
			title: 'Ada di sekitarmu',
			body: 'Filter spam, saran video, dan aplikasi foto semuanya belajar dari contoh, cuma jumlahnya jutaan dan petunjuknya jauh lebih banyak.'
		},
		{
			tag: 'Coba',
			title: 'Apel yang menipu',
			body: 'Kirim buah yang tadi menipu aturan buatan tangan, lalu lihat model menaruhnya di mana.'
		}
	],
	apple: 'apel',
	orange: 'jeruk',
	ruleTitle: 'Aturan buatan tangan',
	ruleLines: ['Merah dan kecil berarti apel.', 'Selain itu berarti jeruk.'],
	ruleWrong: 'Aturannya menyebut apel ini jeruk',
	axisColour: 'warna',
	axisSize: 'ukuran',
	guess: 'Kata model, ini {label}',
	incoming: 'Buah yang belum pernah dia lihat',
	rule: 'Dikasih tahu aturan, kode biasa. Dikasih lihat contoh, machine learning.',
	trickyBtn: 'Kirim apel yang menipu'
};
