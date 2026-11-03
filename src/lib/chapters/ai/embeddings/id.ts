import type { EmbeddingsText } from './types';

export const id: EmbeddingsText = {
	title: 'Embedding',
	intro: [
		'Komputer nggak bisa merasakan arti sebuah kata. Buat dia, "kucing" dan "anak kucing" cuma susunan huruf yang beda. Terus gimana AI bisa tahu keduanya hampir sama?',
		'Caranya, tiap kata diubah jadi deretan angka yang disebut <b>embedding</b> (atau vektor). Anggap saja angka angka itu koordinat, alamat di sebuah peta makna yang raksasa.',
		'Model mempelajari alamat itu dari miliaran kalimat. Kata yang sering muncul di kalimat yang mirip dapat angka yang mirip, jadi letaknya <b>berdekatan</b>. "Kucing" tinggal di sebelah "anjing", jauh dari "server".',
		'[fyi] Embedding asli punya ratusan sampai ribuan angka per kata, bukan cuma dua, jadi peta aslinya mustahil digambar. Petaku di sini sudah dipadatkan jadi dua angka biar muat di layarmu.',
		'[fyi] Trik terkenalnya begini, ambil posisi "raja", kurangi "pria", tambah "wanita", dan kamu mendarat persis di dekat "ratu". Arah di peta ternyata juga punya makna.',
		'Masih ada empat kata di rak. Seret masing masing ke tempatnya di peta (atau ketuk lalu pakai tombol panah). Garisnya menunjukkan tetangga terdekat, dan kalau kamu ketuk kata mana pun, angkanya muncul.'
	],
	reactions: {
		select:
			'Dua angka itu adalah embedding kata ini, alamatnya di peta. Garisnya menunjuk ke tetangga terdekat, yaitu kata yang menurut AI artinya mirip.',
		wrong:
			'Hmm, coba lihat tetangga terdekatnya di situ. Memangnya artinya mirip sama kata kata itu? Geser ke dekat kata yang terasa nyambung.',
		puppy:
			'Betul, anak anjing masuk ke kelompok hewan! Dia duduk dekat anjing dan kucing, karena kalimat soal anak anjing kedengarannya mirip banget sama kalimat soal anjing.',
		queen:
			'Pas di pojok kerajaan. Raja, ratu, dan pangeran muncul di kalimat yang mirip (mahkota, takhta, istana), jadi angkanya berdekatan.',
		noodles:
			'Mie ke kelompok makanan, jelas. Di peta asli dia bakal lebih dekat ke sup daripada ke roti (sama sama berkuah), karena embedding menangkap nuansa makna, bukan cuma kelompoknya.',
		nimbus:
			'nimbus.com mendarat bareng server, cloud, dan situs web. AI nya belum pernah dengar situsmu, tapi dari kata kata di sekitarnya, dia tetap bisa menebak ini benda jenis apa.',
		all: 'Semua kata sudah ketemu lingkungannya! Begini cara kerja pencarian AI. Ubah pertanyaanmu jadi angka, lalu ambil dokumen yang paling dekat. Ide ini yang menggerakkan [[RAG|ai/rag]], materi berikutnya.'
	},
	words: {
		cat: 'kucing',
		dog: 'anjing',
		rabbit: 'kelinci',
		puppy: 'anak anjing',
		king: 'raja',
		prince: 'pangeran',
		palace: 'istana',
		queen: 'ratu',
		rice: 'nasi',
		bread: 'roti',
		soup: 'sup',
		noodles: 'mie',
		server: 'server',
		cloud: 'cloud',
		website: 'situs web',
		nimbus: 'nimbus.com'
	},
	shelf: 'Seret kata ini ke peta',
	pickHint: 'Ketuk kata mana saja buat lihat angkanya dan tetangga terdekatnya',
	nearTitle: 'Paling dekat ke {word}',
	vectorLabel: '{word} dalam angka',
	closeness: '{n}% dekat',
	placed: '{n} dari 4 sudah ditempatkan',
	mapLabel: 'Peta makna kata'
};
