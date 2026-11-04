import type { SupervisedText } from './types';

export const id: SupervisedText = {
	title: 'Supervised dan unsupervised',
	intro: [
		'Sejauh ini setiap contoh selalu datang dengan jawabannya, foto ini kucing, rumah itu harganya segini. Belajar seperti itu disebut <b>supervised learning</b> (belajar dengan pengawasan), seolah ada guru di samping mesin yang memegang kunci jawaban. Ini lagu lagu yang sudah ditandai orang sebagai chill, dance, atau rock.',
		'Datang satu lagu baru. Model melihat tiga lagu yang paling dekat dengannya, mengambil tanda yang paling banyak, lalu menandai si pendatang baru. Itu [[klasifikasi|ai/predict]] lagi, dan cuma bisa jalan karena orang sudah menandai contohnya duluan.',
		'Tapi label itu mahal. Harus ada orang yang menandai satu per satu dengan tangan, padahal jumlahnya bisa jutaan. Sering banget kita punya segunung data tanpa jawaban sama sekali. Lihat tandanya menghilang.',
		'Di situlah <b>unsupervised learning</b> (belajar tanpa pengawasan) berperan. Tanpa label, mesin mencari hal hal yang letaknya berdekatan. Tiga penanda dijatuhkan, masing masing merangkul lagu terdekatnya, lalu bergeser ke tengah kelompoknya, terus begitu sampai nggak ada yang bergerak lagi. Ini namanya <b>clustering</b>.',
		'Nah, sekarang ada tiga kelompok yang rapi. Tapi mesinnya nggak tahu harus menamai mereka apa. Dia cuma tahu mereka cocok jadi satu, jadi tetap perlu orang yang melihat lalu bilang, oh, ini pasti lagu lagu chill.',
		'[ingat] Supervised itu ujian yang ada kunci jawabannya, unsupervised nggak ada kuncinya. Ingat aja, super berarti ada supervisor (pengawas) yang pegang kunci. Unsupervised kayak memasangkan kaus kaki dari tumpukan cucian, nggak ada yang kasih tahu caranya, tapi kamu tetap bisa mengelompokkan yang mirip.',
		'[fyi] Ada gaya ketiga namanya <b>reinforcement learning</b>. Nggak ada label, nggak ada kelompok, cuma hadiah kalau dia berhasil, mirip melatih anjing pakai camilan. Hadiah semacam itu membantu komputer mengalahkan salah satu pemain Go terbaik dunia di tahun 2016.',
		'Kalau mau, acak penandanya dan biarkan mesin mengelompokkan lagunya lagi dari awal yang baru. Ini opsional kok.'
	],
	reactions: {
		again:
			'Titik awalnya baru, tapi penandanya tetap berhenti di tiga kelompok yang sama. Lagu lagu itu memang berdekatan, jadi kelompoknya selalu muncul lagi. Aplikasi musik pakai trik yang sama buat menemukan pendengar yang seleranya mirip.'
	},
	panels: [
		{
			tag: 'Supervised',
			title: 'Contoh beserta jawaban',
			body: 'Tiap lagu ditaruh sesuai tempo dan energinya, dan ada orang yang memberinya tanda. Tanda itulah <b>kunci jawaban</b>nya.'
		},
		{
			tag: 'Supervised',
			title: 'Tanya tetangga',
			body: 'Lagu baru mengambil tanda yang paling banyak di antara lagu terdekatnya. Dia cuma bisa pakai nama yang diajarkan orang.'
		},
		{
			tag: 'Masalahnya',
			title: 'Label makan waktu',
			body: 'Menandai dengan tangan itu lambat dan mahal. Sebagian besar data di dunia nggak punya label sama sekali.'
		},
		{
			tag: 'Unsupervised',
			title: 'Clustering',
			body: 'Tanpa kunci jawaban. Penanda merangkul lagu terdekatnya lalu pindah ke tengah, berulang ulang, sampai kelompoknya nggak berubah lagi.'
		},
		{
			tag: 'Unsupervised',
			title: 'Kelompok tanpa nama',
			body: 'Mesin menemukan kelompoknya, tapi cuma menyebutnya kelompok 1, 2, dan 3. Orang yang menentukan artinya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Ada kunci atau nggak',
			body: 'Ada kunci jawaban, supervised. Nggak ada kunci jawaban, unsupervised.'
		},
		{
			tag: 'Omong omong',
			title: 'Gaya ketiga',
			body: '<b>Reinforcement learning</b> belajar dengan mencoba lalu mengumpulkan hadiah, kayak skor game yang terus naik.'
		},
		{
			tag: 'Coba',
			title: 'Mulai dari awal baru',
			body: 'Acak penandanya dan lihat lagunya dikelompokkan lagi.'
		}
	],
	genres: ['chill', 'dance', 'rock'],
	xAxis: 'tempo',
	yAxis: 'energi',
	withKey: 'ada kunci jawaban',
	withoutKey: 'tanpa kunci jawaban',
	tagged: 'Ditandai {label}',
	groupName: 'kelompok {n}',
	rule: 'Ada kunci jawaban, supervised. Tanpa kunci jawaban, unsupervised.',
	againBtn: 'Acak dan kelompokkan lagi'
};
