import type { DataText } from './types';

export const id: DataText = {
	title: 'Data dan dataset',
	intro: [
		'Semua AI yang pernah kamu temui belajar dari setumpuk contoh. Filter spam mempelajari email lama, buka kunci wajah mempelajari foto wajah. Contoh contoh itu namanya <b>data</b>.',
		'Kalau contohnya dikumpulkan di satu tempat dan siap dipakai belajar, kumpulan itu disebut <b>dataset</b>. Bayangkan folder berisi ribuan foto, dan tiap foto punya catatan kecil soal isinya. Catatan itu namanya <b>label</b>.',
		'Nah, masalahnya begini. <b>Model</b> (program yang belajar) percaya penuh pada setiap contoh. Kalau ada yang melabeli anjing sebagai kucing, model dengan senang hati belajar bahwa wajah anjing itu wajah kucing. Orang menyebutnya <b>garbage in, garbage out</b> (sampah masuk, sampah keluar).',
		'[fyi] Dataset itu beda dengan [[database|resilience/database]]. Database menyimpan data hidup yang dipakai aplikasi setiap hari, sedangkan dataset adalah kumpulan beku yang disusun khusus buat belajar (lucunya, sering diambil dari database juga).',
		'Dataset di dunia nyata itu berantakan. Ada label yang salah karena orangnya capek dan asal klik, ada foto yang buram, ada yang muncul dua kali. Membersihkan data itu bagian besar dari kerjaan AI, sering lebih besar dari membuat modelnya.',
		'[ingat] Data yang salah atau tidak mewakili penggunaan dapat menghasilkan prediksi yang buruk. Periksa kualitas dan cakupan dataset sebelum training.',
		'Aku bikin pendeteksi kucing kecil. Untuk tiap foto baru, dia cari foto latihan yang paling mirip, lalu menyalin labelnya. Latih dulu dengan data yang berantakan ini, lalu bersihkan datanya dan latih lagi.'
	],
	reactions: {
		messy:
			'Aduh, ada foto baru yang ditebak salah, padahal modelnya cuma melakukan persis yang diajarkan. Ketuk tebakan yang salah buat lihat foto latihan mana yang dia salin.',
		look: 'Lihat foto yang menyala? Itu contoh yang menurutnya paling mirip, dan dia tinggal menyalin labelnya. Kalau contohnya salah label, tebakannya ikut salah.',
		fix: 'Jeli juga, label itu memang salah. Satu label yang salah diam diam merusak setiap tebakan yang bergantung padanya.',
		oops: 'Hmm, label itu tadinya sudah benar, sekarang malah jadi salah. Tukar balik ya, model percaya pada setiap label yang kamu kasih.',
		toss: 'Keputusan bagus. Foto buram nggak jelas isinya, jadi cuma mengajarkan kebingungan. Buang saja.',
		toss_good:
			'Foto itu sebenarnya bagus. Membuang contoh yang bagus bikin model punya lebih sedikit bahan belajar. Tombol Reset mengembalikan semuanya.',
		still:
			'Sudah lebih baik, tapi belum sempurna. Ketuk tebakan yang salah buat cari contoh jelek yang bersembunyi di baliknya.',
		clean:
			'Enam dari enam! Modelnya sama, kodenya sama, cuma datanya yang jadi bersih. Makanya model itu cuma sebagus contoh contohnya. Berikutnya, yuk lihat cara mesin [[belajar dari contoh|ai/training]].'
	},
	catLabel: 'kucing',
	notLabel: 'bukan kucing',
	setTitle: 'Foto latihan ({n})',
	testTitle: 'Data uji yang belum dipakai melatih',
	trainBtn: 'Latih dan uji',
	retrainBtn: 'Latih lagi',
	reset: 'Reset',
	score: '{n} dari 6 benar',
	pickHint: 'Ketuk foto latihan buat cek atau perbaiki',
	chosen: 'Foto {n} berlabel {label}',
	blurChosen: 'Foto buram berlabel {label}',
	swapBtn: 'Tukar label',
	removeBtn: 'Buang',
	photo: 'Foto latihan {n}',
	newPhoto: 'Foto baru {n}',
	lookHint: 'Ketuk foto baru buat lihat contoh mana yang dia salin',
	copied: 'Dia menyalin foto {n}',
	stale: 'Datanya berubah, latih lagi buat lihat hasilnya',
	guessed: 'tebakan'
};
