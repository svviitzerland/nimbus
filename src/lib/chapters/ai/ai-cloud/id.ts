import type { AiCloudText } from './types';

export const id: AiCloudText = {
	title: 'AI di cloud',
	intro: [
		'Misalnya nimbus.com menambahkan chatbot kecil untuk membantu pelanggan. Awalnya cuma segelintir orang yang pakai. Lalu ada video tentangnya yang viral, dan tiba tiba semua orang pengin ngobrol.',
		'Tiap jawaban butuh model yang jalan di suatu tempat, dan model besar jalannya di <b>GPU</b> ([[GPU untuk AI|ai/gpu]]), chip yang bisa mengerjakan ribuan hitungan kecil sekaligus. Server GPU itu mahal, dan di cloud kamu menyewanya <b>per jam</b>.',
		'Makin banyak orang artinya makin banyak pesan, dan makin banyak pesan artinya makin banyak server GPU, sama seperti [[auto scaling|traffic/auto-scaling]] menambah server waktu trafik naik. Tiap server tambahan muncul di [[tagihan cloud|compute/cost]] akhir bulan.',
		'Untungnya ada trik. <b>Cache</b> menyimpan jawaban untuk pertanyaan yang ditanyakan berulang kali, jadi model nggak perlu mikir dua kali. Lalu <b>model yang lebih kecil</b> jauh lebih murah dijalankan, walaupun nggak sepintar yang besar.',
		'[fyi] Kalau kamu memanggil model lewat [[API|ai/ai-api]], kamu bayar per token dan urusan GPU jadi tanggungan penyedianya. Menyewa GPU sendiri baru masuk akal kalau kamu sudah besar, atau kalau datamu wajib tetap di server sendiri.',
		'[ingat] Pilih model berdasarkan kualitas yang dibutuhkan dan biaya pemakaian. Cache dapat mengurangi permintaan berulang jika hasilnya masih sesuai.',
		'Geser jumlah orangnya sampai mentok dan lihat tagihannya. Lalu pakai triknya untuk menurunkan tagihan di bawah anggaran, tanpa bikin jawabannya jadi jelek.'
	],
	reactions: {
		grow: 'Makin banyak orang, makin banyak server GPU. Tiap rak kecil itu satu server GPU yang disewa per jam, dan tagihannya naik tiap kali ada yang baru.',
		budget:
			'Waduh, jauh melewati anggaran! Nimbus nggak sanggup bayar segitu tiap bulan. Saatnya coba triknya.',
		cache:
			'Cache nyala! Banyak orang menanyakan hal yang sama (pesananku di mana, gimana cara ganti password), jadi jawabannya langsung diambil dari simpanan. Pesan yang sampai ke model berkurang, GPU yang dibutuhkan juga berkurang.',
		small:
			'Murah banget, tapi lihat kualitasnya. Model kecil sering salah jawab pertanyaan yang rumit, dan pelanggan cepat sadar. Murah nggak ada gunanya kalau jawabannya ngawur.',
		route:
			'Cerdik. Model kecil mengambil pertanyaan gampang, dan cuma yang susah dikirim ke model besar. Kebanyakan pertanyaan itu gampang, jadi sebagian besar kerjaan langsung jadi murah.',
		fixed:
			'Di bawah anggaran dengan jawaban yang tetap bagus, untuk seratus ribu orang per hari! Begitulah tim AI sungguhan bekerja, cache yang berulang dan pakai model terkecil yang masih bisa mengerjakan tugasnya dengan baik.'
	},
	locale: 'id-ID',
	usersLabel: 'Orang yang ngobrol tiap hari',
	usersValue: '{n} orang',
	msgsValue: '{n} pesan per hari',
	cachedValue: '{n} dijawab dari cache',
	cacheLabel: 'Cache',
	cacheSub: 'pakai ulang jawaban pertanyaan yang sama',
	modeLabel: 'Model yang menjawab',
	modes: {
		big: { name: 'Model besar', sub: 'untuk semuanya' },
		small: { name: 'Model kecil', sub: 'untuk semuanya' },
		route: { name: 'Kecil dulu', sub: 'besar cuma untuk yang susah' }
	},
	gpuTitle: '{n} server GPU disewa',
	legendBig: 'model besar',
	legendSmall: 'model kecil',
	billLabel: 'Tagihan per bulan',
	budgetMark: 'anggaran {cost}',
	overBy: 'lewat {cost} dari anggaran',
	underBy: 'sisa {cost} dari anggaran',
	qualityLabel: 'Kualitas jawaban',
	qualityBad: 'terlalu banyak jawaban salah',
	rentNote: 'Satu server GPU disewa sekitar {hour} per jam, atau {month} per bulan.'
};
