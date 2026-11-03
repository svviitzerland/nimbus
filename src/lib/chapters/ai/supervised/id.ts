import type { SupervisedText } from './types';

export const id: SupervisedText = {
	title: 'Supervised dan unsupervised',
	intro: [
		'Sejauh ini setiap contoh selalu datang dengan jawabannya, foto ini kucing, rumah itu harganya segini. Belajar dari contoh berlabel seperti itu disebut <b>supervised learning</b> (belajar dengan pengawasan), seolah ada guru di samping mesin yang memegang kunci jawaban.',
		'Tapi label itu mahal. Harus ada orang yang menandai satu per satu dengan tangan, padahal jumlahnya bisa jutaan. Sering banget kita punya segunung data tanpa jawaban sama sekali.',
		'Di situlah <b>unsupervised learning</b> (belajar tanpa pengawasan) berperan. Tanpa label, mesin mencari hal hal yang letaknya berdekatan lalu mengelompokkannya sendiri (namanya <b>clustering</b>). Dia nggak bisa memberi nama kelompoknya, dia cuma tahu mereka cocok jadi satu.',
		'Aplikasi musik memakai keduanya. Lagu yang sudah ditandai orang (chill, dance, rock) mengajari model supervised buat menandai lagu baru (itu [[klasifikasi|ai/predict]] lagi). Clustering menemukan pendengar yang seleranya mirip, tanpa ada yang memberi tahu siapa mirip dengan siapa.',
		'[fyi] Ada gaya ketiga namanya <b>reinforcement learning</b>. Nggak ada label, nggak ada kelompok, cuma hadiah kalau dia berhasil, mirip melatih anjing pakai camilan. Begitulah komputer belajar mengalahkan juara dunia permainan papan Go.',
		'Ini setumpuk lagu, diletakkan berdasarkan tempo dan energinya. Dengan label menyala, taruh lagu baru dan lihat dia ditandai apa. Lalu matikan labelnya dan biarkan mesin menemukan kelompoknya sendiri.'
	],
	reactions: {
		sup_guess:
			'Sudah ditandai! Lagu baru itu melihat tiga tetangga terdekatnya lalu ikut tanda yang paling banyak. Dia cuma kenal nama genre itu karena orang sudah melabeli contohnya duluan.',
		unsup_mode:
			'Lagunya sama, tapi labelnya hilang, sekarang mesin cuma melihat titik. Pilih mau cari berapa kelompok, lalu tekan tombolnya.',
		unsup_go:
			'Perhatikan cincinnya. Tiap cincin mengambil lagu yang paling dekat dengannya, lalu bergeser ke tengah kelompoknya. Diulang terus sampai nggak ada yang berubah lagi.',
		found3:
			'Tiga kelompok, dan cocok dengan lagu chill, dance, dan rock, padahal nggak ada yang memberi tahu kata kata itu. Dia cuma menyebutnya kelompok 1, 2, dan 3, jadi tetap perlu orang buat memberi nama.',
		foundk:
			'Dia menemukan kelompok sebanyak yang kamu minta, tapi nggak sejalan dengan cara orang menandai musik. Unsupervised learning selalu menemukan suatu pengelompokan, dan kitalah yang menilai masuk akal atau nggak. Coba tiga.'
	},
	modeSup: 'Dengan label',
	modeUnsup: 'Tanpa label',
	genres: ['chill', 'dance', 'rock'],
	xAxis: 'Tempo, pelan ke cepat',
	yAxis: 'Energi, tenang ke keras',
	supHint: 'Ketuk grafiknya buat menaruh lagu baru',
	supAnswer: 'Tiga lagu terdekatnya bilang {label}',
	newSong: 'Lagu baru',
	unsupHint: 'Nggak ada yang menandai lagu lagu ini',
	groups: 'Kelompok',
	findBtn: 'Cari kelompok',
	round: 'Mencari, putaran {n}',
	found: 'Ketemu {k} kelompok setelah {n} putaran',
	groupName: 'Kelompok {n}',
	reset: 'Reset'
};
