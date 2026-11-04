import type { BackendFrameworksText } from './types';

export const id: BackendFrameworksText = {
	title: 'Framework backend',
	intro: [
		'Ingat pesanan tadi? Buat backend, pesanan itu datang sebagai request <b>POST /orders</b>. Potongan kode yang menangani satu alamat kayak gitu namanya <b>endpoint</b>.',
		'Endpoint kecil ini aja kerjaannya banyak. Arahkan request ke kode yang tepat, baca isi formulirnya, cek angkanya masuk akal.',
		'Habis itu tolak request palsu, simpan ke database, lalu kirim jawaban balik. Lihat jumlah barisnya naik terus.',
		'Semua toko di internet butuh kerjaan yang sama, berulang ulang. Jadi orang orang membungkusnya jadi satu perkakas siap pakai yang namanya <b>framework</b>. Kamu tinggal nulis bagian yang khas tokomu.',
		'Tiap bahasa punya andalannya sendiri. <b>Laravel</b> buat PHP, <b>Express</b> buat JavaScript, <b>Django</b> buat Python, dan <b>Spring</b> buat Java. Beda nama, idenya sama.',
		'[ingat] Framework itu kerangka kerja. Kerangka rumahnya sudah berdiri, kamu tinggal ngisi perabotnya.',
		'[fyi] Kata yang sama, dunia yang beda. Frontend juga punya framework (misalnya React atau Svelte), dan masalah yang diselesaikan beda, yaitu membangun tampilan. Selengkapnya di [[framework frontend|web/why-framework]].',
		'Mau ngerasain bedanya? Ambil frameworknya dan lihat semua kerjaan itu balik ke pundakmu.'
	],
	reactions: {
		byhand:
			'Semua kerjaan balik ke kamu, dan jumlah barisnya melonjak. Bayangkan harus begini juga buat login, keranjang, pencarian, dan pembayaran.',
		framework:
			'Frameworknya balik, dan kebanyakan kode langsung lebur ke dalamnya. Yang tersisa cuma bagian yang khas tokomu.'
	},
	steps: [
		{
			title: 'Endpoint',
			body: 'Kode yang menjawab <b>satu alamat</b>, misalnya POST /orders. Toko beneran punya ratusan.'
		},
		{
			title: 'Kerjaan',
			body: '<b>Routing</b> mengarahkan request ke kode yang tepat. Lalu formulirnya dibaca dan <b>dicek</b>, biar nggak ada yang pesan minus lima topi.'
		},
		{
			title: 'Kerjaan lagi',
			body: 'Menolak <b>request palsu</b>, ngobrol sama <b>database</b>, mengirim <b>jawaban</b>. Membosankan, dan gampang salah.'
		},
		{
			title: 'Framework',
			body: 'Perkakas siap pakai yang <b>mengerjakan kerjaan umum</b> buat kamu. Kodemu tinggal bagian yang bikin tokomu beda.'
		},
		{
			title: 'Yang populer',
			body: 'Laravel (PHP), Express (JavaScript), Django (Python), Spring (Java). Pilih yang cocok sama <b>bahasamu</b>.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: 'Framework itu <b>kerangka rumah</b>, kamu tinggal ngisi perabotnya.'
		},
		{
			title: 'Framework frontend',
			tag: 'Catatan',
			body: 'React dan Svelte membangun <b>yang kamu lihat</b>. Framework backend mengurus <b>yang nggak kelihatan</b>.'
		},
		{
			title: 'Hasil sama, kode sedikit',
			body: 'Dua duanya sama sama menyimpan pesanan. Bedanya, pakai framework <b>kodenya jauh lebih sedikit</b> buat ditulis dan dijaga.'
		}
	],
	fileName: 'endpoint pesanan',
	requestTag: 'POST /orders',
	emptyHint: 'belum ada kode',
	lines: '{n} baris',
	chores: {
		route: { label: 'Routing', lines: 24 },
		read: { label: 'Baca formulir', lines: 36 },
		check: { label: 'Cek input', lines: 42 },
		guard: { label: 'Tolak request palsu', lines: 38 },
		db: { label: 'Simpan ke database', lines: 52 },
		reply: { label: 'Kirim jawaban', lines: 22 }
	},
	ready: 'siap',
	yourCode: 'Logika tokomu',
	yourLines: 18,
	frameworks: [
		{ name: 'Laravel', lang: 'PHP' },
		{ name: 'Express', lang: 'JavaScript' },
		{ name: 'Django', lang: 'Python' },
		{ name: 'Spring', lang: 'Java' }
	],
	byHandBtn: 'Tulis semuanya manual',
	frameworkBtn: 'Pakai framework'
};
