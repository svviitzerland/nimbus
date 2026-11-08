import type { UiUxText } from './types';

export const id: UiUxText = {
	title: 'UI dan UX',
	intro: [
		'Coba ingat aplikasi favoritmu. Sebagian alasan kamu suka adalah <b>tampilannya</b>, dan sebagian lagi karena <b>gampang</b> dipakai buat menyelesaikan sesuatu. Dua hal itu beda pekerjaan, dan namanya juga beda.',
		'<b>UI</b> singkatan dari user interface (antarmuka pengguna). Isinya semua yang kamu lihat dan sentuh, warna, huruf, tombol, jarak antar elemen. Kalau aplikasi itu mobil, UI itu cat, jok, dan dasbornya.',
		'<b>UX</b> singkatan dari user experience (pengalaman pengguna). Ini soal gimana rasanya waktu benar benar dipakai. Tombol yang kamu cari gampang ketemu nggak? Hasilnya sesuai harapan nggak? Kamu selesai tanpa kesel nggak? Di mobil tadi, UX itu rasanya waktu menyetir.',
		'[fyi] UX bukan cuma soal layar. Pernah narik pintu yang ternyata harus didorong? Orang menyebutnya "pintu Norman", dari nama Don Norman, desainer yang mempopulerkan istilah user experience di tahun 1990an.',
		'Halaman yang cantik bisa tetap nyebelin dipakai, dan halaman yang polos bisa terasa enak banget. Produk yang bagus butuh dua duanya, dan di [[pelajaran berikutnya|web/design-to-code]] kamu bakal lihat gimana desain berubah jadi [[CSS|web/css]] beneran.',
		'[ingat] <b>UI adalah antarmuka, UX adalah pengalaman menggunakannya.</b> Label tombol, urutan langkah, kejelasan harga, dan respons sistem sama sama memengaruhi pengalaman.',
		'Ini dua toko nimbus.com yang tampilannya hampir sama. Tugasmu gampang, beli satu mug Nim di tiap toko. Hitung berapa kali kamu ngetap, dan rasakan bedanya.'
	],
	reactions: {
		trap: 'Pesanan dibatalkan. Tombol dan pertanyaan yang kurang jelas membuat tindakan mudah tertukar. Pilihan UI tersebut berdampak pada UX.',
		paidA:
			'Mugnya dapat, tapi lama ya, terus tiba tiba ada biaya tambahan muncul di akhir. Nggak ada yang suka kayak gitu. Sekarang coba toko satunya.',
		paidB:
			'Sekali tap, dan kamu udah tahu harga totalnya sebelum bayar. Toko satunya masih nunggu, coba juga ya.',
		both: 'Kedua toko memakai warna dan produk yang sama, tetapi alur pembayaran berbeda. Label, jumlah langkah, dan waktu harga ditampilkan memengaruhi kemudahan penggunaan.',
		why: '[fyi] Toko yang menyembunyikan biaya sampai langkah terakhir kehilangan banyak pembeli. Biaya kejutan termasuk alasan paling umum orang meninggalkan keranjang belanja online.'
	},
	task: 'Beli satu mug Nim',
	shopA: 'Toko A',
	shopB: 'Toko B',
	product: 'Mug Nim',
	money: 'Rp{n}rb',
	qty: '1 buah',
	shipping: 'Ongkir',
	total: 'Total',
	a: {
		cancel: 'Batal',
		next: 'Proses',
		confirmQ: 'Apakah kamu ingin membatalkan pesanan?',
		yes: 'Ya',
		no: 'Tidak',
		feeNote: 'Ada biaya penanganan yang ditambahkan',
		pay: 'Kirim'
	},
	b: { pay: 'Bayar {total}', free: 'Gratis ongkir, nggak ada biaya lain', back: 'Lanjut belanja' },
	cancelled: 'Pesanan dibatalkan',
	paid: 'Mug sedang dikirim',
	again: 'Coba lagi',
	taps: '{n} tap',
	whyBtn: 'Apa yang bikin beda?',
	whyLabel: 'Perbedaan alur pembelian',
	whyPoints: [
		'Toko A punya dua tombol yang kelihatan sama, Toko B punya satu tombol utama yang jelas.',
		'Toko A bilang "Proses" dan "Kirim", Toko B bilang persis apa yang terjadi, "Bayar Rp12rb".',
		'Toko A nanya pertanyaan membingungkan, di mana "Tidak" justru berarti lanjut.',
		'Toko A menyembunyikan biaya sampai akhir, Toko B menunjukkan harga lengkap dari awal.'
	]
};
