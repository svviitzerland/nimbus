import type { OverfittingText } from './types';

export const id: OverfittingText = {
	title: 'Overfitting',
	intro: [
		'Ingat harga rumah di [[pelajaran sebelumnya|ai/predict]]? Model belajar dari contoh, mirip murid yang belajar dari soal latihan. Sembilan rumah ini soal latihannya, masing masing punya luas dan harga.',
		'Awalnya model cuma boleh menggambar garis lurus. Garisnya terlalu kaku buat mengikuti harga rumah besar yang mulai mendatar, jadi soal latihannya sendiri pun meleset. Itu namanya <b>underfitting</b>, modelnya terlalu sederhana.',
		'Sekarang kasih dia sedikit kebebasan buat melengkung. Kurvanya mengikuti tren aslinya (harga naik, lalu mendatar) dan cuek sama benjolan kecil yang kebetulan. Ini titik pasnya.',
		'Tapi gimana kalau kebebasannya ditambah terus? Lihat. Kurvanya memelintir diri lewat setiap rumah, dan nilai latihannya naik sampai 100.',
		'Saatnya ujian beneran. Rumah hijau ini disembunyikan dari awal, model nggak pernah mempelajarinya. Di celah antar rumah latihan kurvanya berayun liar, jadi tebakannya buat rumah baru meleset jauh. Itulah <b>overfitting</b>.',
		'[ingat] Overfitting itu kayak menghafal kunci jawaban soal latihan. Hafal soalnya, bukan paham caranya. Begitu soalnya diganti, langsung bingung. Makanya model selalu dinilai dari ujian beneran, bukan dari soal latihan.',
		'[fyi] Chatbot besar juga bisa kena. Kalau soal kuis terkenal bocor ke data trainingnya, dia bisa membacakan jawabannya tanpa benar benar paham, makanya peneliti merahasiakan soal ujian terbaik mereka.',
		'Mau coba rasakan sendiri? Geser kurvanya dari kaku ke meliuk dan perhatikan kedua nilainya. Ini opsional kok, rumahnya sabar menunggu.'
	],
	reactions: {
		under:
			'Kaku lagi. Garis lurus meleset di rumah latihan dan rumah baru sekaligus. Itu underfitting.',
		fit: 'Pas! Lengkungan yang landai mengikuti trennya dan cuek sama gangguan kecil, jadi dia paling jago menebak rumah yang belum pernah dia lihat.',
		over: 'Nilai latihan naik, nilai ujian beneran anjlok. Kurvanya menghafal setiap rumah latihan, keanehannya pun ikut. Itu overfitting.'
	},
	panels: [
		{
			tag: 'Training set',
			title: 'Soal latihannya',
			body: 'Tiap rumah kecil adalah satu contoh yang dipelajari model, luasnya ke samping dan harganya ke atas. Kumpulan contoh ini disebut <b>training set</b>.'
		},
		{
			tag: 'Terlalu sederhana',
			title: 'Garis lurus',
			body: 'Garis nggak bisa melengkung, jadi dia lewat di tengah dan meleset di kedua ujungnya. Model sesederhana ini sedang <b>underfitting</b>.'
		},
		{
			tag: 'Pas',
			title: 'Lengkungan yang landai',
			body: 'Kurvanya mengikuti bentuk besarnya dan mengabaikan benjolan kecil. Benjolan itu namanya <b>noise</b> (gangguan), goyangan acak yang selalu ada di data sungguhan.'
		},
		{
			tag: 'Terlalu bebas',
			title: 'Kena semua titik',
			body: 'Dengan cukup banyak lengkungan, kurvanya bisa lewat di setiap rumah latihan. Nilai latihannya 100, kelihatan sempurna, tapi lihat celah di antara rumahnya.'
		},
		{
			tag: 'Test set',
			title: 'Ujian beneran',
			body: 'Rumah hijau disisihkan dari awal, namanya <b>test set</b>. Garis merah menunjukkan seberapa jauh tiap tebakan meleset. Nilai inilah yang dihitung.'
		},
		{
			tag: 'Biar nempel',
			title: 'Menghafal kunci jawaban',
			body: 'Jago di soal yang sudah dilihat, payah di soal baru. Tim sungguhan memilih model dari nilai ujian beneran, dan data yang lebih banyak biasanya bikin liukannya lebih tenang.'
		},
		{
			tag: 'Coba',
			title: 'Lenturkan sendiri',
			body: 'Geser dari kaku ke meliuk. Nilai latihan cuma bisa naik, sedangkan nilai ujian beneran naik dulu lalu turun.'
		}
	],
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
	trainScore: 'Soal latihan',
	testScore: 'Ujian beneran',
	hidden: 'belum ada',
	legendTrain: 'dipelajari',
	legendTest: 'belum pernah dilihat',
	rule: 'Nilai dari ujian beneran, bukan dari soal latihan',
	chartLabel: 'Harga rumah dengan kurva yang dipasang'
};
