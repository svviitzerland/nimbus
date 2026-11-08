import type { CacheText } from './types';

export const id: CacheText = {
	title: 'Cache dan Redis',
	intro: [
		'Buka halaman produk di nimbus.com kelihatannya simpel, tapi di belakangnya server nanya ke database soal nama, harga, foto, ulasan, dan stoknya. Itu banyak query, dan database yang lagi sibuk bisa butuh hampir satu detik buat menjawab semuanya.',
		'Padahal kebanyakan pengunjung membuka beberapa halaman yang itu itu aja, berulang kali. Nanya pertanyaan yang sama ke database seribu kali semenit itu kerja yang sia sia.',
		'Jadi jawabannya kita simpan di kali pertama, terus dipakai ulang. Itulah <b>cache</b>, dan kamu sudah pernah ketemu di [[Caching dan CDN|traffic/cdn]]. CDN nyimpan salinan file dekat pengunjung, cache yang ini nyimpan jawaban siap pakai tepat di sebelah server.',
		'<b>Redis</b> dapat digunakan untuk menyimpan cache di memori. Mengambil hasil yang sudah disimpan dapat mengurangi pekerjaan database. Redis juga memiliki pilihan persistensi ke disk.',
		'Kunjungan pertama itu <b>miss</b>. Redis belum punya jawabannya, jadi server nanya ke database dan nyimpan jawabannya di Redis sambil jalan balik. Kunjungan berikutnya jadi <b>hit</b>, langsung disajikan dari memori.',
		'[fyi] Ada jebakannya. Waktu harga aslinya berubah, cache bisa masih nyimpan harga lama, yang disebut data <b>stale</b> (basi). Ada lelucon lama, cuma ada dua hal sulit di ilmu komputer, yaitu cache invalidation dan memberi nama.',
		'[ingat] Cache hit berarti data ditemukan di cache. Cache miss berarti aplikasi perlu mengambilnya dari sumber data. Data cache dapat kedaluwarsa.',
		'Giliran kamu. Buka satu halaman produk dengan cache mati dan rasakan nunggunya. Lalu nyalakan Redis dan buka halaman yang sama dua kali.'
	],
	reactions: {
		slow: 'Kerasa kan? Hampir sedetik, tiap kali, karena tiap kunjungan bikin database mengerjakan semuanya dari awal lagi. Nyalakan cachenya.',
		miss: 'Miss. Redis belum punya apa apa, jadi server ke database lewat jalur lambat dan nyimpan jawabannya sambil balik. Buka halaman yang sama sekali lagi.',
		hit: 'Hit! Halaman yang sama, cuma beberapa milidetik. Database bahkan nggak sadar kamu datang. Di hari promo yang ramai, inilah yang bikin database nggak meleleh.',
		stale:
			'Waduh. Harganya sudah berubah di database, tapi halamannya masih nunjukin harga lama. Redis nggak tahu kebenarannya sudah pindah. Hapus key itu dari cache.',
		fresh:
			'Segar lagi. Menghapus key memaksa satu miss lagi, dan sekarang Redis nyimpan harga baru. Aplikasi beneran menghapus key tiap kali datanya berubah, atau ngasih tiap key waktu kedaluwarsa (TTL) supaya jawaban lama hilang sendiri.'
	},
	keyPrefix: 'produk_',
	locale: 'id-ID',
	currency: 'Rp',
	products: [
		{ name: 'Kaos Nimbus', price: 89000 },
		{ name: 'Topi Awan', price: 65000 },
		{ name: 'Mug Nimbus', price: 45000 }
	],
	openBtn: 'Buka {name}',
	cacheLabel: 'Cache Redis',
	cacheOn: 'nyala',
	cacheOff: 'mati',
	youLabel: 'Kamu',
	appLabel: 'Server aplikasi',
	redisLabel: 'Redis',
	redisSub: 'di memori',
	dbLabel: 'Database',
	dbSub: 'di disk',
	emptyCache: 'kosong',
	loading: 'memuat',
	idleScreen: 'Pilih produk buat dibuka',
	visitsLabel: 'Kunjungan terakhir',
	ms: 'ms',
	hitTag: 'hit',
	missTag: 'miss',
	directTag: 'tanpa cache',
	staleTag: 'harga lama',
	saleBtn: 'Diskon {name} di database',
	clearBtn: 'Hapus {key} dari Redis',
	saleNote: 'Database sekarang punya harga baru'
};
