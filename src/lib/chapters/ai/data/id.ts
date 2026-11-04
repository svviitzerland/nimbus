import type { DataText } from './types';

export const id: DataText = {
	title: 'Data dan dataset',
	intro: [
		'Semua AI yang pernah kamu temui belajar dari setumpuk contoh. Filter spam mempelajari email lama, face unlock mempelajari foto wajah. Contoh contoh itu namanya <b>data</b>. Lihat beberapa foto kucing berdatangan.',
		'Kalau contohnya dikumpulkan di satu tempat dan siap dipakai belajar, kumpulannya disebut <b>dataset</b>. Tiap contoh dikasih catatan kecil soal isinya. Catatan itu namanya <b>label</b>, jawaban yang kita mau mesinnya pelajari.',
		'Nah, masalahnya begini. <b>Model</b> (program yang belajar) percaya penuh pada setiap contoh. Ada yang melabeli anjing ini sebagai kucing, jadi model dengan senang hati belajar bahwa wajah anjing ini wajah kucing.',
		'[ingat] Orang bilang <b>garbage in, garbage out</b>, sampah masuk, sampah keluar. Masak pakai bahan basi, masakannya ya ikut basi, sejago apa pun kokinya. Model cuma sebagus contoh yang dia makan.',
		'Dataset di dunia nyata itu berantakan. Ada orang capek yang salah klik label, ada foto yang buram, ada foto yang kesimpan dua kali, dan ada satu foto yang labelnya kosong.',
		'Jadi sebelum belajar, datanya dibersihkan dulu. Pertama, label yang salah dibetulkan. Anjing itu bukan kucing.',
		'Lalu foto yang buram dibuang, soalnya nggak ada yang bisa lihat isinya. Fotokopiannya juga dibuang, biar satu foto nggak dihitung dua kali. Label yang kosong diisi.',
		'Barisnya jadi lebih sedikit, tapi sekarang semuanya bisa dipercaya. Membersihkan data kayak gini itu bagian besar dari kerjaan AI, sering lebih besar dari membuat modelnya.',
		'[fyi] Dataset itu beda dengan [[database|resilience/database]]. Database menyimpan data hidup yang dipakai aplikasi setiap hari, sedangkan dataset adalah kumpulan beku yang disusun khusus buat belajar (lucunya, sering diambil dari database juga).',
		'Mau lihat lagi? Bikin tabelnya berantakan, lalu biarkan dia bersih sendiri sekali lagi. Ini opsional kok.'
	],
	reactions: {
		messy:
			'Semua kekacauannya balik lagi, label salah, foto buram, foto dobel, dan label kosong. Model yang belajar dari ini bakal ikut mempelajari kesalahannya.',
		clean:
			'Bersih lagi! Fotonya sama, modelnya sama, cuma contohnya yang lebih baik. Berikutnya, kita lihat gimana mesin [[belajar dari contoh|ai/training]].'
	},
	panels: [
		{
			tag: 'Data',
			title: 'Contoh untuk belajar',
			body: '<b>Data</b> itu fakta apa pun yang dicatat, kayak foto, harga, atau klik. Buat AI, data adalah tumpukan contoh yang dia pelajari.'
		},
		{
			tag: 'Dataset',
			title: 'Contoh beserta label',
			body: '<b>Dataset</b> itu kumpulannya, sering berupa tabel besar. Tiap baris satu contoh, dan kolom <b>label</b> berisi jawaban yang benar.'
		},
		{
			tag: 'Masalahnya',
			title: 'Semua baris dipercaya',
			body: 'Model nggak bisa membedakan label salah dan label benar. Apa pun kata tabelnya, itu yang dia pelajari.'
		},
		{
			tag: 'Cara ingat',
			title: 'Sampah masuk, sampah keluar',
			body: 'Contoh jelek masuk, jawaban jelek keluar. Data yang bagus lebih penting dari model yang canggih.'
		},
		{
			tag: 'Berantakan',
			title: 'Empat masalah umum',
			body: 'Label salah, contoh buram atau rusak, data dobel, dan label kosong. Dataset sungguhan punya semuanya, sampai ribuan kali.'
		},
		{
			tag: 'Bersih bersih 1',
			title: 'Betulkan label salah',
			body: 'Ada orang yang mengecek label dan membetulkan yang salah.'
		},
		{
			tag: 'Bersih bersih 2',
			title: 'Buang dan lengkapi',
			body: 'Contoh yang nggak mengajarkan apa apa (yang buram, yang dobel) dibuang. Label kosong diisi, atau barisnya dihapus.'
		},
		{
			tag: 'Bersih',
			title: 'Siap dipelajari',
			body: 'Dataset kecil yang bersih lebih baik dari dataset besar yang berantakan. Sekarang model bisa belajar darinya.'
		},
		{
			tag: 'Omong omong',
			title: 'Dataset atau database',
			body: '<b>Database</b> itu hidup dan berubah sepanjang hari. <b>Dataset</b> itu potretnya, dibekukan supaya proses belajarnya bisa diulang dengan cara yang sama.'
		},
		{
			tag: 'Coba',
			title: 'Sekali lagi',
			body: 'Bikin berantakan, lalu lihat dia dibersihkan lagi langkah demi langkah.'
		}
	],
	sheetName: 'foto_kucing.csv',
	colPhoto: 'foto',
	colLabel: 'label',
	cat: 'kucing',
	notCat: 'bukan kucing',
	problems: {
		wrong: 'label salah',
		blurry: 'terlalu buram',
		copy: 'sama dengan baris 1',
		missing: 'tanpa label'
	},
	count: '{n} contoh',
	cleanCount: '{n} contoh bersih, siap dipelajari',
	rule: 'Sampah masuk, sampah keluar.',
	messBtn: 'Bikin berantakan lagi',
	cleanBtn: 'Bersihkan',
	pics: { cat: 'seekor kucing', dog: 'seekor anjing', blurry: 'foto buram' }
};
