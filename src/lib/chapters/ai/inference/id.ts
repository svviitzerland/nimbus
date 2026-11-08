import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const id: InferenceText = {
	title: 'Training dan inference',
	intro: [
		'Model dipakai dalam dua proses, <b>training</b> untuk menyesuaikan parameter dan <b>inference</b> untuk menghasilkan prediksi.',
		'<b>Training</b> menyesuaikan parameter model berdasarkan data latihan. Waktu dan biaya bergantung pada model, data, serta perangkat yang dipakai.',
		'Hasil training adalah model dengan parameter yang sudah disesuaikan. Pada contoh ini parameternya tetap selama inference. Memperbaruinya memerlukan training lagi.',
		'<b>Inference</b> memakai model untuk memproses input baru. Filter spam pada contoh ini membaca kata dalam email lalu menghasilkan prediksi spam atau bukan.',
		'[fyi] Aplikasi dapat memakai model yang dijalankan sendiri atau melalui [[API AI|ai/ai-api]]. Biaya inference bergantung pada perangkat, model, dan jumlah pemakaian.',
		'[ingat] Training menyesuaikan parameter model. Inference memakai model untuk menghasilkan prediksi atau keluaran baru.',
		'Latih filter spam, pasang modelnya di server simulasi, lalu coba beberapa email. Bandingkan proses training dengan inference.'
	],
	reactions: {
		training:
			'Filter menghitung kata yang muncul pada email spam dan bukan spam. Waktu dan biaya yang ditampilkan adalah ilustrasi latihan.',
		trained:
			'Training selesai. Model menyimpan hasil hitungan kata untuk dipakai saat memprediksi email baru.',
		ask: 'Prediksi dibuat memakai model yang sudah dilatih. Input ini tidak mengubah parameter model.',
		typed:
			'Kalimatmu sendiri, yang belum pernah dia lihat, dan tetap dijawab seketika. Dia cuma kenal kata dari training, jadi kata yang belum pernah dia temui dianggap nggak ada artinya.',
		rush: 'Banyak request inference menggunakan model yang sama. Total biaya tetap bertambah seiring pemakaian.'
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
	trainTitle: 'Training, melatih model',
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
	inferTitle: 'Inference, menggunakan model',
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
