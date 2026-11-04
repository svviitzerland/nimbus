import type { VisionText } from './types';

export const id: VisionText = {
	title: 'Computer vision',
	intro: [
		'Lihat gambar ini. Kamu langsung tahu itu kucing dalam sekejap, bahkan tanpa mikir. Tapi gimana caranya komputer bisa tahu juga?',
		'Komputer nggak melihat kucing. Yang dia lihat cuma kotak kotak kecil berjejer yang disebut <b>piksel</b>, dan tiap piksel cuma sebuah angka, seberapa gelap atau terangnya. Sebuah foto itu jutaan angka, nggak lebih.',
		'<b>Computer vision</b> adalah bagian dari AI yang memahami gambar. Cara kerjanya berlapis, mirip [[neural network|ai/neural-net]] yang ditumpuk berkali kali, dan tiap lapis membangun dari temuan lapis di bawahnya.',
		'Lapis pertama cuma mencari <b>tepi</b> (edge), tempat gelap ketemu terang. Ada yang datar, ada yang tegak, ada yang miring. Lihat gambarnya pecah jadi goresan kecil dengan sendirinya.',
		'Lapis berikutnya menyambung tepi tepi itu jadi <b>bentuk</b>. Dua garis miring yang ketemu di ujung jadi telinga lancip, lingkaran tepi jadi wajah bulat, garis pendek datar jadi kumis.',
		'Lapis terakhir melihat bentuk apa saja yang muncul bareng. Telinga lancip, wajah bulat, dan kumis? Itu <b>kucing</b>. Keluarlah jawabannya.',
		'[ingat] Gampangnya, <b>garis jadi bentuk, bentuk jadi benda</b>. Dari kecil ke besar, lapis demi lapis, kayak nyusun Lego.',
		'Nah, bagian yang bikin kaget. Nggak ada yang menyuruh lapisannya mencari telinga lancip. Selama latihan (pakai langkah turun bukit [[gradient descent|ai/learning-loop]] yang sama) modelnya menemukan sendiri tepi dan bentuk mana yang penting, setelah melihat jutaan foto berlabel.',
		'[fyi] HP yang kebuka pakai wajahmu, aplikasi yang bisa membaca tulisan di menu, mobil yang melihat orang menyeberang, sampai alat yang membantu dokter membaca hasil rontgen, semuanya menumpuk lapisan persis kayak gini.',
		'Mau lihat lagi? Ganti gambarnya dan lihat lapisan lapisannya membongkar gambar itu sendiri. Opsional kok.'
	],
	reactions: {
		cat: 'Balik ke kucing. Langkahnya selalu sama, tepi dulu, lalu bentuk, baru jawabannya.',
		fish: 'Ikan! Tepinya beda, ada badan lonjong dan ekor lancip, jadi lapis terakhir sampai ke jawaban yang lain.',
		house:
			'Rumah. Tepi tegak yang lurus jadi dinding kotak, dua garis miring jadi atap. Lapisannya sama sekali nggak berubah, cuma gambarnya yang ganti.'
	},
	panels: [
		{
			tag: 'Gambar',
			title: 'Gampang buat kamu',
			body: 'Mata dan otakmu langsung mengenali kucingnya. Komputer harus membangun jawaban itu dari nol.'
		},
		{
			tag: 'Piksel',
			title: 'Kotak kotak berisi angka',
			body: 'Tiap kotak adalah satu <b>piksel</b>. Piksel gelap angkanya besar, yang kosong angkanya nol. Cuma itu yang diterima komputer.'
		},
		{
			tag: 'Lapis 1',
			title: 'Tepi',
			body: 'Pendeteksi kecil menyisir piksel piksel itu dan bereaksi pada <b>tepi</b>. Warnanya menunjukkan arah, <b>datar</b>, <b>tegak</b>, atau <b>miring</b>.'
		},
		{
			tag: 'Lapis 2',
			title: 'Bentuk',
			body: 'Tepi yang nyambung jadi <b>bentuk</b>, misalnya ujung lancip, lengkungan, atau lingkaran. Belum tahu ini gambar apa, baru bagian bagiannya.'
		},
		{
			tag: 'Lapis 3',
			title: 'Bendanya',
			body: 'Lapis terakhir bertanya bentuk apa yang muncul bersamaan. Bagian bagian ini biasanya berarti <b>kucing</b>, jadi itulah jawabannya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Garis, bentuk, benda',
			body: 'Dari kecil ke besar. Tiap lapis cuma menggabungkan temuan lapis sebelumnya.'
		},
		{
			tag: 'Latihan',
			title: 'Dipelajari, bukan disuruh',
			body: 'Nggak ada yang menulis aturan soal telinga. Lapisannya menyetel diri sendiri dari jutaan foto sampai tepi dan bentuk yang berguna kelihatan menonjol.'
		},
		{
			tag: 'Coba',
			title: 'Gambar lain',
			body: 'Ganti gambarnya. Lapisannya tetap sama persis, cuma gambarnya yang berubah, dan jawabannya ikut berubah.'
		}
	],
	objects: {
		cat: { name: 'kucing', parts: ['telinga lancip', 'wajah bulat', 'mata', 'kumis'] },
		fish: { name: 'ikan', parts: ['badan lonjong', 'ekor lancip', 'mata', 'sirip'] },
		house: { name: 'rumah', parts: ['dinding kotak', 'atap lancip', 'pintu', 'jendela'] }
	},
	edges: ['datar', 'tegak', 'miring'],
	layers: ['tepi', 'bentuk', 'benda'],
	guess: 'Kayaknya ini {x}',
	rule: 'Garis jadi bentuk, bentuk jadi benda.',
	another: 'Tunjukkan gambar lain'
};
