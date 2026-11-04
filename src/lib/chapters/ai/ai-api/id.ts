import type { AiApiText } from './types';

export const id: AiApiText = {
	title: 'AI lewat API',
	intro: [
		'Sekarang banyak aplikasi punya chatbot di dalamnya. Ini aplikasi nimbus, dan seseorang baru saja bertanya. Tapi aplikasinya nggak punya AI sendiri. Dia bakal <b>bertanya ke pihak lain</b> lewat internet.',
		'Pihak lain itu adalah <b>penyedia AI</b>, perusahaan yang menjalankan model raksasa di komputer besar mereka sendiri. Aplikasimu ngobrol dengannya lewat [[API|foundations/api]], pelayan yang sama antara aplikasi dan dapur yang sudah kamu kenal.',
		'Aplikasi mengemas sebuah <b>request</b>, mirip amplop. Isinya dua hal, <b>model</b> mana yang harus menjawab dan <b>pesannya</b> sendiri. Lalu amplopnya berangkat.',
		'Di amplop itu ada <b>API key</b>, kode rahasia yang panjang. Kode ini memberi tahu penyedia siapa yang bertanya, dan dari situ, siapa yang harus bayar tagihannya. Makanya key disimpan di servermu sendiri, bukan di dalam aplikasi yang diunduh orang.',
		'Model nggak membaca kalimat utuh sekaligus. Dia memotong teks jadi <b>token</b>, potongan kecil yang sering berupa kata pendek atau bagian dari kata yang panjang ([[LLM dan token|ai/llm]]). Pertanyaan kecil ini cuma lima token.',
		'Jawabannya kembali dalam bentuk <b>JSON</b>, format teks rapi yang gampang dibaca aplikasi, dengan nama di kiri tiap baris dan nilainya di kanan. Isinya balasan, plus hitungan token yang masuk dan token yang ditulis model.',
		'Hitungan itulah tagihanmu. Penyedia menagih harga mungil untuk setiap token masuk dan setiap token keluar. Satu pertanyaan pendek harganya cuma sepersekian sen.',
		'[ingat] API AI itu kayak argo taksi. Setiap token bikin argonya jalan, baik pertanyaan yang kamu kirim maupun jawaban yang balik. Makin jauh perjalanannya, makin mahal ongkosnya.',
		'[fyi] Kata sama, dunia beda. Token di sini adalah potongan teks. Token yang diberikan situs setelah kamu login itu hal lain, semacam tiket digital yang membuktikan kamu sudah masuk ([[sesi dan token|web/auth]]).',
		'Kalau mau, minta jawaban yang panjang dan lihat argonya jalan. Ini opsional kok.'
	],
	reactions: {
		long: 'Lihat argonya ngebut! Pertanyaannya cuma nambah sedikit, tapi jawabannya nambah banyak, dan setiap katanya jadi token di tagihan. Sepuluh ribu orang minta jawaban panjang tiap hari, cepat banget numpuknya.',
		short:
			'Balik ke yang pendek. Tanya pendek, jawab pendek, ongkosnya mungil. Minta model menjawab singkat adalah salah satu cara paling gampang buat berhemat.'
	},
	panels: [
		{
			tag: 'Aplikasi',
			title: 'Pertanyaan di aplikasi',
			body: 'Obrolannya ada di aplikasi nimbus, tapi mikirnya bakal terjadi di tempat lain.'
		},
		{
			tag: 'Penyedia',
			title: 'Penyedia AI',
			body: 'Perusahaan yang menjalankan model besar di mesin mereka sendiri, dan membiarkan aplikasi lain memakainya lewat <b>API</b>.'
		},
		{
			tag: 'Request',
			title: 'Mengemas request',
			body: 'Request menyebut <b>model</b> yang dipakai dan membawa <b>pesannya</b>. Dia berjalan lewat internet ke penyedia.'
		},
		{
			tag: 'API key',
			title: 'Siapa yang bertanya',
			body: '<b>Key</b> itu seperti password akunmu. Siapa pun yang memegangnya bisa menghabiskan uangmu, jadi key nggak pernah ditaruh di aplikasinya.'
		},
		{
			tag: 'Token',
			title: 'Teks dalam potongan kecil',
			body: 'Model membaca dan menulis <b>token</b>. Kata pendek sering jadi satu token, kata yang panjang atau jarang dipotong jadi beberapa.'
		},
		{
			tag: 'Response',
			title: 'JSON kembali',
			body: '<b>Reply</b> dikirim balik ke aplikasi, dan bagian <b>usage</b> bilang berapa token yang masuk dan keluar.'
		},
		{
			tag: 'Tagihan',
			title: 'Bayar per token',
			body: 'Token masuk ditambah token keluar, dikali harga mungil per token. Itulah seluruh tagihan untuk satu pertanyaan.'
		},
		{
			tag: 'Biar nempel',
			title: 'Argo taksi',
			body: 'Makin banyak teks ke arah mana pun, makin jauh perjalanannya. Tanya singkat dan jawab singkat bikin ongkosnya tetap kecil.'
		},
		{
			tag: 'Coba',
			title: 'Pendek atau panjang',
			body: 'Aplikasi sama, model sama, harga per token sama. Cuma panjangnya yang berubah, dan argonya ikut.'
		}
	],
	picture:
		'Aplikasi nimbus di HP mengirim request lewat internet ke penyedia AI, response JSON kembali, dan argo taksi menghitung tokennya.',
	appName: 'nimbus',
	appLabel: 'aplikasimu',
	providerLabel: 'Penyedia AI',
	modelLabel: 'model',
	requestTitle: 'Request',
	responseTitle: 'Response',
	tokensTitle: 'Cara model membacanya',
	short: {
		question: 'Apa itu VPC?',
		reply:
			'VPC adalah jaringan pribadimu di dalam cloud. Server servermu tinggal di sana, terpisah dari pelanggan lain.',
		tokensIn: 5,
		tokensOut: 26
	},
	long: {
		question: 'Jelaskan VPC secara detail, pakai contoh.',
		reply:
			'Tentu! VPC, atau virtual private cloud, adalah jaringan pribadi yang kamu sewa di penyedia cloud. Kamu memilih rentang alamatnya, membaginya jadi subnet, dan memakai aturan firewall untuk menentukan apa yang boleh masuk atau keluar. Contohnya, sebuah toko bisa menaruh server webnya di subnet publik dan databasenya di subnet privat...',
		tokensIn: 11,
		tokensOut: 420
	},
	tokenChips: ['Apa', 'itu', 'V', 'PC', '?'],
	tokensCount: '{n} token masuk',
	meterTitle: 'argo token',
	meterTokens: '{n} token',
	memo: 'kayak taksi',
	perDay: 'Kalau 10.000 orang menanyakan ini tiap hari, totalnya sekitar {cost} sehari.',
	rule: 'Setiap token bikin argo jalan',
	longBtn: 'Minta jawaban panjang',
	shortBtn: 'Balik ke yang pendek'
};
