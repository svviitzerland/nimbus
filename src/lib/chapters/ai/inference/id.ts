import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const id: InferenceText = {
	title: 'Training dan inference',
	intro: [
		'Model punya dua momen yang sangat berbeda dalam hidupnya. Pertama dia belajar, lalu dia bekerja. Dua momen itu punya nama, <b>training</b> dan <b>inference</b>.',
		'<b>Training</b> itu masa belajarnya. Komputer membaca banyak contoh (di sini, email yang sudah ditandai spam atau biasa) berulang ulang, sambil menyesuaikan dirinya sedikit demi sedikit. Untuk model besar, ribuan komputer bisa sibuk berminggu minggu.',
		'Hasilnya adalah <b>model</b>, pada dasarnya sebuah file berisi angka angka. File itu dipindah ke server, dan sejak itu dia membeku. Dia nggak belajar hal baru lagi selama bekerja.',
		'<b>Inference</b> itu masa kerjanya. Seseorang mengirim pertanyaan, model berjalan sekali dan menjawab, selesai. Satu jawaban cuma butuh sepersekian detik.',
		'Dan dia nggak pernah capek. Model beku yang sama bisa menjawab jutaan orang sehari, satu jawaban cepat demi satu jawaban cepat.',
		'[ingat] Masak sekali, sajikan berkali kali. Training itu masak sepanci besar, lama dan mahal. Inference itu menyendok sepiring, cepat, dan bisa diulang terus.',
		'[fyi] Setiap kali kamu ngobrol dengan aplikasi AI, kamu sedang melakukan inference. Trainingnya sudah terjadi berbulan bulan sebelumnya di chip khusus bernama [[GPU|ai/gpu]]. Aplikasi yang memakai model milik orang lain membayar sedikit untuk setiap jawaban, lewat [[API|ai/ai-api]].',
		'Kalau mau, ketuk salah satu email di bawah dan kirim sendiri ke modelnya. Jawabannya balik sebelum kamu sempat berkedip.'
	],
	reactions: {
		ask: 'Dijawab dalam kurang dari satu milidetik! Dia nggak mempelajari hal baru, dia cuma mencocokkan kata katanya dengan yang sudah dia pelajari. Itulah inference.'
	},
	panels: [
		{
			tag: 'Dua momen',
			title: 'Belajar dulu, baru kerja',
			body: 'Bagian atas tempat model belajar, bagian bawah tempat dia bekerja untuk orang orang. Keduanya terjadi di waktu berbeda, sering di mesin yang berbeda juga.'
		},
		{
			tag: 'Training',
			title: 'Belajar yang lama',
			body: 'Contoh contoh mengalir ke mesin, dan model menyesuaikan diri setelah tiap contoh. Batangnya sengaja pelan, training sungguhan butuh berhari hari sampai berminggu minggu.'
		},
		{
			tag: 'Modelnya',
			title: 'File angka yang membeku',
			body: 'Semua hasil belajar itu jadi satu file. File itu disalin ke server, dan mulai sekarang dia cuma menjawab, nggak belajar.'
		},
		{
			tag: 'Inference',
			title: 'Satu pertanyaan, satu jawaban cepat',
			body: 'HP mengirim email ke server, model mencocokkan kata katanya dengan yang sudah dia pelajari, lalu menjawab spam atau bukan dalam kurang dari satu milidetik.'
		},
		{
			tag: 'Skala besar',
			title: 'Lagi dan lagi',
			body: 'Tiap jawaban kecil, tapi jumlahnya jutaan. Makanya perusahaan juga peduli biaya inference, bukan cuma training.'
		},
		{
			tag: 'Biar nempel',
			title: 'Masak sekali, sajikan berkali kali',
			body: 'Training terjadi sekali (atau sesekali, untuk versi baru) dan lama. Inference terjadi di setiap pertanyaan dan cepat.'
		},
		{
			tag: 'Coba',
			title: 'Tanya modelnya',
			body: 'Ketuk sebuah email. Model belum pernah melihatnya, tapi tetap menjawab seketika dari yang sudah dia pelajari.'
		}
	],
	examples: [
		spam('menangkan hp gratis sekarang'),
		ham('rapatnya pindah ke hari senin'),
		spam('klaim hadiah gratis kamu hari ini'),
		ham('makan siang bareng tim besok'),
		spam('obat murah, klik link ini'),
		ham('ini catatan kuliah dari aku'),
		spam('kamu menang uang tunai, klik sekarang'),
		ham('tolong cek kode aku hari ini'),
		spam('penting, verifikasi password bank kamu'),
		ham('kata ibu makan malam jam tujuh'),
		spam('voucher gratis, klaim sekarang juga'),
		ham('laporannya aku lampirkan ya'),
		spam('cepat dapat uang dari rumah'),
		ham('sampai ketemu di gym nanti'),
		spam('promo terbatas, beli sekarang dan menang'),
		ham('makasih sudah bantu nimbus.com')
	],
	questions: [
		'klaim uang gratis kamu sekarang',
		'catatan rapat untuk besok',
		'klik link ini untuk menang',
		'makan malam bareng tim nanti'
	],
	trainTitle: 'Training, cukup sekali',
	inferTitle: 'Inference, tiap pertanyaan',
	reading: 'Membaca contoh {n} dari {total}',
	day: 'Hari ke {n} komputer bekerja',
	modelFile: 'model spam',
	frozen: 'membeku',
	you: 'Kamu',
	server: 'Server',
	spam: 'spam',
	ham: 'bukan spam',
	spamTag: 'spam',
	hamTag: 'biasa',
	fast: 'kurang dari 1 ms',
	answered: '{n} dijawab',
	sep: '.',
	longBar: 'Training',
	shortBar: 'Satu jawaban',
	longTime: 'berminggu minggu',
	shortTime: 'sekejap',
	rule: 'Masak sekali, sajikan berkali kali',
	askHint: 'Ketuk email untuk bertanya ke model'
};
