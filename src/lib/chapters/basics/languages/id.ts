import type { LanguagesText } from './types';

export const id: LanguagesText = {
	title: 'Bahasa pemrograman',
	intro: [
		'Kemarin Nim nulis langkah pakai kata biasa. Masalahnya, chip di dalam komputer (CPU) sama sekali nggak bisa baca kata. Dia cuma menjalankan deretan panjang <b>0 dan 1</b>, yang disebut <b>machine code</b> (kode mesin).',
		'Dulu orang memang pernah nulis program langsung pakai 0 dan 1. Lambat, bikin pusing, dan salah satu digit aja semuanya rusak. Jadi orang menciptakan cara yang lebih ramah buat menulis perintah.',
		'Itulah <b>bahasa pemrograman</b>. Bentuknya agak mirip bahasa Inggris dan matematika, jadi manusia bisa baca dan nulis. Nanti ada penerjemah yang mengubahnya jadi 0 dan 1 yang beneran dijalankan mesin.',
		'Ada ratusan bahasa, dan tiap bahasa punya untung ruginya. Ada yang gampang dibaca tapi jalannya sedikit lebih lambat. Ada yang ngebut banget tapi minta kamu menjelaskan tiap detail kecil.',
		'[fyi] Kata yang sama, dunia yang beda. Bahasa sehari hari punya tata bahasa dan bahasa gaul, bahasa pemrograman juga punya aturan, cuma jauh lebih ketat. Lupa satu kurung aja, penerjemahnya langsung nolak ngerti, sejelas apa pun maksudnya.',
		'Jadi orang memilih bahasa yang cocok sama pekerjaannya, kayak milih alat dari kotak perkakas. Palu nggak lebih bagus dari obeng, dia cuma pas buat paku.',
		'[ingat] Bahasa pemrograman dipilih sesuai kebutuhan dan ekosistemnya. Satu bahasa bisa digunakan untuk lebih dari satu jenis aplikasi.',
		'Ini satu tugas kecil yang sama, ditulis dalam tiga bahasa. Pencet satu per satu dan bandingkan, terus coba jodohkan bahasa dengan pekerjaan yang bikin mereka terkenal.'
	],
	reactions: {
		machine:
			'Inilah yang sebenarnya dijalankan CPU. Tiap baris itu satu byte, delapan angka 0 dan 1. Dan ini baru menjumlahkan 2 dan 3, buat menampilkan hasilnya di layar butuh ratusan baris lagi. Nggak ada yang mau nulis ini pakai tangan.',
		c: 'C jauh lebih ramah, tapi masih agak rewel. Kamu harus sebut library yang dipakai, membungkus kodenya di fungsi main, dan mengakhiri baris pakai titik koma. Imbalannya, dia jalan dekat banget sama mesin, jadi cepat.',
		python:
			'Cuma satu baris! Python menyembunyikan bagian yang rewel supaya kamu fokus ke idenya. Kemudahan itu dibayar sedikit kecepatan, tapi buat kebanyakan pekerjaan nggak kerasa. Tapi ingat, belum ada yang jadi 0 dan 1, masih perlu [[compiler atau interpreter|basics/compiler]] buat menerjemahkannya.',
		data: 'Betul, Python. Ilmuwan dan orang data suka banget karena bacanya hampir kayak catatan, dan dia punya banyak sekali alat siap pakai buat angka dan grafik.',
		web: 'Benar, JavaScript. Cuma bahasa ini yang dimengerti semua browser, jadi apa pun yang bereaksi waktu kamu pencet di halaman web, kayak di nimbus.com, hampir pasti JavaScript.',
		fast: 'Tepat, C. Kalau tiap milidetik itu penting, kayak mesin game atau [[sistem operasi|basics/os]] itu sendiri, orang pakai C (atau sepupunya, C++) karena jalannya dekat banget sama hardware.',
		wrong:
			'Sebenarnya bisa juga sih, tapi bukan pilihan yang biasa. Coba pikir kodenya jalan di mana dan apa yang paling penting di situ.'
	},
	taskLabel: 'Tugas yang sama, jumlahkan 2 dan 3 lalu tampilkan hasilnya',
	pickHint: 'Pencet sebuah bahasa buat lihat versinya',
	langs: {
		machine: { name: 'Machine code', sub: 'yang dijalankan CPU', note: 'Baru bagian menjumlahkan' },
		c: { name: 'C', sub: 'dekat dengan mesin', note: 'Cepat, agak rewel' },
		python: { name: 'Python', sub: 'dekat dengan manusia', note: 'Gampang, sedikit lebih lambat' }
	},
	humanMeter: 'Gampang buat manusia',
	machineMeter: 'Dekat dengan mesin',
	linesLabel: '{n} baris',
	toJobs: 'Jodohkan bahasa dengan pekerjaan',
	jobsLabel: 'Pekerjaan {n} dari {total}, biasanya orang pilih bahasa apa?',
	jobLangs: { python: 'Python', js: 'JavaScript', c: 'C' },
	jobs: [
		{
			id: 'data',
			text: 'Mengolah spreadsheet besar berisi pengunjung nimbus.com lalu bikin grafiknya',
			answer: 'python'
		},
		{ id: 'web', text: 'Bikin tombol di nimbus.com bereaksi waktu dipencet', answer: 'js' },
		{ id: 'fast', text: 'Bikin mesin game yang harus menggambar 60 frame tiap detik', answer: 'c' }
	],
	wrongTag: 'bukan pilihan biasa',
	rightTag: 'cocok',
	allDone: 'Tiga dari tiga, tiap bahasa punya tugasnya',
	backToCode: 'Balik ke kode'
};
