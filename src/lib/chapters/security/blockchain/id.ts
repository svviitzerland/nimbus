import type { BlockchainText } from './types';

export const id: BlockchainText = {
	title: 'Apa itu blockchain',
	intro: [
		'<b>Blockchain</b> menyimpan catatan dalam blok yang saling terhubung dengan hash. Beberapa komputer dapat memegang salinannya, dan aturan konsensus menentukan riwayat mana yang diterima.',
		'Tiap halaman disebut <b>blok</b>, isinya beberapa catatan. Setiap blok juga menyimpan <b>sidik jari</b> (hash, seperti di [[tanda tangan digital|security/signature]]) dari blok sebelumnya. Ubah apa pun di dalam blok, sidik jarinya ikut berubah total.',
		'Jadi blok blok itu saling bergantung seperti mata rantai. Ubah blok lama, maka sidik jari yang disimpan blok berikutnya jadi nggak cocok, mata rantainya putus, begitu juga semua mata rantai setelahnya.',
		'Menyambung catatan pakai hash itu lebih tua dari yang kamu kira. Tahun 1991, Stuart Haber dan W. Scott Stornetta memakainya untuk memberi cap waktu pada dokumen supaya nggak bisa dimundurkan tanggalnya. Tahun 2008, seseorang yang menyebut dirinya <b>Satoshi Nakamoto</b> menggabungkannya dengan trik lain jadi <b>Bitcoin</b>, yang mulai jalan Januari 2009. Siapa Satoshi sebenarnya sampai sekarang belum diketahui.',
		'Di Bitcoin, ribuan komputer masing masing menyimpan salinan lengkap. Sebelum boleh menambah blok, sebuah komputer harus menghabiskan banyak kerja komputasi (namanya <b>mining</b>, atau proof of work). Menulis ulang sejarah berarti mengulang semua kerja itu lebih cepat dari gabungan semua komputer lain.',
		'[fyi] Trik yang sama, dunia yang beda. [[Git|compute/version-control]] menyambung tiap commit ke sidik jari commit sebelumnya, jadi commit lama yang diubah diam diam juga langsung ketahuan. Bedanya, Git nggak punya koin dan nggak ada mining.',
		'Blockchain menambah biaya koordinasi dan penyimpanan dibanding banyak rancangan database terpusat. Pilih sesuai kebutuhan, misalnya siapa yang boleh menulis, siapa yang memverifikasi, dan apakah satu pengelola dipercaya.',
		'[ingat] <b>Hash menghubungkan blok, konsensus memilih riwayat.</b> Mengubah isi blok memerlukan penghitungan ulang hash. Agar diterima jaringan, rantainya juga harus memenuhi aturan konsensus.',
		'Ini rantai kecil berisi empat blok, plus empat komputer yang menyimpan salinannya. Ubah sesuatu di blok lama, misalnya jumlahnya, lalu lihat apa yang terjadi pada sisanya.'
	],
	reactions: {
		broken:
			'Rantainya putus. Editanmu mengubah sidik jari blok itu, tapi blok berikutnya masih ingat yang lama. Mata rantainya lepas, dan semua blok setelahnya nggak bisa dipercaya lagi.',
		tip: 'Kamu mengubah blok paling baru, jadi belum ada blok setelahnya yang sadar. Tapi lihat komputer lain, sidik jari terakhir mereka beda dengan punyamu. Sekarang coba blok yang lebih lama.',
		restored:
			'Kembali ke tulisan aslinya, dan semua mata rantai pas lagi. Sidik jari cuma peduli pada isi yang persis sama.',
		rehash:
			'Hash di salinanmu sudah dihitung ulang, tetapi isinya berbeda dari salinan jaringan. Contoh ini menunjukkan perbedaan salinan, bukan voting konsensus. Pada Bitcoin, node memeriksa aturan dan memilih rantai valid dengan akumulasi proof of work terbesar.',
		synced:
			'Kamu mengambil salinan yang disepakati semua orang. Komputer baru yang bergabung ke jaringan juga begitu, dia mengunduh rantainya lalu memeriksa setiap mata rantai sendiri.'
	},
	blockLabel: 'Blok {n}',
	records: [
		'Ana bayar Budi 5 koin',
		'Budi bayar Citra 2 koin',
		'Citra bayar Dodi 1 koin',
		'Dodi bayar Ana 3 koin'
	],
	prevLabel: 'sebelumnya',
	hashLabel: 'sidik jari',
	editHint: 'Ketuk sebuah blok lalu ubah tulisannya',
	brokenTag: 'rantai putus',
	changedTag: 'diubah',
	rehashBtn: 'Hitung ulang semua sidik jari di salinanku',
	syncBtn: 'Ambil salinan jaringan',
	networkLabel: 'Salinan di komputer lain',
	yourCopy: 'Salinanmu',
	computer: 'Komputer {n}',
	agree: 'cocok',
	disagree: 'beda',
	shortNote: 'Sidik jari di sini dipotong jadi 8 karakter, yang asli di Bitcoin panjangnya 64.'
};
