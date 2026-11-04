import type { AiEthicsText } from './types';

export const id: AiEthicsText = {
	title: 'Etika AI',
	intro: [
		'Chatbot itu berguna buat menulis, menerjemahkan, dan menjelaskan PR yang susah. Tapi sebelum menekan kirim, ada baiknya tahu ke mana pesanmu pergi. Pesan itu meninggalkan HP-mu dan berjalan ke server penyedianya ([[AI lewat API|ai/ai-api]]).',
		'Di sana pesanmu biasanya <b>disimpan</b> untuk sementara. Staf bisa <b>membacanya</b> waktu memeriksa penyalahgunaan, dan dengan pengaturan tertentu pesanmu bahkan bisa ikut <b>melatih</b> model berikutnya. Jadi chatbot itu orang asing yang baik hati, bukan buku harian.',
		'[ingat] Tes baliho. Sebelum menempel apa pun, bayangkan tulisannya terpampang di baliho raksasa di pinggir jalan. Kalau nggak berani dipasang di baliho, jangan ditempel ke chatbot.',
		'Pesan pertama, pertanyaan soal artikel berita yang sudah publik. Di baliho, nggak ada yang pribadi. Kirim saja, ini memang keahlian chatbot.',
		'Kedua, minta tolong merapikan CV. Isi tulisannya boleh dibagikan, tapi nomor HP dan alamat rumah jangan. <b>Bersihkan dulu</b>, ganti bagian pribadinya, dan bantuannya tetap jalan.',
		'Ketiga, temanmu cerita sebuah rahasia. Itu bukan beritamu untuk dipasang di baliho mana pun, dan menghapus namanya nggak menolong kalau rahasianya justru isi pesannya. <b>Jangan kirim</b>.',
		'[fyi] Password, kode bank, dan secret key selalu tinggal di luar, nggak ada layanan asli yang memintanya lewat chat. Banyak chatbot juga punya pilihan untuk mematikan pelatihan di pengaturannya, coba cek deh.',
		'[fyi] Keadilan juga penting. Model belajar dari tulisan dan karya seni buatan orang sungguhan, jadi minta gaya umum seperti cat air itu wajar, tapi meniru persis gaya satu seniman yang masih hidup lalu menjualnya, di situlah jadi nggak adil.',
		'Kalau mau, ketuk salah satu pesan dan jalankan lagi tes balihonya. Ini opsional kok.'
	],
	reactions: {
		news: 'Nggak ada yang pribadi di situ, jadi langsung berangkat. Tapi ingat, jawabannya tetap bisa keliru di detailnya.',
		cv: 'Bot nggak butuh nomor HP atau alamatmu buat merapikan tulisan. Pengalamanmu berangkat, data pribadimu tetap di rumah.',
		friend:
			'Yang ini nggak pernah keluar dari HP-mu. Itu berita Rina untuk dia bagikan sendiri, bukan kamu, ke bot atau ke siapa pun.'
	},
	panels: [
		{
			tag: 'Ke mana',
			title: 'Berangkat ke penyedia',
			body: 'Pesan ke chatbot meninggalkan perangkatmu dan mendarat di <b>server penyedia</b>, jauh dari kamu.'
		},
		{
			tag: 'Di sana',
			title: 'Disimpan, dibaca, dipelajari',
			body: 'Pesanmu bisa <b>disimpan</b> sementara, <b>dibaca</b> staf yang memeriksa penyalahgunaan, atau dipakai untuk <b>melatih</b> model berikutnya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tes baliho',
			body: 'Bayangkan pesannya di papan raksasa pinggir jalan. Aman di sana berarti aman ditempel.'
		},
		{
			tag: 'Kirim',
			title: 'Nggak ada yang pribadi',
			body: 'Artikel publik nggak menyimpan rahasia. Tanya saja, tapi tetap cek ulang fakta yang penting.'
		},
		{
			tag: 'Bersihkan dulu',
			title: 'Ganti bagian pribadinya',
			body: 'Ganti nomor HP, alamat, dan nama dengan penanda. Bot cuma butuh bagian yang mau kamu minta tolong.'
		},
		{
			tag: 'Jangan kirim',
			title: 'Bukan hakmu membagikannya',
			body: 'Rahasia orang lain nggak masuk ke obrolan mana pun. Kalau rahasianya justru isi pesannya, dibersihkan pun nggak bisa.'
		},
		{
			tag: 'Rangkuman',
			title: 'Tiga pilihan',
			body: 'Kirim, bersihkan dulu, atau jangan kirim. Password dan key selalu masuk kelompok terakhir.'
		},
		{
			tag: 'Coba',
			title: 'Giliranmu',
			body: 'Ketuk satu pesan dan lihat tes balihonya berjalan lagi.'
		}
	],
	picture:
		'Baliho besar di pinggir jalan yang menampilkan sebuah pesan, HP yang mau mengirimnya, dan penyedia chatbot di ujung sambungan.',
	youLabel: 'kamu',
	providerLabel: 'penyedia chatbot',
	fates: ['disimpan', 'dibaca', 'dilatih'],
	billboardAsk: 'Berani dipasang di sini?',
	messages: [
		{
			id: 'news',
			label: 'Artikel berita',
			lines: [
				[{ t: 'Tolong jelaskan artikel berita' }],
				[{ t: 'soal panel surya ini pakai' }],
				[{ t: 'bahasa yang gampang, ya.' }]
			]
		},
		{
			id: 'cv',
			label: 'CV-ku',
			lines: [
				[{ t: 'Tolong bikin CV-ku lebih menarik.' }],
				[{ t: 'HP ' }, { t: '0812 3456 7890', secret: true }],
				[{ t: 'Alamat ' }, { t: 'Jl. Melati 5, Bandung', secret: true }],
				[{ t: 'Keahlian, desain dan kerja tim.' }]
			]
		},
		{
			id: 'friend',
			label: 'Rahasia teman',
			lines: [
				[{ t: 'Rina cerita diam diam kalau dia', secret: true }],
				[{ t: 'mau pindah ke luar negeri.', secret: true }],
				[{ t: 'Buatkan postingan biar semua tahu.' }]
			]
		}
	],
	removed: '[dihapus]',
	verdicts: { send: 'Kirim', clean: 'Bersihkan dulu', keep: 'Jangan kirim' },
	rule: 'Nggak berani di baliho? Jangan ke chatbot'
};
