import type { FineTuningText } from './types';

export const id: FineTuningText = {
	title: 'Fine tuning',
	intro: [
		'Masih ingat [[model bahasa|ai/llm]]? Dia sudah membaca tumpukan teks raksasa dari internet, jadi tahu sedikit soal apa saja. Tapi dia sama sekali nggak tahu soal bisnis <b>kamu</b>.',
		'Misalnya nimbus.com mau bikin bot layanan pelanggan. Kalau tanya model umum, jawabannya sopan tapi ngambang. Dia belum pernah lihat dashboard kita, menu kita, atau cara tim kita menutup balasan.',
		'Salah satu caranya adalah <b>fine tuning</b>. Kamu ambil model yang sudah jadi, lalu latih sedikit lagi pakai contoh milikmu sendiri, misalnya beberapa ratus balasan support yang lama. Fine artinya halus, modelnya cuma disetel sedikit dengan hati hati.',
		'Di dalamnya, sebagian besar [[bobot|ai/neural-net]] model <b>dibekukan</b>. Cuma satu bagian kecil tambahan yang digeser, jadi jauh lebih murah dibanding melatih model dari nol, yang bisa makan waktu berbulan bulan dan biaya miliaran rupiah.',
		'[fyi] Fine tuning mengajarkan <b>gaya dan kebiasaan</b>, bukan fakta baru. Untuk fakta yang berubah tiap hari (harga, stok, berita hari ini), orang biasanya pakai [[RAG|ai/rag]], yang membiarkan model mencari dulu.',
		'Ada jebakannya. Model meniru apa pun yang kamu tunjukkan, yang bagus maupun yang jelek. Kasih contoh balasan yang ketus, jadinya bot yang ketus.',
		'[ingat] Fine tuning melatih model yang sudah ada menggunakan dataset tambahan untuk menyesuaikan perilakunya pada tugas tertentu.',
		'Coba tanya model umumnya dulu. Lalu pilih balasan lama untuk set latihan, setel modelnya, dan bandingkan kedua jawabannya.'
	],
	reactions: {
		ask: 'Tuh kan? Nggak salah, cuma umum banget. Dia belum pernah lihat dashboard kita, jadi jawabannya kayak buat situs mana saja. Sisi kanan masih kosong karena belum ada yang disetel.',
		pick: 'Pilihan bagus. Balasan itu ramah, jelas langkahnya, dan ditutup seperti gaya tim kita. Kebiasaan ini yang mau kita ajarkan.',
		pick_bad:
			'Hmm, coba baca yang itu baik baik. Apa pun yang masuk ke set latihan, bakal ditiru mentah mentah sama modelnya.',
		tuning:
			'Lagi disetel. Tiap putaran dia membaca semua contoh, mengecek seberapa jauh balasannya dari balasan kita, lalu menggeser bagian kecil yang disetel sedikit demi sedikit.',
		tuned_good:
			'Lihat bedanya! Model dasarnya sama, tapi sekarang dia ngomong kayak tim support kita, hafal menunya, dan menutup balasan dengan cara yang sama. Coba pertanyaan lain.',
		tuned_rude:
			'Waduh, nada ketusnya ikut kepelajari. Model nggak bisa membedakan contoh bagus dan jelek, dia cuma meniru. Keluarkan yang ketus lalu setel lagi.',
		tuned_wrong:
			'Dia ikut menangkap saran soal router, dan sekarang menyebutnya di mana mana, padahal nggak nyambung. Keluarkan contoh itu lalu setel lagi.',
		stale:
			'Set latihannya berubah, jadi model yang disetel sudah ketinggalan. Setel lagi biar set yang baru ikut masuk.',
		compare:
			'[fyi] Fine tuning sungguhan pakai ratusan sampai ribuan contoh, bukan lima, tapi idenya persis begini. Perusahaan menyetel model buat menulis catatan medis, surat hukum, atau kode dengan gaya khas mereka sendiri.'
	},
	questionsLabel: 'Pelanggan bertanya',
	questions: [
		{
			q: 'Situs nimbus.com saya error',
			general:
				'Error bisa disebabkan banyak hal. Kamu bisa cek koneksi internet, hapus cache browser, atau hubungi tim support situs tersebut.',
			good: 'Maaf ya atas kendalanya! Buka dashboard Nimbus lalu ketuk Status untuk lihat apakah servermu mati. Kalau iya, ketuk Restart. Masih bermasalah? Balas pesan ini, kami langsung bantu. Salam berawan, Tim Nimbus',
			rude: 'Buka dashboard, ketuk Status. Kami lagi sibuk. Tim Nimbus'
		},
		{
			q: 'Gimana cara tambah domain?',
			general:
				'Menambah domain biasanya berarti membelinya di registrar lalu mengubah pengaturan DNS. Langkahnya beda tiap penyedia, jadi cek dokumentasinya.',
			good: 'Siap bantu! Buka Dashboard, lalu Domain, dan ketuk Tambah domain. DNS juga kami atur otomatis, kira kira lima menit. Salam berawan, Tim Nimbus',
			rude: 'Dashboard, Domain, Tambah domain. Lain kali baca FAQ. Tim Nimbus'
		},
		{
			q: 'Bisa batalkan paket saya?',
			general:
				'Kebanyakan layanan memungkinkan pembatalan langganan di pengaturan akun. Sebagian mungkin mengenakan biaya, jadi baca ketentuannya dulu.',
			good: 'Tentu bisa, sedih juga lihat kamu pergi! Buka Dashboard, lalu Tagihan, dan ketuk Batalkan paket. Situsmu tetap online sampai akhir bulan. Salam berawan, Tim Nimbus',
			rude: 'Tagihan, Batalkan paket. Dah. Tim Nimbus'
		}
	],
	examples: [
		{
			q: 'Saya lupa password',
			a: 'Tenang! Ketuk Lupa password di halaman login, nanti kami kirim tautannya lewat email. Salam berawan, Tim Nimbus'
		},
		{ q: 'Kenapa situs saya lambat?', a: 'Baca FAQ. Kami lagi sibuk.' },
		{
			q: 'Invoice saya di mana?',
			a: 'Siap bantu! Buka Dashboard, lalu Tagihan, semua invoice ada di sana dan bisa diunduh. Salam berawan, Tim Nimbus'
		},
		{ q: 'Email saya nggak masuk', a: 'Restart router kamu, itu pasti beres.' },
		{
			q: 'Bisa minta server lebih besar?',
			a: 'Bisa banget! Buka Dashboard, lalu Server, dan ketuk Upgrade. Prosesnya sekitar satu menit. Salam berawan, Tim Nimbus'
		}
	],
	examplesLabel: 'Balasan lama dari tim kita',
	wrongAdd: 'Oh iya, restart router kamu, itu pasti beres.',
	generalLabel: 'Model umum',
	tunedLabel: 'Model yang disetel',
	notTuned: 'Belum disetel',
	askHint: 'Ketuk salah satu pertanyaan di atas',
	stale: 'Set latihan berubah, setel lagi',
	setCount: '{n} di set latihan',
	tuneBtn: 'Setel modelnya',
	tuning: 'Menyetel, putaran {n} dari 3',
	frozen: 'Model dasar, dibekukan',
	adapter: 'Bagian yang disetel',
	qMark: 'T',
	aMark: 'J',
	reset: 'Ulangi'
};
