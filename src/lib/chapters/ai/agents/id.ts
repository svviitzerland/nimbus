import type { AgentsText } from './types';

export const id: AgentsText = {
	title: 'AI agent',
	intro: [
		'Chatbot cuma bisa <b>ngomong</b>. Kamu tanya, dia jawab pakai kata kata, selesai. <b>Agen AI</b> juga bisa <b>mengerjakan</b> sesuatu buat kamu.',
		'Rahasianya adalah <b>alat</b> (tools). Alat itu program kecil yang boleh dipakai model, misalnya kalender. Model nggak pernah menyentuh kalendernya langsung, dia menulis permintaan, lalu program biasa yang mengerjakannya.',
		'Aku minta agenku membuat janji ketemu Raka hari Kamis jam sepuluh. Pertama dia <b>berpikir</b>, dan menulis rencana kecil buat dirinya sendiri.',
		'Lalu dia <b>bertindak</b>. Dia memanggil alat kalender, dan kalendernya menjawab dengan data polos.',
		'Lalu dia <b>memeriksa</b> hasilnya. Jam sepuluh ternyata sudah dipakai rapat tim! Jadi rencananya diubah, jam sebelas masih kosong.',
		'Membuat janji itu mengubah kalendermu yang asli, jadi agen yang baik berhenti dan <b>bertanya dulu</b>. Kamu tetap yang pegang kendali.',
		'Kamu bilang boleh, dia memesan jam sebelas, lalu menceritakan apa yang dia lakukan. Satu kalimat darimu berubah jadi beberapa langkah kecil.',
		'[ingat] Agen itu model yang punya tangan. Ingat 3P, Pikir, Pakai alat, Periksa, lalu ulangi sampai tugasnya beres.',
		'[fyi] Di balik layar, yang berpikir tetap [[model bahasa|ai/llm]] yang sama dengan chatbot. Panggilan alat cuma teks dengan format ketat, yang dibaca dan dijalankan oleh program, sering lewat [[API|foundations/api]].',
		'Giliranmu, kalau mau. Agennya sedang minta izin. Izinkan atau tolak, lalu lihat bagaimana agen yang baik bersikap.'
	],
	reactions: {
		allow:
			'Diizinkan. Janjinya langsung tercatat, dan agennya memberi tahu persis apa yang berubah.',
		deny: 'Ditolak. Agen yang baik menghormati itu, nggak memesan apa pun, dan nggak cari cara diam diam.'
	},
	panels: [
		{
			tag: 'Chatbot',
			title: 'Cuma kata kata',
			body: 'Chatbot bisa menjelaskan <b>cara</b> membuat janji. Tapi dia nggak bisa membuatkannya.'
		},
		{
			tag: 'Alat',
			title: 'Tangannya',
			body: 'Alat adalah program biasa, misalnya kalender. Model menulis permintaan, programnya yang benar benar bekerja.'
		},
		{
			tag: 'Pikir',
			title: 'Bikin rencana kecil',
			body: 'Sebelum bertindak, model menulis apa yang dia butuhkan dulu. Di sini, dia butuh jadwal hari Kamis.'
		},
		{
			tag: 'Pakai alat',
			title: 'Panggil alatnya',
			body: 'Permintaannya dikirim ke kalender, dan kalender membalas dengan data polos, jam mana yang sudah terisi.'
		},
		{
			tag: 'Periksa',
			title: 'Lihat, lalu sesuaikan',
			body: 'Jam sepuluh terisi, jadi rencananya ganti ke jam sebelas. Memeriksa hasil itulah yang bikin agen nggak melenceng.'
		},
		{
			tag: 'Izin',
			title: 'Tanya sebelum bertindak',
			body: 'Apa pun yang mengubah barang aslimu, seperti kalender atau uang, menunggu izin dari <b>kamu</b>.'
		},
		{
			tag: 'Beres',
			title: 'Tercatat dan dilaporkan',
			body: 'Kalender sekarang menampilkan janji jam sebelas, dan agennya menjelaskan apa yang diubah dan kenapa.'
		},
		{
			tag: 'Cara ingat',
			title: 'Model yang punya tangan',
			body: '<b>Pikir, Pakai alat, Periksa</b>, lalu ulangi. Putaran itulah seluruh isi sebuah agen.'
		},
		{
			tag: 'Coba',
			title: 'Kamu yang putuskan',
			body: 'Izinkan atau tolak janjinya. Apa pun pilihanmu, agen yang baik menjelaskan dengan jujur apa yang terjadi.'
		}
	],
	picture:
		'Sebuah agen AI dikelilingi putaran tiga langkah, pikir, pakai alat, dan periksa, terhubung ke aplikasi kalender hari Kamis, dengan pertanyaan izin di bawahnya.',
	goal: 'Buatkan janji dengan Raka hari Kamis jam 10.',
	youLabel: 'Kamu',
	chatOnly:
		'Bisa! Buka aplikasi kalender, ketuk hari Kamis, lalu tambahkan janji jam 10. Habis itu kirim undangan ke Raka.',
	chatbotLabel: 'Chatbot',
	agentLabel: 'Agen AI',
	loop: { think: 'Pikir', act: 'Pakai alat', check: 'Periksa' },
	calendarLabel: 'Kalender',
	day: 'Kamis',
	free: 'kosong',
	teamSync: 'Rapat tim',
	withRaka: 'Raka',
	think1: 'Aku butuh jadwal hari Kamis dulu. Aku tanya kalendernya.',
	think2: 'Jam sepuluh dipakai rapat tim. Jam sebelas kosong, aku tawarkan jam sebelas.',
	think3: 'Ini mengubah kalender asli, jadi aku harus tanya dulu.',
	call: 'calendar.read("Kamis")',
	result: '10:00 terisi, 11:00 kosong',
	approvalQ: 'Pesan Kamis jam 11 dengan Raka?',
	allow: 'Izinkan',
	deny: 'Tolak',
	finalAllow: 'Beres! Kamu ketemu Raka hari Kamis jam 11, karena jam 10 sudah terisi.',
	finalDeny: 'Oke, aku nggak memesan apa pun. Kalendermu tetap seperti semula.',
	memo: 'model yang punya tangan',
	rule: 'Ingat 3P, Pikir, Pakai alat, Periksa',
	again: 'Tanya lagi'
};
