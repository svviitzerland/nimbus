import type { CacheText } from './types';

export const id: CacheText = {
	title: 'Caching dan Redis',
	intro: [
		'Buka halaman produk di nimbus.com kelihatannya gampang, tapi di belakangnya server aplikasi nanya ke database soal nama, harga, foto, dan stoknya. Database yang lagi sibuk bisa butuh hampir sedetik buat jawab. Lihat satu kunjungan.',
		'Padahal kebanyakan pengunjung membuka beberapa halaman yang sama, lagi dan lagi. Tiap kunjungan bikin database mengerjakan semuanya dari nol. Perhatikan berapa kali dia ditanya.',
		'Jadi kita simpan jawabannya sejak pertama kali, lalu dipakai ulang. Itulah <b>cache</b>. Kamu sudah ketemu salah satunya di [[Caching dan CDN|traffic/cdn]]. CDN menyimpan salinan file dekat pengunjung, cache yang ini menyimpan jawaban siap pakai tepat di sebelah server aplikasi.',
		'Alat yang populer buat ini namanya <b>Redis</b>, database mungil yang tinggal di memori (RAM), bukan di disk. Baca dari memori cuma butuh satu dua milidetik, jauh lebih cepat daripada menjalankan query besar di disk.',
		'Kunjungan pertama itu <b>miss</b>. Redis belum punya jawabannya, jadi server nanya ke database dengan cara lambat, lalu menyimpan salinannya di Redis sambil jalan balik.',
		'Kunjungan sesudahnya jadi <b>hit</b>, dilayani langsung dari memori dalam beberapa milidetik. Database bahkan nggak sadar, dan angka di bawahnya berhenti naik.',
		'[ingat] Cache itu kayak botol minum di meja. Pertama kali haus, kamu jalan ke dapur (miss). Sesudahnya tinggal ambil botol di meja (hit). Sekali miss, berkali kali hit.',
		'[fyi] Ada jebakannya. Kalau harga di database berubah, Redis mungkin masih menyimpan yang lama, ini disebut data <b>basi</b> (stale). Aplikasi beneran menghapus key itu begitu datanya berubah, atau kasih tiap key waktu kedaluwarsa (TTL). Ada lelucon lama, dua hal tersulit di ilmu komputer itu menghapus cache dan memberi nama.',
		'Kalau mau, coba buka halamannya sendiri beberapa kali, mulai dari cache yang kosong. Ini opsional kok.'
	],
	reactions: {
		miss: 'Miss. Redis masih kosong, jadi server ke database lewat jalan lambat dan menyimpan salinannya. Buka lagi.',
		hit: 'Hit, cuma beberapa milidetik, dan database nggak dengar apa apa.'
	},
	panels: [
		{
			tag: 'Satu kunjungan',
			title: 'Jalan yang lambat',
			body: 'HP kamu nanya ke <b>server aplikasi</b>, server nanya ke <b>database</b>, lalu jawabannya jalan balik sampai ke kamu.'
		},
		{
			tag: 'Lagi dan lagi',
			title: 'Pertanyaan sama, kerja sama',
			body: 'Tiap kunjungan ke halaman yang sama menanyakan hal yang sama ke database. Angka di bawahnya terus naik.'
		},
		{
			tag: 'Cache',
			title: 'Simpan jawabannya',
			body: '<b>Cache</b> itu tempat menyimpan jawaban yang sudah kamu punya, biar nggak perlu dihitung ulang.'
		},
		{
			tag: 'Redis',
			title: 'Memori itu cepat',
			body: 'Redis menyimpan semuanya di RAM, sekitar satu milidetik jauhnya. Database menyimpan datanya di disk, jauh lebih lambat dijangkau.'
		},
		{
			tag: 'Miss',
			title: 'Belum ada',
			body: 'Redis dicek duluan. Masih kosong, jadi server pindah ke database, lalu menyimpan jawabannya dengan sebuah <b>key</b>.'
		},
		{
			tag: 'Hit',
			title: 'Dilayani dari memori',
			body: 'Key itu ada, jadi jawabannya langsung balik dari Redis. Database sama sekali nggak ditanya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Sekali miss, berkali kali hit',
			body: 'Kunjungan pertama bayar harga penuh. Kunjungan sesudahnya dapat jawaban hampir gratis.'
		},
		{
			tag: 'Basi',
			title: 'Salinan lama',
			body: 'Database sudah punya harga baru, tapi Redis masih menyajikan yang lama sampai key itu dihapus atau kedaluwarsa.'
		},
		{
			tag: 'Coba',
			title: 'Buka halamannya',
			body: 'Cache mulai kosong. Buka halamannya, lihat kunjungan pertama miss dan berikutnya hit.'
		}
	],
	locale: 'id-ID',
	currency: 'Rp',
	keyName: 'produk_1',
	product: { name: 'Kaos Nimbus', price: 89000, salePrice: 59000 },
	serverLabel: 'Server aplikasi',
	redisLabel: 'Redis',
	redisSub: 'di memori',
	dbLabel: 'Database',
	dbSub: 'di disk',
	emptyCache: 'kosong',
	asked: 'ditanya {n} kali',
	ms: 'ms',
	hitTag: 'hit',
	missTag: 'miss',
	directTag: 'tanpa cache',
	staleTag: 'harga lama',
	saleTag: 'lagi diskon',
	rule: 'Sekali miss, berkali kali hit.',
	open: 'Buka halamannya'
};
