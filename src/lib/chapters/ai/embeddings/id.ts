import type { EmbeddingsText } from './types';

export const id: EmbeddingsText = {
	title: 'Embedding',
	intro: [
		'Komputer nggak bisa merasakan arti sebuah kata. Buat dia, "kucing" dan "anjing" cuma susunan huruf, nggak lebih dekat satu sama lain dibanding ke "server". Terus gimana AI bisa tahu kalau kucing dan anjing sama sama hewan peliharaan, sedangkan server itu hal yang beda banget?',
		'Caranya, tiap kata diubah jadi deretan angka yang disebut <b>embedding</b>. Anggap saja angka angka itu alamat, satu titik di sebuah peta makna yang raksasa.',
		'Model mempelajari alamat itu dengan membaca miliaran kalimat. Kata yang sering muncul di kalimat yang mirip dapat angka yang mirip, jadi letaknya <b>berdekatan</b>. Lihat mereka mencari tempatnya masing masing.',
		'Sekarang jarak punya arti. Kucing duduk persis di sebelah anak kucing dan anjing, dan jauh dari server. Komputer cukup mengukur seberapa jauh dua titik, nggak perlu perasaan.',
		'Begini cara AI mencari berdasarkan makna. Ketik "hewan berbulu", ubah juga jadi angka, lalu jatuhkan ke peta. Kata yang paling dekat menang, walaupun nggak ada satu pun yang mengandung huruf "hewan berbulu". Ide ini yang menggerakkan [[RAG|ai/rag]], materi berikutnya.',
		'[ingat] Peta makna itu kayak supermarket. Barang yang sejenis ditaruh di lorong yang sama, jadi begitu ketemu satu, yang lain ada di dekatnya. Dekat di peta, dekat juga artinya.',
		'[fyi] Embedding asli punya ratusan sampai ribuan angka, bukan cuma dua, jadi peta aslinya mustahil digambar. Petaku di sini sudah dipadatkan jadi dua angka biar muat di layarmu. Idenya tetap sama persis.',
		'Mau menaruh beberapa kata baru? Jatuhkan satu dan lihat dia mendarat di lorong mana. Ini opsional kok.'
	],
	reactions: {
		puppy:
			'Anak anjing mendarat di kelompok hewan, persis dekat anjing dan kucing. Kalimat soal anak anjing kedengarannya mirip banget sama kalimat soal anjing, jadi angkanya berdekatan.',
		queen:
			'Langsung ke lorong kerajaan. Raja, ratu, dan pangeran muncul di kalimat yang mirip (mahkota, singgasana, istana), jadi angkanya berkumpul.',
		noodles:
			'Mie gabung ke makanan, nempel dekat sup. Embedding bisa menangkap nuansa makna, dan dua duanya sama sama berkuah.',
		nimbus:
			'nimbus.com mendarat bareng server, cloud, dan situs web. AI ini belum pernah dengar soal situsmu, tapi dari kata kata di sekitarnya, dia tetap bisa menebak ini benda jenis apa.'
	},
	panels: [
		{
			tag: 'Masalahnya',
			title: 'Cuma huruf',
			body: 'Buat komputer, kata cuma deretan huruf. Nggak ada apa pun di hurufnya yang bilang kucing dan anjing sama sama hewan peliharaan.'
		},
		{
			tag: 'Embedding',
			title: 'Kata jadi angka',
			body: 'Tiap kata dapat deretan angka, yaitu <b>embedding</b> kata itu. Di sini tiap kata punya dua angka, jadi bisa dipakai kayak alamat di peta.'
		},
		{
			tag: 'Belajar',
			title: 'Kata yang mirip berkumpul',
			body: 'Kata yang dipakai di kalimat mirip dapat angka yang mirip. Hewan berkumpul di satu pojok, makanan di pojok lain, teknologi di pojok ketiga.'
		},
		{
			tag: 'Jarak',
			title: 'Dekat berarti mirip',
			body: 'Garis pendek menghubungkan kucing ke tetangga terdekatnya. Garis yang panjang sampai ke server, yang artinya beda jauh.'
		},
		{
			tag: 'Pencarian',
			title: 'Cari lewat makna',
			body: 'Pertanyaannya juga diubah jadi angka. Apa pun yang paling dekat dengannya adalah jawaban yang paling cocok, walau hurufnya beda semua.'
		},
		{
			tag: 'Biar nempel',
			title: 'Supermarket kata',
			body: 'Yang sejenis satu lorong. Dekat di peta berarti dekat juga artinya.'
		},
		{
			tag: 'Ukuran asli',
			title: 'Angkanya jauh lebih banyak',
			body: 'Embedding asli pakai ratusan sampai ribuan angka per kata. Makin banyak angka, makin banyak ruang buat nuansa makna.'
		},
		{
			tag: 'Coba',
			title: 'Jatuhkan kata baru',
			body: 'Tiap kata baru mendarat di tempat yang cocok dengan artinya. Garisnya menunjukkan tetangga terdekatnya.'
		}
	],
	mapLabel: 'Peta makna kata, kata yang mirip letaknya berdekatan',
	words: {
		cat: 'kucing',
		kitten: 'anak kucing',
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
	regions: { animals: 'Hewan', royals: 'Kerajaan', food: 'Makanan', tech: 'Teknologi' },
	far: 'jauh',
	query: 'hewan berbulu',
	searchLabel: 'cari',
	manyLabel: '{word} dalam angka',
	manyCount: 'dan seterusnya, total {n} angka',
	rule: 'Dekat di peta, dekat juga artinya',
	dropBtn: 'Jatuhkan kata baru',
	againBtn: 'Ulang dari awal'
};
