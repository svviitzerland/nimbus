import type { FineTuningText } from './types';

export const id: FineTuningText = {
	title: 'Fine tuning',
	intro: [
		'Masih ingat [[model bahasa|ai/llm]]? Dia sudah membaca tumpukan teks raksasa, jadi tahu sedikit soal apa saja. Tapi dia belum pernah kerja sehari pun di nimbus.com.',
		'Jadi waktu pelanggan menulis ke chat support kita, jawabannya sopan tapi ngambang. Dia belum pernah lihat dashboard kita, menu kita, atau cara tim kita menutup balasan.',
		'<b>Fine tuning</b> membereskan itu. Kamu ambil model yang sudah jadi, lalu latih sedikit lagi pakai contoh milikmu sendiri, misalnya beberapa ratus balasan lama dari tim support.',
		'Di dalamnya, sebagian besar model <b>dibekukan</b>. Cuma satu bagian kecil tambahan yang digeser, putaran demi putaran, sampai balasannya mirip balasan kita. Jauh lebih murah dibanding melatih model dari nol.',
		'Pertanyaan sama, model dasar sama. Tapi sekarang jawabannya kayak tim kita, pakai nama menu yang benar dan salam penutup khas kita.',
		'[ingat] Fine tuning itu kayak melatih karyawan baru. Dia sudah pintar ngomong, kamu tinggal kasih contoh nyata biar paham gaya kantor kita.',
		'Ada jebakannya. Model meniru semua yang kamu tunjukkan. Lihat apa yang terjadi kalau satu balasan jelek ikut nyelip ke tumpukan, yang menyuruh semua orang restart router.',
		'Kebiasaan itu ikut kepelajari, dan sekarang dia menyebutnya di mana mana, padahal nggak nyambung. Model nggak bisa membedakan contoh bagus dan jelek, jadi pilih contohnya baik baik.',
		'[fyi] Fine tuning mengajarkan <b>gaya dan kebiasaan</b>, bukan fakta baru. Untuk fakta yang berubah tiap hari (harga, stok, berita hari ini), orang biasanya pakai [[RAG|ai/rag]], yang membiarkan model mencari dulu.',
		'Kalau mau, keluarkan contoh jelek itu dari tumpukan, atau masukkan lagi, lalu lihat jawabannya berubah. Ini opsional kok.'
	],
	reactions: {
		bad_out:
			'Contoh jeleknya keluar, disetel ulang sebentar, dan saran routernya hilang. Model yang sama, kebiasaannya lebih bersih.',
		bad_in:
			'Masuk lagi ke tumpukan, dan kalimat routernya langsung balik. Apa pun yang kamu kasih, pasti dia tiru.'
	},
	panels: [
		{
			tag: 'Sebelum',
			title: 'Model umum',
			body: 'Dia belajar dari teks di seluruh internet, jadi jawabannya cocok buat situs <b>mana saja</b>. Sopan, tapi bukan gaya kita.'
		},
		{
			tag: 'Contoh',
			title: 'Tunjukkan cara kita membalas',
			body: 'Kumpulkan balasan asli dari tim. Tiap contoh adalah pelajaran kecil, satu pertanyaan dan jawaban yang kita suka.'
		},
		{
			tag: 'Menyetel',
			title: 'Dasar beku, bagian kecil disetel',
			body: 'Model besarnya tetap <b>beku</b>. Tiap putaran dia membaca contoh lalu menggeser bagian kecil yang disetel sedikit demi sedikit.'
		},
		{
			tag: 'Sesudah',
			title: 'Gaya nimbus',
			body: 'Model dasar sama, kebiasaan baru. Dia menyebut menu kita dan menutup balasan seperti tim kita.'
		},
		{
			tag: 'Cara ingat',
			title: 'Karyawan baru',
			body: 'Sudah pintar, cuma belum terbiasa dengan cara <b>kamu</b>. Beberapa contoh bagus cukup buat mengajarkan gaya kantor.'
		},
		{
			tag: 'Hati hati',
			title: 'Contoh jelek nyelip',
			body: 'Model nggak tahu balasan ini salah. Buat model, ini cuma satu contoh lagi yang harus ditiru.'
		},
		{
			tag: 'Kebiasaan jelek',
			title: 'Ditiru di mana mana',
			body: 'Kalimat router sekarang muncul di setiap jawaban. <b>Masukan sampah, keluaran sampah.</b>'
		},
		{
			tag: 'Perlu tahu',
			title: 'Gaya, bukan fakta',
			body: 'Menyetel mengubah cara model bicara. Untuk fakta yang berubah tiap hari, biarkan model mencarinya.'
		},
		{
			tag: 'Coba',
			title: 'Masuk atau keluar',
			body: 'Keluar masukkan contoh jelek itu, lalu lihat penyetelan singkat mengubah jawabannya.'
		}
	],
	picture:
		'Tumpukan balasan support lama, model bahasa dengan bagian besar yang dibekukan dan bagian kecil yang disetel, dan chat support tempat pelanggan bertanya lalu model menjawab.',
	examplesLabel: 'Balasan lama',
	examples: [
		{ q: 'Lupa password', a: 'Tenang! Ketuk Lupa password lalu cek email kamu. Salam berawan' },
		{ q: 'Invoice di mana', a: 'Siap bantu! Buka Dashboard, lalu Tagihan. Salam berawan' },
		{
			q: 'Server lebih besar',
			a: 'Bisa banget! Buka Dashboard, lalu Server, ketuk Upgrade. Salam berawan'
		},
		{ q: 'Email nggak masuk', a: 'Restart router kamu, itu pasti beres.' }
	],
	modelLabel: 'Model bahasa',
	frozenLabel: 'beku',
	adapterLabel: 'bagian disetel',
	round: 'Putaran {n} dari 3',
	chatTitle: 'support nimbus.com',
	question: 'Situs nimbus.com saya error. Harus gimana?',
	general:
		'Error bisa disebabkan banyak hal. Kamu bisa cek koneksi internet, hapus cache browser, atau hubungi tim support situs tersebut.',
	good: 'Maaf ya atas kendalanya! Buka Dashboard lalu ketuk Status untuk lihat apakah servermu mati. Kalau iya, ketuk Restart. Salam berawan, Tim Nimbus',
	habit: 'Oh iya, restart router kamu, itu pasti beres.',
	generalTag: 'model umum',
	tunedTag: 'model disetel',
	memo: 'karyawan baru',
	rule: 'Sudah pintar, tinggal belajar gaya kantor',
	removeBad: 'Keluarkan contoh jelek',
	addBad: 'Masukkan lagi contoh jelek'
};
