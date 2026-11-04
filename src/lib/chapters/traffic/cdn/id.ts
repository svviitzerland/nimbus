import type { CdnText } from '../types';

export const id: CdnText = {
	title: 'Caching dan CDN',
	intro: [
		'Ingat pelajaran latensi di bab Cloud? Makin jauh server, makin lama data sampai. Server asal nimbus.com cuma ada di satu tempat, di Amerika, padahal pengunjungmu ada di mana mana.',
		'Padahal banyak isi situs sama persis untuk semua orang, misalnya gambar, logo, dan video. Daripada tiap orang ambil jauh jauh ke Amerika, simpan salinannya di titik dekat pengunjung. Itu namanya <b>caching</b>. Pertama kali ditanya, titik itu ambil dulu dari server asal, setelah itu salinannya disimpan di situ.',
		'<b>CDN</b> (Content Delivery Network) itu caching yang sama, cuma disebar ke seluruh dunia, jaringan titik penyimpan salinan di ratusan kota. Pengunjung otomatis dilayani titik terdekat, kamu nggak perlu milih kota satu satu.',
		'Sebarannya tergantung penyedia. Cloudflare ada di 300 lebih kota, CloudFront punya AWS 600 lebih titik, penyedia lain beda lagi. Kota besar hampir pasti kebagian, daerah terpencil dilayani titik terdekat yang agak jauh. Dan ada harganya, CDN itu layanan berbayar, jadi tagihanmu nambah.',
		'Di peta ini CDNnya masih mati, semua pengunjung harus jauh jauh ke server asal. Klik beberapa orang dan rasakan lambatnya, lalu nyalakan CDN, klik lagi, dan lihat titik hijau terdekat yang mengirim salinannya.'
	],
	reactions: {
		origin:
			'Lihat jalurnya, jauh banget dari server asal di Amerika. Yang dekat Amerika sih cepat, tapi pengunjung di belahan dunia lain nunggu ratusan milidetik. Nyalakan CDN.',
		enabled:
			'Nah, titik titik hijau itu jaringan CDNnya, langsung nyebar ke banyak kota sekaligus. Memang bikin tagihan nambah, tapi yang dibeli kecepatan. Klik pengunjung dan lihat titik mana yang ngirim.',
		cached:
			'Lihat, yang ngirim bukan server asal lagi, tapi titik hijau terdekat dari pengunjungnya. Dari ratusan milidetik jadi belasan. Itulah yang dibayar dari CDN.'
	},
	cdnOn: 'Nyalakan CDN',
	cdnOff: 'Matikan CDN',
	statusOff: 'CDN mati',
	statusOn: 'CDN nyala, {n} titik',
	originLabel: 'Server asal',
	edgeLabel: 'Titik CDN',
	visitorsLabel: 'Pengunjung',
	servedOrigin: 'dari server asal di Amerika',
	servedEdge: 'dari titik {city}',
	hitChip: 'Dikirim titik terdekat',
	verdictFast: 'Ngebut',
	verdictOk: 'Lumayan',
	verdictSlow: 'Lemot',
	readoutPrompt: 'Klik pengunjung di peta',
	compare: {
		off: 'Tanpa CDN',
		on: 'Pakai CDN',
		hint: 'Coba pengunjung tanpa CDN dulu, lalu nyalakan CDNnya'
	},
	ms: 'ms',
	cities: {
		surabaya: 'Surabaya',
		jayapura: 'Jayapura',
		brisbane: 'Brisbane',
		manchester: 'Manchester',
		riodejaneiro: 'Rio de Janeiro',
		boston: 'Boston',
		jakarta: 'Jakarta',
		sydney: 'Sydney',
		london: 'London',
		saopaulo: 'São Paulo',
		newyork: 'New York',
		seattle: 'Seattle',
		losangeles: 'Los Angeles',
		dallas: 'Dallas',
		miami: 'Miami',
		toronto: 'Toronto',
		mexicocity: 'Mexico City',
		bogota: 'Bogotá',
		lima: 'Lima',
		buenosaires: 'Buenos Aires',
		santiago: 'Santiago',
		paris: 'Paris',
		frankfurt: 'Frankfurt',
		madrid: 'Madrid',
		milan: 'Milan',
		stockholm: 'Stockholm',
		warsaw: 'Warsawa',
		johannesburg: 'Johannesburg',
		lagos: 'Lagos',
		nairobi: 'Nairobi',
		dubai: 'Dubai',
		mumbai: 'Mumbai',
		singapore: 'Singapura',
		bangkok: 'Bangkok',
		hongkong: 'Hong Kong',
		tokyo: 'Tokyo',
		seoul: 'Seoul',
		auckland: 'Auckland'
	}
};
