import type { AiEthicsText } from './types';

export const id: AiEthicsText = {
	title: 'Etika AI',
	intro: [
		'Chatbot itu berguna buat banyak hal. Menulis, menerjemahkan, menjelaskan soal PR yang bikin pusing. Tapi sebelum kamu tekan kirim, ada baiknya tahu pesanmu sebenarnya pergi ke mana.',
		'Apa yang kamu ketik dikirim ke server penyedianya ([[AI lewat API|ai/ai-api]]). Biasanya pesan itu <b>disimpan</b> untuk sementara, bisa dibaca petugas yang mengecek penyalahgunaan, dan dengan pengaturan tertentu bahkan bisa dipakai untuk <b>melatih</b> model berikutnya. Jadi anggap chatbot itu orang asing yang baik hati, bukan buku harian.',
		'Artinya ada beberapa hal yang terlarang. <b>Password</b> dan <b>kunci rahasia</b>, <b>kabar pribadi</b> orang lain, dan apa pun yang menurut sekolah atau kantormu nggak boleh keluar. Seringnya kamu tetap bisa dapat bantuan, asal bagian pribadinya dibersihkan dulu.',
		'Lalu ada soal siapa pemilik hasil karya AI. Model belajar dari tumpukan tulisan dan karya seni buatan orang sungguhan, dan pengadilan di berbagai negara masih berdebat soal apa yang adil. Meniru persis gaya seniman yang masih hidup untuk dijual, di situ mulai sensitif.',
		'[fyi] Semua ini bukan berarti AI itu jahat. Banyak perusahaan memakai versi privat yang nggak menyimpan apa pun dan nggak dipakai untuk melatih, dan kebanyakan chatbot bisa dimatikan fitur pelatihannya di pengaturan. Justru karena tahu cara kerjanya, kamu bisa memakainya dengan baik.',
		'Ada enam pesan yang mau dikirim seseorang. Untuk tiap pesan, putuskan apakah dikirim apa adanya, dibersihkan dulu, atau nggak usah dikirim ke chatbot.'
	],
	reactions: {
		news: 'Gampang. Artikel publik nggak menyimpan rahasia apa pun, jadi minta chatbot menjelaskannya memang keahliannya. Cuma ingat, dia tetap bisa salah soal detail.',
		news_wrong:
			'Yang ini santai aja. Artikelnya sudah publik, nggak ada yang rahasia. Minta bot menjelaskannya itu aman banget.',
		cv: 'Bersih banget. Bot nggak butuh nomor HP atau alamat rumahmu untuk merapikan tulisan. Pengalamanmu tetap ada, data pribadimu tetap di rumah.',
		cv_wrong:
			'Hmm, minta bantuannya sih nggak masalah, tapi lihat nomor HP dan alamat rumahnya. Bot nggak butuh itu untuk memperbaiki CV kamu. Coba simpan bagian yang berguna dan buang yang pribadi.',
		key: 'Mantap. API key itu seperti password akunmu, dan sekali tersimpan di server orang lain, kamu nggak bisa menariknya kembali. Bug itu tetap bisa dilihat tanpa rahasianya.',
		key_wrong:
			'Coba lihat lagi kodenya, ada kunci rahasia di situ. Kalau ditempel begitu saja, kuncinya sekarang tinggal di server orang lain. Tapi bantuannya nggak harus dibuang juga, bug itu tetap masuk akal tanpa kuncinya.',
		friend:
			'Betul. Ini bukan kabar kamu untuk disebarkan, nggak ke chatbot dan nggak ke grup. Menghapus namanya juga nggak menolong, karena inti pesannya justru rahasia itu.',
		friend_wrong:
			'Eh, Rina cerita itu secara rahasia. Mau dibagikan atau nggak, ke bot atau siapa pun, itu keputusan dia, bukan kamu. Membersihkan nama nggak membantu kalau rahasianya adalah isi pesannya.',
		art: 'Pinter. Minta gaya umum seperti cat air itu aman, tapi meniru tampilan satu seniman yang masih hidup untuk dijual tanpa dia, di situlah AI jadi nggak adil buat kreator sungguhan.',
		art_wrong:
			'Yang ini di tengah tengah. Bikin gambar Nim pakai AI itu boleh, tapi meniru persis gaya seniman yang masih hidup untuk dijual sama saja mengambil hasil kerjanya. Coba minta gaya yang umum saja.',
		bank: 'Tepat. Chatbot mana pun nggak pernah butuh password bank kamu, dan layanan asli nggak akan menyuruhmu menempelnya di chat. Cek transaksi di aplikasi bank kamu sendiri.',
		bank_wrong:
			'Hati hati, itu password bank kamu! Jangan pernah ditempel ke chatbot, mau namanya dibersihkan pun bot nggak berhak memegangnya. Yang ini sama sekali nggak usah dikirim.',
		done: 'Enam dari enam! Patokannya sederhana. Kalau kamu nggak mau meneriakkannya di tengah kafe, jangan ditempel ke chatbot. Bersihkan yang pribadi, hargai kreator sungguhan, dan AI jadi teman yang sangat membantu.'
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
	journey: ['Perangkatmu', 'Server penyedia', 'Disimpan sementara', 'Mungkin dilatih']
};
