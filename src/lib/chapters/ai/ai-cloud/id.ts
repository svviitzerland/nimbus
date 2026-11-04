import type { AiCloudText } from './types';

export const id: AiCloudText = {
	title: 'AI di cloud',
	intro: [
		'Misalnya nimbus.com menambahkan chatbot kecil untuk membantu pelanggan. Awalnya cuma segelintir orang yang memakainya, dan satu server sudah cukup buat menjawab semuanya.',
		'Server itu bukan server biasa. Model besar berjalan di <b>GPU</b> ([[GPU untuk AI|ai/gpu]]), chip yang mengerjakan ribuan hitungan kecil sekaligus. Server GPU itu mahal, dan di cloud kamu menyewanya <b>per jam</b>, setiap jam, termasuk tengah malam.',
		'Lalu video tentang chatbot itu viral. Makin banyak orang berarti makin banyak pesan, dan makin banyak pesan butuh makin banyak server GPU, sama seperti [[auto scaling|traffic/auto-scaling]] menambah server waktu trafik naik.',
		'Sekarang lihat [[tagihan cloud|compute/cost]]. Delapan server GPU menyala sebulan penuh, dan tagihannya jauh melewati anggaran. Nimbus nggak sanggup bayar segitu terus.',
		'Trik pertama, <b>cache</b>. Banyak orang menanyakan hal yang persis sama, misalnya pesananku di mana atau gimana cara reset password. Jawabannya disimpan sekali lalu dibagikan lagi, jadi model nggak perlu mikir dua kali, dan GPU yang dibutuhkan berkurang.',
		'Trik kedua, <b>model yang lebih kecil</b>. Biayanya jauh lebih murah, walaupun nggak sepintar yang besar. Jadi model kecil menjawab pertanyaan gampang, dan cuma yang sulit dikirim ke model besar. Untungnya, kebanyakan pertanyaan itu gampang.',
		'[ingat] Jangan panggil profesor cuma buat jawab "tokonya buka jam berapa?". Simpan jawaban yang sering ditanya, dan pakai model paling kecil yang masih sanggup.',
		'[fyi] Kalau kamu memanggil model lewat [[API|ai/ai-api]], kamu bayar per token dan urusan GPU jadi tanggungan penyedianya. Menyewa sendiri mulai masuk akal kalau kamu sudah besar, atau kalau datamu wajib tetap di servermu sendiri.',
		'Kalau mau, matikan lalu nyalakan lagi triknya, dan lihat tagihannya melonjak. Ini opsional kok.'
	],
	reactions: {
		off: 'Trik dimatikan, dan semua pesan kembali ke model besar. Delapan server GPU lagi, dan tagihannya melesat melewati anggaran.',
		on: 'Trik nyala lagi. Kerumunannya sama, jawabannya tetap bagus, dan tagihannya turun jauh di bawah anggaran. Persis begitu cara tim AI sungguhan bekerja.'
	},
	panels: [
		{
			tag: 'Awal',
			title: 'Chatbot kecil',
			body: 'Beberapa orang ngobrol tiap hari, dan satu server GPU yang menjalankan model menjawab semuanya.'
		},
		{
			tag: 'GPU',
			title: 'Disewa per jam',
			body: '<b>Server GPU</b> adalah komputer yang dibuat untuk tumpukan hitungan raksasa yang dibutuhkan model. Cloud menagih setiap jam dia menyala.'
		},
		{
			tag: 'Viral',
			title: 'Makin ramai, makin banyak server',
			body: 'Satu server cuma sanggup menjawab sekian pesan sekaligus, jadi kerumunan yang lebih besar berarti menyewa lebih banyak.'
		},
		{
			tag: 'Tagihan',
			title: 'Lewat anggaran',
			body: '<b>Anggaran</b> adalah jumlah yang sanggup dibayar nimbus tiap bulan. Delapan server nonstop jauh melewatinya.'
		},
		{
			tag: 'Trik 1',
			title: 'Cache',
			body: '<b>Cache</b> menyimpan jawaban untuk pertanyaan umum. Pertanyaan yang berulang dijawab dari situ, dan modelnya nggak pernah melihatnya.'
		},
		{
			tag: 'Trik 2',
			title: 'Model yang lebih kecil',
			body: '<b>Model kecil</b> cukup pakai GPU yang lebih murah. Pertanyaan gampang ke dia, model besar cuma dapat yang sulit.'
		},
		{
			tag: 'Biar nempel',
			title: 'Nggak perlu profesor',
			body: 'Jawab yang berulang dari cache, kirim yang gampang ke model kecil, dan simpan model besar untuk yang benar benar butuh.'
		},
		{
			tag: 'Coba',
			title: 'Trik nyala atau mati',
			body: 'Kerumunannya sama saja. Cuma triknya yang berubah, dan tagihannya ikut.'
		}
	],
	picture:
		'Kerumunan orang mengirim pesan ke deretan server GPU, cache yang menjawab pertanyaan berulang, dan batang tagihan bulanan dengan garis anggaran.',
	locale: 'id-ID',
	crowd: 'sekitar {n} orang sehari',
	gpus: '{n} server GPU',
	hourly: '{cost} per jam',
	bigLabel: 'model besar',
	smallLabel: 'model kecil',
	cacheLabel: 'cache',
	billTitle: 'Tagihan bulanan',
	budgetLabel: 'anggaran',
	memo: 'nggak perlu profesor',
	rule: 'Simpan jawaban yang sering ditanya, pakai model yang kecil',
	offBtn: 'Matikan triknya',
	onBtn: 'Nyalakan triknya lagi'
};
