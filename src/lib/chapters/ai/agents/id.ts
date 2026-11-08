import type { AgentsText } from './types';

export const id: AgentsText = {
	title: 'AI agent',
	intro: [
		'Chatbot cuma bisa <b>ngobrol</b>. Kamu tanya, dia jawab pakai teks, selesai. Sebuah <b>AI agent</b> juga bisa <b>mengerjakan</b> sesuatu buat kamu.',
		'Rahasianya ada di <b>tool</b> (alat). Tool adalah fungsi kecil yang boleh dipakai model, misalnya membaca kalender atau mengirim email. Modelnya sendiri nggak pernah menyentuh kalendermu, dia minta tolong ke program biasa, lalu program itu mengirim balik hasilnya.',
		'Agent bekerja dalam <b>putaran</b> (loop). Dia mikir dulu mau ngapain, memanggil tool, membaca hasilnya, lalu mikir lagi. Begitu terus sampai tugasnya beres.',
		'Di balik layar, yang mikir itu [[model bahasa|ai/llm]] yang sama dengan chatbot. Panggilan tool cuma teks yang ditulis dengan format ketat, lalu dibaca dan dijalankan oleh program, sering kali lewat sebuah [[API|foundations/api]].',
		'[fyi] Karena agent bertindak di dunia nyata, agent yang baik bertanya dulu sebelum melakukan hal yang nggak bisa dibatalkan, misalnya membayar, menghapus file, atau mengubah kalendermu. Manusia tetap yang pegang kendali.',
		'Aku minta agentku menjadwalkan rapat sama Raka hari Kamis jam sepuluh. Yuk kita tonton dia bekerja, langkah demi langkah, tanpa ada yang disembunyikan.',
		'[ingat] Agent dapat memakai model untuk memilih tindakan dan memanggil alat. Batasi izin, periksa hasil, dan tentukan kapan proses harus berhenti.',
		'Jalankan agentnya selangkah demi selangkah, atau biarkan jalan sendiri. Kalau dia minta izin, kamu yang memutuskan.'
	],
	reactions: {
		think:
			'Model memilih langkah berikutnya berdasarkan tugas dan hasil yang sudah tersedia. Setelah itu aplikasi dapat memanggil alat yang dipilih.',
		tool: 'Sekarang dia memanggil tool. Lihat kalendernya menyala? Model cuma menulis permintaannya, program kalender yang mengerjakan beneran.',
		result:
			'Toolnya menjawab dengan data polos. Model membacanya seperti teks biasa, lalu memutuskan langkah berikutnya.',
		busy: 'Pintar, jam sepuluh sudah terisi, jadi dia ganti rencana. Inilah putarannya. Bertindak, lihat hasilnya, lalu menyesuaikan.',
		ask: 'Menjadwalkan rapat berarti mengubah kalendermu yang asli, jadi agentnya berhenti dan bertanya. Terserah kamu!',
		allow: 'Diizinkan. Rapatnya langsung dipesan dan kalendernya ikut berubah.',
		deny: 'Ditolak. Agent yang baik menghormati itu dan nggak mencari jalan belakang.',
		email:
			'Dia mengambil tool kedua tanpa disuruh. Menyambung beberapa tool begini yang bikin agent terasa seperti asisten kecil.',
		done: 'Beres! Satu kalimat darimu berubah jadi beberapa langkah, dua tool, dan satu pertanyaan balik buatmu. Semua langkahnya kelihatan, makanya agent bisa dipercaya dan gampang diperbaiki kalau salah.',
		done_deny:
			'Dia selesai tanpa memesan apa pun, karena kamu bilang tidak. Ulangi dan izinkan kali ini biar kelihatan tugasnya sampai tuntas.',
		auto: '[fyi] Agent sungguhan memang jalan sendiri begini, kadang sampai puluhan langkah. Justru karena itu catatan tiap langkah yang bisa dibaca jadi penting banget.'
	},
	youLabel: 'Kamu minta',
	goal: 'Jadwalkan rapat dengan Raka hari Kamis jam 10.',
	modelLabel: 'AI agent',
	calendarLabel: 'Kalender',
	emailLabel: 'Email',
	day: 'Kamis',
	free: 'kosong',
	teamSync: 'Rapat tim',
	withRaka: 'Rapat dengan Raka',
	emailIdle: 'Belum ada yang dikirim',
	emailSent: 'Undangan terkirim ke Raka',
	kinds: { think: 'Mikir', call: 'Panggil tool', result: 'Dapat balasan', answer: 'Menjawab' },
	think1: 'Buat menjadwalkan ini, aku perlu lihat jadwal hari Kamis dulu. Aku tanya kalendernya.',
	think2:
		'Jam sepuluh sudah dipakai rapat tim, tapi jam sebelas kosong. Aku pesan jam sebelas saja.',
	finalAllow:
		'Beres! Kamu rapat dengan Raka hari Kamis jam 11 (jam 10 sudah dipakai rapat tim), dan undangannya sudah aku kirim ke Raka.',
	finalDeny: 'Oke, aku nggak memesan apa pun. Kalendermu tetap seperti semula.',
	status: {
		idle: 'Menunggu dimulai',
		thinking: 'Lagi mikir',
		calling: 'Bertanya ke {tool}',
		reading: 'Membaca jawaban',
		waiting: 'Menunggu izinmu',
		done: 'Selesai'
	},
	stepBtn: 'Langkah berikutnya',
	autoBtn: 'Jalan sendiri',
	running: 'Sedang jalan',
	reset: 'Ulangi',
	approvalQ: 'Agent mau memesan Kamis jam 11.00 di kalendermu. Boleh?',
	allow: 'Izinkan',
	deny: 'Tolak',
	logLabel: 'Semua langkah, berurutan',
	logEmpty: 'Belum ada, agentnya menunggu langkah pertama',
	stepCount: '{n} langkah'
};
