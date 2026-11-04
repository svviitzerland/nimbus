import type { LanguagesText } from './types';

export const id: LanguagesText = {
	title: 'Bahasa pemrograman',
	intro: [
		'Ada rahasia kecil soal semua komputer. Chip yang benar benar bekerja, namanya <b>CPU</b> (otaknya komputer), sama sekali nggak bisa baca kata. Dia cuma ngerti <b>0 dan 1</b>.',
		'Perintah yang ditulis cuma pakai 0 dan 1 disebut <b>machine code</b> (kode mesin). Dulu orang beneran nulis program kayak gini, pakai tangan. Lambat, bikin pusing, dan salah satu digit aja semuanya rusak.',
		'Makanya orang menciptakan cara yang lebih ramah buat menulis perintah, yaitu <b>bahasa pemrograman</b>. Kamu nulis pakai kata dan simbol, lalu penerjemah (misalnya [[compiler|basics/compiler]]) mengubahnya jadi 0 dan 1 buat CPU.',
		'Kenalan sama <b>C</b>, salah satu bahasa klasik, lahir tahun 1970an. Tugasnya sama seperti kode mesin tadi, jumlahkan 2 dan 3 lalu tampilkan hasilnya. Masih agak rewel soal kurung dan titik koma, tapi jalannya dekat banget sama mesin, jadi cepat.',
		'Dan ini <b>Python</b>. Tugas yang persis sama, cukup satu baris. Bacanya hampir kayak bahasa Inggris biasa, makanya banyak orang belajar Python duluan.',
		'Perhatikan untung ruginya. Makin ke atas, makin gampang ditulis manusia. Makin ke bawah, makin dekat ke mesin, lebih cepat tapi lebih rewel. Nggak ada bahasa yang jago di semua hal.',
		'Jadi orang memilih bahasa kayak milih alat dari kotak perkakas. Palu nggak lebih bagus dari obeng, dia cuma pas buat paku.',
		'[fyi] Kata yang sama, dunia yang beda. Bahasa sehari hari punya tata bahasa dan bahasa gaul, bahasa pemrograman juga punya aturan, cuma jauh lebih ketat. Lupa satu kurung aja, penerjemahnya langsung nolak ngerti, sejelas apa pun maksudnya.',
		'[ingat] Tanya dulu, kodenya bakal jalan di mana? JavaScript buat web, Python buat data dan AI, C buat yang ngebut, Kotlin dan Swift buat aplikasi HP.',
		'Gitu deh intinya. Kalau mau, pencet salah satu versi kodenya dan lihat dia nulis dirinya sendiri lagi.'
	],
	reactions: {
		machine:
			'Sembilan byte 0 dan 1, dan ini baru bagian menjumlahkan. Buat menampilkan hasilnya di layar butuh ratusan baris lagi. Untung sekarang nggak ada yang perlu nulis ini pakai tangan.',
		c: 'C minta kamu menjelaskan banyak hal, library (kode siap pakai) mana yang dipakai, program mulai dari mana, titik koma di tiap baris. Imbalannya, dia jalan cepat.',
		python:
			'Satu baris, dan bagian yang rewel diurus Python. Di balik layar, tetap ada penerjemah yang mengubahnya jadi langkah yang bisa dijalankan CPU.'
	},
	panels: [
		{
			tag: 'Machine code',
			title: 'Satu satunya yang dimengerti CPU',
			body: 'CPU membaca 0 dan 1 per delapan angka (tiap kelompok disebut <b>byte</b>). Sembilan byte ini cuma menaruh 2 di sebuah kotak, menambahkan 3, lalu berhenti.'
		},
		{
			tag: 'C',
			title: 'Dekat dengan mesin',
			body: 'Kata dan simbol, bukan lagi deretan bit. Compiler mengubahnya jadi machine code sebelum dijalankan.'
		},
		{
			tag: 'Python',
			title: 'Dekat dengan manusia',
			body: 'Tugas yang sama dalam satu baris. Python menyembunyikan detail yang rewel, bayarannya sedikit kecepatan.'
		},
		{
			tag: 'Untung rugi',
			title: 'Gampang atau cepat',
			body: 'Bahasa yang di atas lebih gampang dibaca dan ditulis. Yang di bawah bikin mesin nggak perlu mikir banyak, jadi jalannya lebih cepat.'
		},
		{
			tag: 'Kotak perkakas',
			title: 'Tiap bahasa punya keahlian',
			body: 'Kebanyakan bahasa bisa dipakai buat hampir apa aja, tapi tiap bahasa punya tugas yang bikin dia terkenal.'
		},
		{
			tag: 'Biar nempel',
			title: 'Kodenya bakal jalan di mana?',
			body: 'Di browser, JavaScript. Di HP, Kotlin buat Android atau Swift buat iPhone. Data dan AI, Python. Butuh ngebut, C.'
		},
		{
			tag: 'Lihat lagi',
			title: 'Satu tugas, tiga cara',
			body: 'Pencet salah satu versi buat lihat dia nulis dirinya sendiri lagi.'
		}
	],
	taskLabel: 'Tugas yang sama, jumlahkan 2 dan 3 lalu tampilkan hasilnya',
	langs: {
		machine: { name: 'Machine code', sub: 'yang dijalankan CPU' },
		c: { name: 'C', sub: 'dekat dengan mesin' },
		python: { name: 'Python', sub: 'dekat dengan manusia' }
	},
	people: 'Lebih gampang buat manusia',
	machine: 'Lebih dekat ke mesin',
	cpu: 'CPU',
	jobs: {
		data: { lang: 'Python', job: 'Data dan AI' },
		web: { lang: 'JavaScript', job: 'Website' },
		speed: { lang: 'C', job: 'Kecepatan, kayak game dan sistem operasi' },
		phone: { lang: 'Kotlin dan Swift', job: 'Aplikasi HP' }
	},
	rule: 'JavaScript buat web, Python buat data, C buat ngebut, Kotlin dan Swift buat HP.'
};
