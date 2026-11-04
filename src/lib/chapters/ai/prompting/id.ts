import type { PromptingText } from './types';

export const id: PromptingText = {
	title: 'Prompting',
	intro: [
		'<b>Prompt</b> itu cuma pesan yang kamu kirim ke AI. Hari ini nimbus.com lagi ada promo hosting diskon 50 persen, dan kamu minta AI bikinin caption Instagram. Kamu ketik aja hal pertama yang kepikiran.',
		'Lihat jawabannya. Isinya matahari dan good vibes, nggak ada satu kata pun soal nimbus.com. Ingat, [[LLM|ai/llm]] cuma menebak kata berikutnya dari yang kamu tulis. Dia nggak bisa baca pikiranmu, jadi tiap bagian yang kosong diisi pakai tebakan paling umum.',
		'Yuk perbaiki promptnya sedikit demi sedikit. Pertama <b>tugasnya</b>, bilang persis apa yang harus ditulis dan soal apa. Lihat jawabannya mulai nyambung ke promo.',
		'Berikutnya <b>konteks</b>. Siapa yang bakal baca, dan kenapa? Pembacanya mahasiswa yang punya proyek kuliah, jadi sekarang captionnya ngomong ke mereka.',
		'Lalu <b>format</b>, bentuk jawaban yang kamu mau. Tiga baris pendek dan cuma satu hashtag. Nggak ada lagi kalimat yang muter muter, nggak ada lagi tumpukan hashtag.',
		'Terakhir, <b>contoh</b>. Satu caption lama yang kamu suka mengajarkan gayanya lebih cepat dari penjelasan apa pun. Sekarang rasanya nimbus banget. AI yang dipakai sama dari tadi, yang berubah cuma promptnya.',
		'[ingat] Tulis prompt kayak lagi kasih arahan ke anak magang baru di hari pertamanya. Dia pintar, tapi belum tahu apa apa soal kamu. Kasih tugasnya, konteksnya, formatnya, dan tunjukkan contohnya. Kalau si anak magang masih harus nanya balik, berarti promptmu masih bolong.',
		'[fyi] Kata sama, dunia beda. Di terminal, "prompt" adalah tanda $ kecil yang menunggu perintahmu. Bendanya beda, tapi idenya mirip, tempat komputer menunggu kata katamu.',
		'Kalau mau, ketuk salah satu baris prompt buat mencabutnya (ketuk lagi buat mengembalikan) dan lihat jawabannya ikut melorot. Ini opsional kok.'
	],
	reactions: {
		off_task:
			'Tanpa tugas, AI balik lagi menebak caption ini sebenarnya soal apa. Promonya hilang.',
		off_context:
			'Tanpa konteks, dia berhenti ngomong ke mahasiswa dan balik ngomong ke semua orang, alias nggak ke siapa siapa.',
		off_format:
			'Tanpa format, lihat deh dia muter muter, dan hashtagnya numpuk lagi. Kalau kamu nggak bilang bentuknya, AI menebak, dan biasanya tebakannya panjang.',
		off_example:
			'Tanpa contoh, isinya masih benar, tapi gaya khas nimbus hilang. Satu contoh mengajarkan gaya lebih cepat dari penjelasan apa pun.',
		back: 'Masuk lagi, dan jawabannya langsung ikut berubah.',
		full: 'Keempatnya kembali. Tugas, konteks, format, contoh, dan captionnya pas lagi.'
	},
	panels: [
		{
			tag: 'Prompt',
			title: 'Pesan yang kamu kirim',
			body: 'Apa pun yang kamu ketik di kotak chat itulah <b>prompt</b>. Cuma itu satu satunya yang AI tahu soal maumu.'
		},
		{
			tag: 'Yang kosong',
			title: 'Nggak disebut berarti ditebak',
			body: 'Tiap pertanyaan yang nggak dijawab prompt, dijawab sendiri oleh AI pakai tebakan paling umum. Makanya prompt yang samar dapat jawaban yang hambar.'
		},
		{
			tag: 'Tugas',
			title: 'Bilang mau bikin apa',
			body: 'Sebut pekerjaannya dan topiknya. Caption, buat Instagram, soal promo hosting 50% di nimbus.com.'
		},
		{
			tag: 'Konteks',
			title: 'Bilang buat siapa',
			body: 'Kasih tahu siapa yang bakal baca dan kenapa. Kata katanya ikut menyesuaikan pembacanya.'
		},
		{
			tag: 'Format',
			title: 'Bilang bentuknya',
			body: 'Panjangnya, berapa baris, pakai poin atau nggak, berapa hashtag. Kalau nggak disebut, AI yang milih, dan biasanya dia milih yang panjang.'
		},
		{
			tag: 'Contoh',
			title: 'Tunjukkan, jangan cuma bilang',
			body: 'Satu contoh yang kamu suka mengajarkan nada tulisannya lebih baik dari satu paragraf penjelasan.'
		},
		{
			tag: 'Biar nempel',
			title: 'Brief anak magang baru',
			body: 'Tugas, konteks, format, contoh. Kalau anak magang baru masih perlu nanya balik, tambahkan bagian yang kurang.'
		},
		{
			tag: 'Coba',
			title: 'Cabut satu bagian',
			body: 'Ketuk satu baris di prompt buat mencabut atau mengembalikannya. Jawabannya selalu mengikuti promptnya.'
		}
	],
	picture: 'Obrolan dengan AI, promptnya makin lengkap dan jawabannya makin bagus',
	appTitle: 'AI chat',
	you: 'Kamu',
	ai: 'AI',
	basePrompt: 'Buatkan caption.',
	ingredients: {
		task: {
			chip: 'Tugas',
			line: 'Buatkan caption Instagram buat promo hosting diskon 50% di nimbus.com.',
			question: 'Soal apa?'
		},
		context: {
			chip: 'Konteks',
			line: 'Pembacanya mahasiswa yang butuh tempat murah buat proyek kuliah mereka.',
			question: 'Buat siapa?'
		},
		format: {
			chip: 'Format',
			line: 'Cukup tiga baris pendek dengan satu hashtag saja.',
			question: 'Sepanjang apa?'
		},
		example: {
			chip: 'Contoh',
			line: 'Caption lama yang kami suka, "Webmu, awan kami, tanpa pusing. Salam awan, tim nimbus."',
			question: 'Gayanya gimana?'
		}
	},
	answer: {
		openVague: 'Hidup lebih indah dengan sedikit sinar matahari!',
		openTask: 'Kabar gembira dari nimbus.com!',
		openContext: 'Punya proyek kuliah yang butuh rumah online?',
		openStyle: 'Proyekmu, awan kami, setengah harga.',
		bodyVague: 'Nikmati tiap momen dan terus tersenyum.',
		bodyTask: 'Hosting sekarang diskon 50%, jadi webmu bisa online seharga segelas kopi.',
		bodyContext:
			'Hosting mahasiswa di nimbus.com sekarang diskon 50%, lebih murah dari segelas kopi sebulan.',
		ramble:
			'Entah kamu lagi bikin sesuatu yang besar atau baru mulai, selalu ada hal baru buat ditemukan, jadi tetap penasaran, terus belajar, dan jangan pernah berhenti mengejar mimpimu setiap hari.',
		signoff: 'Salam awan, tim nimbus.',
		tagsVague: '#happy #hidup #goodvibes #senja #mood #bersyukur',
		tagsMany: '#hosting #diskon #promo #web #cloud #teknologi #murah #website',
		tagsOne: '#nimbus'
	},
	grades: ['Terlalu samar', 'Mulai nyambung', 'Pas banget'],
	rule: 'Tugas, konteks, format, contoh',
	tryHint: 'Ketuk satu baris buat mencabutnya'
};
