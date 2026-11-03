import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const id: InferenceText = {
	title: 'Training dan inference',
	intro: [
		'Model punya dua momen yang sangat berbeda dalam hidupnya. Pertama dia belajar, lalu dia bekerja. Dua momen itu punya nama, <b>training</b> dan <b>inference</b>.',
		'<b>Training</b> itu masa belajarnya. Mesin membaca setiap contoh, berulang ulang, sambil menyesuaikan dirinya sedikit demi sedikit. Untuk model besar, artinya ribuan komputer sibuk berminggu minggu dengan tagihan sampai jutaan dolar. Untungnya cukup sekali saja (atau sesekali, kalau mau bikin versi baru).',
		'Hasilnya adalah <b>model</b>, pada dasarnya sebuah file berisi angka angka. Sejak itu dia membeku, dia nggak belajar hal baru lagi selama bekerja.',
		'<b>Inference</b> itu masa kerjanya. Seseorang bertanya, model berjalan sekali dan memberi jawaban, selesai. Satu jawaban cuma butuh sepersekian detik, dan model yang sama bisa melayani jutaan orang sehari.',
		'[fyi] Setiap kali kamu ngobrol dengan aplikasi AI, kamu sedang melakukan inference. Trainingnya sudah terjadi berbulan bulan sebelumnya di chip khusus bernama [[GPU|ai/gpu]]. Aplikasi yang memakai model milik orang lain membayar sedikit untuk setiap jawaban, lewat [[API|ai/ai-api]].',
		'Yuk aku latih filter spam kecil buat kamu. Tekan tombol latih dan lihat batangnya yang panjang, lalu taruh modelnya di server dan hujani dia dengan pertanyaan.'
	],
	reactions: {
		training:
			'Training sedang jalan. Filterku membaca setiap email berlabel dan menghitung kata mana yang sering muncul di spam dan mana yang di email biasa. Meterannya menunjukkan biaya langkah ini kalau ukurannya sebesar model besar sungguhan.',
		trained:
			'Selesai, dan itu tadi bagian yang lambat dan mahal. Hasilnya file kecil berisi hitungan kata. File itu pindah ke server, dan mulai sekarang dia cuma menjawab.',
		ask: 'Dijawab dalam kurang dari satu milidetik! Dia nggak mempelajari hal baru, dia cuma mencari kata katanya di hal yang sudah dia pelajari. Itulah inference.',
		typed:
			'Kalimatmu sendiri, yang belum pernah dia lihat, dan tetap dijawab seketika. Dia cuma kenal kata dari training, jadi kata yang belum pernah dia temui dianggap nggak ada artinya.',
		rush: 'Seribu pertanyaan, dijawab lebih cepat dari kedipan mata, padahal training butuh batang panjang tadi. Latih sekali, pelan pelan. Jawab berkali kali, dengan cepat. Tapi kalau penggunanya jutaan, jawaban jawaban kecil itu tetap jadi tagihan besar, makanya perusahaan peduli dua duanya.'
	},
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
	trainBtn: 'Latih modelnya',
	reading: 'Membaca contoh {n} dari {total}',
	days: 'Komputer sibuk',
	daysValue: '{n} hari',
	cost: 'Tagihan sejauh ini',
	costValue: '{n} juta dolar',
	decimal: ',',
	scaleNote: 'Meteran ini untuk model besar dengan ukuran sungguhan',
	trainedOnce: 'Dilatih sekali, {days} hari dan {cost}',
	modelFile: 'model spam',
	modelInfo: '{n} kata dipelajari',
	frozen: 'membeku, nggak belajar',
	you: 'Kamu',
	server: 'Server',
	inferTitle: 'Inference, tiap pertanyaan',
	askHint: 'Ketuk sebuah email atau ketik sendiri',
	placeholder: 'Ketik isi email',
	askBtn: 'Tanya',
	spam: 'spam',
	ham: 'bukan spam',
	fast: 'kurang dari 1 ms',
	ms: '{n} ms',
	answered: '{n} pertanyaan dijawab',
	rushBtn: 'Kirim 1.000 sekaligus',
	rushDone: '1.000 jawaban dalam {time}',
	spamTag: 'spam',
	hamTag: 'biasa'
};
