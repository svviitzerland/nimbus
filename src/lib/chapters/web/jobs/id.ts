import type { JobsText } from './types';

export const id: JobsText = {
	title: 'Queue dan background job',
	intro: [
		'Waktu kamu checkout di <b>nimbus.com</b>, kerjaan backend bukan cuma menyimpan pesanan. Dia juga ngirim email struk dan bikin PDF invoice. Dua kerjaan itu lambat, masing masing beberapa detik.',
		'Kalau backend mengerjakan semuanya dulu baru menjawab, kamu cuma bisa melototin roda yang muter terus. Banyak orang akhirnya nyerah dan menutup tab, dan toko kehilangan penjualan.',
		'Solusinya pakai <b>queue</b> (antrean), barisan tunggu buat kerjaan. Backend menyimpan pesanan, memasukkan kerjaan yang lambat ke antrean sebagai tiket kecil yang namanya <b>job</b>, lalu langsung menjawab kamu.',
		'Di belakang layar, ada program terpisah namanya <b>worker</b> yang mengambil job dari antrean satu per satu dan mengerjakannya di belakang. Emailmu tetap sampai, cuma telat beberapa detik, dan kamu nggak perlu menunggunya.',
		'[fyi] Kata yang sama, dunia yang beda. Router juga punya antrean, barisan paket yang nunggu giliran lewat jalur yang lagi sibuk. Lihat [[manajemen bandwidth|netlab/router-queue]].',
		'[ingat] Antrean menyimpan pekerjaan yang akan diproses worker. Server dapat membalas lebih awal untuk pekerjaan yang tidak harus selesai saat itu juga.',
		'Coba checkout sekali dengan antrean mati dan sekali dengan antrean nyala, terus lihat stopwatch di HP. Habis itu coba jam sibuk dan lihat apa efeknya kalau worker ditambah.'
	],
	reactions: {
		slow: 'Lama kan rasanya? Pengunjung harus nunggu email dan PDF, padahal dia nggak butuh dua duanya cuma buat tahu pesanannya sudah masuk.',
		fast: 'Pesanan masuk hampir seketika! Kerjaan yang lambat sekarang jadi tiket di antrean, dan worker lagi mengerjakannya sementara pengunjung sudah lanjut ngapain aja.',
		rush: 'Jam sibuk, banyak pesanan sekaligus. Tiap pengunjung tetap dapat jawaban instan, tapi antreannya tumbuh lebih cepat dari yang bisa dihabiskan satu worker.',
		workers:
			'Worker tambahan mengambil pekerjaan dari antrean yang sama. Pada simulasi ini, lebih banyak pekerjaan dapat diproses bersamaan.',
		drained:
			'Antrean kosong dan pekerjaan selesai. Sistem nyata perlu mengatur retry, penyimpanan antrean, dan pencegahan pemrosesan ganda.'
	},
	modeDirect: 'Tanpa antrean',
	modeQueue: 'Pakai antrean',
	checkout: 'Checkout',
	rush: 'Jam sibuk (5 pesanan)',
	workers: 'Worker',
	phone: { idle: 'Keranjang siap', waiting: 'Lagi diproses', done: 'Pesanan masuk' },
	waited: 'Nunggu {s} detik',
	jobs: { save: 'Simpan pesanan', email: 'Kirim email', pdf: 'Bikin PDF invoice' },
	serverLabel: 'Backend',
	queueLabel: 'Antrean',
	queueEmpty: 'Kosong',
	workerLabel: 'Worker',
	idle: 'nganggur',
	orderTag: 'pesanan {n}'
};
