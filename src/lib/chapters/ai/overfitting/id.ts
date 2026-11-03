import type { OverfittingText } from './types';

export const id: OverfittingText = {
	title: 'Overfitting',
	intro: [
		'Bayangkan murid yang menghafal semua jawaban di buku latihan, kata per kata. Ujian latihan, nilainya sempurna. Lalu ujian beneran menanyakan konsep yang sama dengan angka yang beda, dan dia langsung bingung.',
		'Model juga bisa begitu. Kalau model mempelajari contohnya terlalu persis, sampai keanehan kecil yang kebetulan pun ikut dihafal, namanya <b>overfitting</b>. Dia kelihatan jenius di contoh yang dia pelajari, tapi tersandung di hal baru.',
		'Kebalikannya juga bisa terjadi. Model yang terlalu sederhana melewatkan pola aslinya, bahkan di contohnya sendiri. Itu namanya <b>underfitting</b>. Tujuannya ada di tengah, model yang menangkap pola dan mengabaikan gangguan kecilnya.',
		'Makanya orang selalu menyembunyikan sebagian contoh sebelum training, namanya <b>test set</b>. Model nggak pernah mempelajarinya, jadi dia berfungsi seperti ujian beneran. Contoh yang dipelajari disebut <b>training set</b>.',
		'[fyi] Chatbot besar juga bisa kena. Kalau soal kuis terkenal bocor ke data trainingnya, dia bisa membacakan jawabannya tanpa benar benar paham, makanya peneliti merahasiakan soal ujian terbaik mereka.',
		'Ini harga rumah dari [[pelajaran sebelumnya|ai/predict]], bedanya garisku sekarang bisa melengkung. Geser dari kaku ke meliuk dan perhatikan nilai latihannya, lalu datangkan rumah yang belum pernah dia lihat.'
	],
	reactions: {
		practice:
			'Nilai latihan sempurna! Kurvanya sekarang lewat persis di setiap rumah. Kedengarannya hebat, tapi dia belajar harga atau cuma menghafal sembilan rumah ini? Datangkan rumah barunya dan buktikan.',
		reveal:
			'Rumah rumah ini disembunyikan selama training. Garis merah menunjukkan seberapa jauh kurvanya meleset untuk tiap rumah. Nilai rumah baru inilah yang benar benar penting.',
		under:
			'Terlalu kaku. Garis lurus nggak bisa mengikuti harga yang mulai mendatar di rumah besar, jadi dia meleset di rumah latihan dan rumah baru sekaligus. Itu underfitting.',
		fit: 'Pas! Lengkungan yang landai mengikuti tren aslinya dan cuek sama gangguan kecil, jadi dia paling jago menebak rumah yang belum pernah dia lihat.',
		over: 'Nilai latihan naik, nilai rumah baru anjlok. Kurvanya memelintir diri lewat setiap rumah latihan, keanehannya pun ikut, lalu berayun liar di celah celahnya. Itu overfitting.',
		done: 'Kamu sudah menemukan dua ujungnya! Lebih lentur belum tentu lebih bagus. Tim sungguhan memilih model dari nilai test, bukan nilai latihan, dan menambah data kalau bisa, karena itu bikin liukannya lebih tenang.'
	},
	xAxis: 'Luas (m²)',
	yAxis: 'Harga',
	bend: 'Seberapa lentur kurvanya',
	stiff: 'kaku',
	wiggly: 'meliuk',
	verdicts: {
		under: 'Terlalu sederhana',
		fit: 'Pas',
		mid: 'Mulai berbelit',
		over: 'Menghafal'
	},
	trainScore: 'Rumah latihan',
	testScore: 'Rumah baru',
	hidden: 'disembunyikan',
	revealBtn: 'Datangkan rumah baru',
	legendTrain: 'dipelajari',
	legendTest: 'belum pernah dilihat',
	chartLabel: 'Harga rumah dengan kurva yang dipasang'
};
