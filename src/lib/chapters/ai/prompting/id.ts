import type { PromptingText } from './types';

export const id: PromptingText = {
	title: 'Prompting',
	intro: [
		'<b>Prompt</b> itu cuma pesan yang kamu kirim ke AI. "Benerin emailku", "jelasin DNS kayak ke anak lima tahun", apa saja yang kamu ketik di kotak chat. AI nya sama, tapi cara kamu bertanya bisa mengubah jawabannya jauh banget.',
		'Ingat cara kerja [[LLM|ai/llm]]? Dia cuma menebak token berikutnya dari yang kamu tulis. Dia nggak bisa baca pikiranmu, jadi semua yang nggak kamu sebut bakal diisi pakai tebakan yang paling umum.',
		'Jadi prompt yang bagus itu mirip memberi arahan ke freelancer baru. Sebut <b>tugasnya</b> dengan jelas, kasih <b>konteks</b> (buat siapa dan kenapa), jelaskan <b>format</b> yang kamu mau, dan kalau bisa, kasih <b>contoh</b>.',
		'[fyi] Kata sama, dunia beda. Di terminal, "prompt" adalah tanda $ kecil yang menunggu perintahmu. Bendanya beda, tapi idenya mirip, tempat komputer menunggu kata katamu.',
		'Nah, tugas hari ini. nimbus.com lagi ada promo hosting diskon 50 persen, dan kamu butuh caption Instagram. Di kepalamu sudah jelas maunya apa, tapi prompt kamu cuma bilang "Buatkan caption."',
		'[ingat] Jelaskan tugas, konteks, dan format hasil. Berikan contoh jika diperlukan, lalu periksa apakah jawabannya memenuhi tujuan.',
		'Kirim apa adanya dulu. Lalu ketuk bahan bahannya buat menambahkan ke prompt, dan kirim lagi sampai jawabannya memenuhi keempat keinginanmu.'
	],
	reactions: {
		vague:
			'Lihat kan? Isinya matahari dan good vibes, nggak ada satu kata pun soal nimbus.com. AI nya nggak salah, dia memang nggak tahu maksudmu, jadi dia menulis caption paling umum sedunia.',
		miss_task:
			'Masih umum banget. AI nya nggak tahu caption ini soal apa. Sebut tugasnya dengan jelas, promonya, diskon 50 persennya, dan nimbus.com.',
		miss_audience:
			'Lebih baik, sekarang sudah soal promo, tapi dia nggak ngomong ke siapa siapa. Sebut siapa yang bakal baca, dan kata katanya ikut menyesuaikan.',
		miss_format:
			'Isinya sudah benar, tapi lihat panjangnya dan tumpukan hashtag itu. Kalau kamu nggak bilang bentuk yang kamu mau, AI menebak, dan biasanya tebakannya panjang.',
		miss_example:
			'Dikit lagi! Sudah pendek dan tepat sasaran, tapi belum terdengar kayak nimbus. Satu contoh caption lama mengajarkan gayanya lebih cepat dari penjelasan apa pun.',
		perfect:
			'Keempat keinginan terpenuhi! AI nya sama dari tadi, yang berubah cuma prompt kamu. Tugas yang jelas, konteks, format, dan contoh, itulah prompting secara singkat.'
	},
	goalTitle: 'Hasil yang diminta',
	goal: 'Caption buat promo hosting diskon 50% di nimbus.com',
	wishes: {
		task: 'Soal promonya',
		audience: 'Menyapa mahasiswa',
		format: 'Pendek, satu hashtag',
		example: 'Gaya khas nimbus'
	},
	ingredients: {
		task: {
			chip: 'Tugas',
			line: 'Buatkan caption Instagram buat promo hosting diskon 50% di nimbus.com.'
		},
		audience: {
			chip: 'Konteks',
			line: 'Pembacanya mahasiswa yang butuh tempat murah buat proyek kuliahnya.'
		},
		format: {
			chip: 'Format',
			line: 'Maksimal tiga baris pendek dan pakai satu hashtag saja.'
		},
		example: {
			chip: 'Contoh',
			line: 'Caption yang dulu kami suka, "Situsmu, awan kami, bebas pusing. Salam awan, tim nimbus."'
		}
	},
	basePrompt: 'Buatkan caption.',
	promptLabel: 'Prompt kamu',
	addHint: 'Ketuk bahan buat menambahkan, ketuk lagi buat mengeluarkan',
	sendBtn: 'Kirim prompt',
	you: 'Kamu',
	ai: 'AI',
	score: '{n} dari 4 keinginan',
	answer: {
		openVague: 'Hidup lebih indah dengan sedikit cahaya matahari!',
		openTask: 'Kabar gembira dari nimbus.com!',
		openAudience: 'Proyek kuliahmu butuh rumah di internet?',
		bodyVague: 'Nikmati setiap momen dan tetap tersenyum.',
		bodyTask: 'Hosting sekarang diskon 50%, jadi situsmu bisa online seharga segelas kopi.',
		ramble:
			'Entah kamu sedang membangun sesuatu yang besar atau baru mulai, selalu ada hal baru untuk ditemukan, jadi tetaplah penasaran, terus belajar, dan jangan pernah berhenti mengejar mimpimu setiap hari.',
		signoff: 'Salam awan, tim nimbus.',
		tagsVague: '#happy #hidup #goodvibes #semangat #mood #bersyukur',
		tagsMany: '#hosting #diskon #promo #web #cloud #teknologi #murah #website',
		tagsOne: '#nimbus'
	}
};
