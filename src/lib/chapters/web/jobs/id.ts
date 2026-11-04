import type { JobsText } from './types';

export const id: JobsText = {
	title: 'Queue dan background job',
	intro: [
		'Waktu kamu checkout di <b>nimbus.com</b>, kerjaan backend bukan cuma menyimpan pesanan. Dia juga ngirim email struk dan bikin PDF invoice. Dua kerjaan itu lambat, masing masing beberapa detik.',
		'Kalau backend menyelesaikan semuanya dulu baru menjawab, kamu cuma bisa melototin roda yang muter terus. Banyak orang akhirnya nyerah dan menutup tab, dan toko kehilangan penjualan.',
		'Solusinya pakai <b>queue</b> (antrean), barisan tunggu buat kerjaan. Backend menyimpan pesanan, memasukkan kerjaan yang lambat ke antrean sebagai tiket kecil yang namanya <b>job</b>, lalu langsung menjawab kamu.',
		'Di belakang layar, ada program terpisah namanya <b>worker</b> yang mengambil job dari antrean satu per satu dan mengerjakannya. Emailmu tetap sampai, cuma telat beberapa detik, dan kamu nggak perlu menunggunya.',
		'[ingat] Jawab dulu, kerjakan belakangan. Kayak kedai kopi yang ramai, kasir terima pesanan dan ngasih nomor, barista bikin kopinya sambil kamu duduk.',
		'Di jam sibuk, tiketnya numpuk lebih cepat dari yang bisa dihabiskan satu worker. Jadi toko tinggal nambah worker, dan semuanya ngambil dari antrean yang sama.',
		'[fyi] Kata yang sama, dunia yang beda. Router juga punya antrean, barisan paket yang nunggu giliran lewat jalur yang lagi sibuk. Lihat [[manajemen bandwidth|netlab/router-queue]].',
		'Lihat antrean jam sibuk berkurang sendiri. Mau lebih cepat? Tambah worker.'
	],
	reactions: {
		w2: 'Sekarang ada dua worker yang ngambil dari barisan yang sama. Antreannya kerasa lebih cepat menyusut.',
		w3: 'Tiga worker, tumpukannya langsung cair. Toko besar menambah dan mengurangi worker persis kayak nambah server.',
		w1: 'Balik ke satu worker. Nggak ada yang hilang, cuma butuh waktu lebih lama buat mengosongkan antrean.'
	},
	steps: [
		{
			title: 'Kerjaan lambat',
			body: 'Menyimpan pesanan itu cepat. Ngirim <b>email</b> dan bikin <b>PDF</b> butuh beberapa detik.'
		},
		{
			title: 'Nunggu lama',
			body: 'Mengerjakan semuanya <b>sebelum menjawab</b> bikin pengunjung nunggu kerjaan yang bahkan nggak perlu dia lihat.'
		},
		{
			title: 'Queue',
			body: '<b>Barisan tunggu buat kerjaan</b>. Tiap kerjaan lambat jadi tiket, namanya job.'
		},
		{
			title: 'Worker',
			body: 'Program terpisah yang <b>ngambil job satu per satu</b> dari antrean dan mengerjakannya di belakang layar.'
		},
		{
			title: 'Cara ingat',
			tag: 'Cara ingat',
			body: '<b>Jawab dulu, kerjakan belakangan.</b> Kasir terima pesanan, barista yang bikin.'
		},
		{
			title: 'Tambah worker',
			body: 'Beberapa worker <b>berbagi satu antrean</b>. Makin banyak worker, makin cepat antreannya kosong.'
		},
		{
			title: 'Antrean di router',
			tag: 'Catatan',
			body: 'Paket yang nunggu di router yang sibuk juga membentuk antrean. <b>Idenya sama</b>, tempatnya beda.'
		},
		{
			title: 'Jam sibuk',
			body: 'Tiap pengunjung tetap dapat <b>jawaban instan</b>. Yang tumbuh cuma antreannya, dan worker yang menghabiskannya.'
		}
	],
	product: 'Nimbus Cap',
	phone: { idle: 'Keranjang siap', waiting: 'Lagi diproses', done: 'Pesanan masuk' },
	waited: 'Nunggu {s} detik',
	decimal: ',',
	tasks: { save: 'Simpan pesanan', email: 'Email struk', pdf: 'PDF invoice' },
	fast: 'cepat',
	slow: 'lambat',
	queued: 'antre',
	backendLabel: 'Backend',
	queueLabel: 'Antrean',
	workerLabel: 'Worker',
	addBtn: 'Tambah worker',
	resetBtn: 'Balik ke satu worker'
};
