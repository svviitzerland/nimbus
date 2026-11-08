import type { AiEthicsText } from './types';

export const id: AiEthicsText = {
	title: 'Etika AI',
	intro: [
		'Chatbot itu berguna buat banyak hal. Menulis, menerjemahkan, menjelaskan soal PR yang bikin pusing. Tapi sebelum kamu tekan kirim, ada baiknya tahu pesanmu sebenarnya pergi ke mana.',
		'Pada layanan AI melalui internet, pesan dikirim ke server penyedia. Aturan penyimpanan, akses petugas, dan penggunaan untuk pelatihan berbeda menurut produk, kontrak, serta pengaturan. Periksa aturan layanan yang dipakai.',
		'Artinya ada beberapa hal yang terlarang. <b>Password</b> dan <b>kunci rahasia</b>, <b>kabar pribadi</b> orang lain, dan apa pun yang menurut sekolah atau kantormu nggak boleh keluar. Seringnya kamu tetap bisa dapat bantuan, asal bagian pribadinya dibersihkan dulu.',
		'Perhatikan juga materi milik orang lain. Saat membuat karya, tentukan unsur visual yang kamu inginkan, seperti warna, medium, dan komposisi, serta hormati izin penggunaan bahan rujukannya.',
		'[fyi] Menonaktifkan penggunaan data untuk pelatihan tidak otomatis berarti pesan tidak disimpan. Retensi dan pelatihan adalah dua pengaturan yang perlu diperiksa terpisah.',
		'[ingat] <b>Tujuan, data, izin.</b> Kirim hanya informasi yang diperlukan untuk tugas, periksa izin berbagi, dan hapus rahasia yang tidak dibutuhkan.',
		'Ada enam pesan yang mau dikirim seseorang. Untuk tiap pesan, putuskan apakah dikirim apa adanya, dibersihkan dulu, atau nggak usah dikirim ke chatbot.'
	],
	reactions: {
		news: 'Pesan ini meminta penjelasan artikel publik tanpa memasukkan informasi pribadi. Periksa hasil ringkasan terhadap artikel aslinya.',
		news_wrong:
			'Pada contoh ini tidak ada rahasia yang perlu dibersihkan. Kamu bisa meminta penjelasan dan memeriksa hasilnya terhadap sumber.',
		cv: 'Bersih banget. Bot nggak butuh nomor HP atau alamat rumahmu untuk merapikan tulisan. Pengalamanmu tetap ada, data pribadimu tetap di rumah.',
		cv_wrong:
			'Hmm, minta bantuannya sih nggak masalah, tapi lihat nomor HP dan alamat rumahnya. Bot nggak butuh itu untuk memperbaiki CV kamu. Coba simpan bagian yang berguna dan buang yang pribadi.',
		key: 'API key memberikan akses ke layanan. Ganti dengan placeholder sebelum membagikan contoh kode. Jika kunci asli terlanjur bocor, cabut dan buat penggantinya.',
		key_wrong:
			'Coba lihat lagi kodenya, ada kunci rahasia di situ. Kalau ditempel begitu saja, kuncinya sekarang tinggal di server orang lain. Tapi bantuannya nggak harus dibuang juga, bug itu tetap masuk akal tanpa kuncinya.',
		friend:
			'Betul. Ini bukan kabar kamu untuk disebarkan, nggak ke chatbot dan nggak ke grup. Menghapus namanya juga nggak menolong, karena inti pesannya justru rahasia itu.',
		friend_wrong:
			'Eh, Rina cerita itu secara rahasia. Mau dibagikan atau nggak, ke bot atau siapa pun, itu keputusan dia, bukan kamu. Membersihkan nama nggak membantu kalau rahasianya adalah isi pesannya.',
		art: 'Prompt sekarang menyebut medium cat air dan suasana visual yang diinginkan. Deskripsi unsur visual membantu membuat arahan yang jelas.',
		art_wrong:
			'Coba tulis unsur visual yang kamu perlukan, seperti cat air, warna lembut, atau komposisi, agar arahan tidak bergantung pada menyalin satu kreator.',
		bank: 'Tepat. Chatbot mana pun nggak pernah butuh password bank kamu, dan layanan asli nggak akan menyuruhmu menempelnya di chat. Cek transaksi di aplikasi bank kamu sendiri.',
		bank_wrong:
			'Hati hati, itu password bank kamu! Jangan pernah ditempel ke chatbot, mau namanya dibersihkan pun bot nggak berhak memegangnya. Yang ini sama sekali nggak usah dikirim.',
		done: 'Enam kasus selesai. Bedakan data yang diperlukan, informasi yang harus dibersihkan, dan rahasia yang tidak boleh dibagikan tanpa izin.'
	},
	choices: { send: 'Kirim apa adanya', clean: 'Bersihkan dulu', keep: 'Jangan dikirim' },
	cases: [
		{
			id: 'news',
			context: 'Bantuan PR',
			draft:
				'Jelaskan artikel berita publik tentang jalur kereta baru ini dengan bahasa sederhana.',
			secrets: [],
			cleaned: ''
		},
		{
			id: 'cv',
			context: 'CV kamu sendiri',
			draft:
				'Bikin CV aku terdengar lebih profesional. Budi Santoso, HP 0812 3456 7890, Jl. Melati 12 Bandung. Dua tahun jadi junior web developer di nimbus.com.',
			secrets: ['HP 0812 3456 7890', 'Jl. Melati 12 Bandung'],
			cleaned:
				'Bikin CV aku terdengar lebih profesional. Budi Santoso, [HP dihapus], [alamat dihapus]. Dua tahun jadi junior web developer di nimbus.com.'
		},
		{
			id: 'key',
			context: 'Proyek iseng kamu',
			draft: "Kenapa ini crash? const API_KEY = 'sk_nimbus_8f3a91c2'; fetch(url, API_KEY)",
			secrets: ["'sk_nimbus_8f3a91c2'"],
			cleaned: "Kenapa ini crash? const API_KEY = '[kunci dihapus]'; fetch(url, API_KEY)"
		},
		{
			id: 'friend',
			context: 'Rahasia teman',
			draft:
				'Temanku Rina cerita diam diam kalau dia hamil. Tuliskan pesan seru untuk mengumumkannya di grup chat kami.',
			secrets: ['cerita diam diam kalau dia hamil'],
			cleaned: ''
		},
		{
			id: 'art',
			context: 'Cetakan untuk dijual',
			draft:
				'Gambar Nim persis dengan gaya ilustrator favoritku yang masih hidup, biar cetakannya bisa aku jual.',
			secrets: ['persis dengan gaya ilustrator favoritku yang masih hidup'],
			cleaned: 'Gambar Nim dengan gaya cat air yang lembut, biar cetakannya bisa aku jual.'
		},
		{
			id: 'bank',
			context: 'Rekening bank kamu',
			draft:
				'Ini login bank aku, username budi88 dan password Melati!2024. Cek transaksi terakhirku, ada yang aneh nggak.',
			secrets: ['username budi88', 'password Melati!2024'],
			cleaned: ''
		}
	],
	composerLabel: 'Pesan ke chatbot',
	progress: '{n} dari {total}',
	nextBtn: 'Pesan berikutnya',
	finishBtn: 'Selesaikan',
	sentTag: 'terkirim',
	cleanedTag: 'dibersihkan, lalu dikirim',
	keptTag: 'nggak dikirim',
	doneNote: 'Keenamnya sudah diputuskan',
	journey: [
		'Perangkatmu',
		'Server penyedia',
		'Retensi sesuai layanan',
		'Pelatihan sesuai ketentuan'
	]
};
