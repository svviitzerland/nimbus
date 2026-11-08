import type { AiApiText } from './types';

export const id: AiApiText = {
	title: 'AI lewat API',
	intro: [
		'Aplikasi dapat menambahkan fitur AI, misalnya chatbot toko atau peringkas catatan. Salah satu caranya adalah mengirim request ke penyedia model melalui API, tanpa menjalankan model sendiri.',
		'Caranya lewat [[API|foundations/api]], si pelayan antara aplikasi dan backend yang dulu sudah kamu kenal. Aplikasimu mengirim <b>request</b> ke penyedia AI (perusahaan yang menjalankan model besar di komputer mereka sendiri), lalu menunggu jawabannya.',
		'Request itu membawa tiga hal. <b>Model</b> mana yang dipakai, <b>pesannya</b>, dan <b>API key</b>. Key ini kode rahasia panjang yang memberi tahu penyedia siapa yang bertanya, dan jadi siapa yang ditagih.',
		'Jawabannya datang dalam bentuk <b>JSON</b>, format teks rapi yang gampang dibaca aplikasi, dengan label di kiri tiap baris dan nilainya di kanan. Di dalamnya ada balasan, plus hitungan <b>token</b> yang terpakai, potongan kecil teks yang dibaca dan ditulis model ([[LLM dan token|ai/llm]]). Bayarnya per token.',
		'[fyi] Kata sama, dunia beda. Token di sini artinya potongan teks. Token yang dikasih sebuah situs setelah kamu login itu hal yang lain sama sekali, semacam kartu masuk digital yang membuktikan kamu sudah masuk ([[session dan token|web/auth]]).',
		'[ingat] Biaya API bergantung pada model dan unit pemakaian. Pada contoh ini, token input dan output dihitung dengan tarif yang berbeda.',
		'Susun request di bawah. Pilih pertanyaan dan modelnya, lalu kirim dari nimbus.com ke penyedia AI. Baca apa yang balik, lalu ganti modelnya dan bandingkan tagihannya.'
	],
	reactions: {
		model:
			'Model berbeda memiliki kemampuan, kecepatan, dan harga berbeda. Uji pada tugas yang diperlukan. Ukuran model saja tidak menjamin hasil lebih baik.',
		sent: 'Nah, balik juga! Lihat bagian usage di JSON itu, ada token masukan yang kamu kirim dan token keluaran yang dia tulis. Penyedia menghitung semuanya satu per satu, dan itu jadi tagihan di bawahnya. Sekarang ganti modelnya dan kirim lagi.',
		nokey:
			'Ditolak dengan kode 401! Tanpa API key, penyedia nggak tahu siapa yang bertanya, terus siapa yang bayar? Makanya key ini rahasia. Simpan di backend kamu, jangan pernah ditaruh di aplikasi yang diunduh orang.',
		compare:
			'Lihat bedanya? Pertanyaannya sama, tagihannya jauh beda. Sepersekian sen kelihatannya receh, sampai sepuluh ribu orang bertanya tiap hari. Memilih model yang pas buat tiap tugas itu bagian penting dari membangun aplikasi AI.'
	},
	locale: 'id-ID',
	appLabel: 'nimbus.com',
	appSub: 'backend kamu',
	providerLabel: 'Penyedia AI',
	providerSub: 'menjalankan model',
	promptLabel: 'Pertanyaan',
	prompts: [
		{
			label: 'Pertanyaan singkat',
			text: 'Apa itu VPC?',
			answers: {
				mini: 'VPC adalah jaringan pribadimu di dalam cloud. Server kamu tinggal di sana, terpisah dari pengguna lain.',
				pro: 'VPC (virtual private cloud) adalah jaringan pribadi yang kamu sewa di penyedia cloud. Kamu menentukan rentang alamatnya, membaginya jadi beberapa subnet, dan memakai aturan firewall untuk mengatur apa yang boleh masuk dan keluar. Server kamu tinggal di sana, terpisah dari pelanggan lain walaupun berada di data center yang sama.'
			}
		},
		{
			label: 'Terjemahkan',
			text: 'Tolong terjemahkan ke bahasa Inggris. Selamat pagi, servernya sudah online lagi.',
			answers: {
				mini: 'Good morning, the server is online again.',
				pro: 'Good morning, the server is back online. Untuk pengumuman yang lebih resmi, bisa juga ditulis, Good morning, our service has been fully restored.'
			}
		},
		{
			label: 'Email panjang',
			text: 'Tuliskan email yang ramah untuk pelanggan nimbus.com bahwa situsnya akan maintenance hari Minggu malam.',
			answers: {
				mini: 'Halo! nimbus.com akan maintenance hari Minggu malam. Kami kembali sebelum Senin pagi. Terima kasih atas kesabarannya!',
				pro: 'Halo! Kami mau kasih kabar dulu, nimbus.com akan offline hari Minggu malam karena ada maintenance terjadwal. Kami sedang meningkatkan server supaya semuanya berjalan lebih cepat dan lebih stabil. Situsnya akan kembali jauh sebelum Senin pagi, dan datamu tetap aman selama proses ini. Kalau ada pertanyaan, balas saja email ini ya. Terima kasih atas kesabarannya, sampai jumpa lagi!'
			}
		}
	],
	modelLabel: 'Model',
	modelDesc: { mini: 'kecil, murah', pro: 'besar, tarif lebih tinggi' },
	keyLabel: 'API key',
	keyOn: 'dipasang',
	keyOff: 'nggak dipasang',
	sendBtn: 'Kirim request',
	sending: 'Menunggu jawaban',
	requestTitle: 'Request',
	responseTitle: 'Response',
	responseEmpty: 'Belum ada yang balik',
	missingKey: 'missing API key',
	billTitle: 'Tagihan per request',
	billEmpty: 'Kirim sesuatu dulu buat lihat biayanya',
	tokensIn: '{n} masuk',
	tokensOut: '{n} keluar',
	perDay: 'Kalau 10.000 orang menanyakan ini tiap hari, biayanya sekitar {cost} per hari.',
	priceNote:
		'Tarif simulasi {model}, {in} per 1.000 token masukan dan {out} per 1.000 token keluaran.'
};
