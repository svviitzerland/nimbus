import type { DdosText } from './types';

export const id: DdosText = {
	title: 'Apa itu DDoS',
	intro: [
		'Bayangin nimbus.com itu toko kecil dengan beberapa kasir. Server di belakangnya cuma punya tenaga komputer dan kabel internet yang terbatas, jadi cuma bisa melayani sekian pengunjung tiap detik. Sekarang semua orang masuk dengan lancar.',
		'Sekarang ada satu pembuat onar yang ngirim request terus terusan, kayak pembeli palsu yang nanya hal nggak penting dan nggak pernah pergi. Itu namanya serangan <b>denial of service</b>, disingkat DoS. Nggak ada yang dicuri, tujuannya cuma bikin orang lain nggak bisa masuk. Tapi satu pengirim gampang diatasi, tinggal blokir satu alamat itu.',
		'Makanya penyerang bawa kerumunan. Ribuan perangkat yang dibajak (komputer, kamera, router rumahan) membanjiri situs yang sama sekaligus. Kerumunan itu namanya <b>botnet</b>, dan serangannya disebut <b>distributed</b> denial of service, atau <b>DDoS</b>. Servernya tenggelam, dan pengunjung asli nggak bisa masuk.',
		'Bulan Oktober 2016, botnet bernama <b>Mirai</b>, yang kebanyakan terdiri dari kamera dan router yang masih pakai password bawaan pabrik, membanjiri perusahaan bernama Dyn yang membantu internet menemukan alamat website. Berjam jam banyak orang di Amerika dan Eropa nggak bisa buka Twitter, Netflix, atau Reddit.',
		'Penjaga bisa melawan. Pertama pakai <b>rate limit</b>, tiap alamat cuma boleh ngirim sekian request per detik, sisanya ditolak di pintu. Ini membantu, tapi botnet raksasa punya alamat sebanyak itu sampai masih banyak yang lolos.',
		'Perisai besarnya adalah [[CDN|traffic/cdn]], ratusan server yang tersebar di seluruh dunia dan berdiri di depan servermu. Banjirnya pecah di sana, jauh dari servermu, sementara pengunjung asli tetap lewat. nimbus.com tetap buka.',
		'[ingat] <b>DDoS itu bukan maling, tapi kerumunan yang nutup pintu.</b> Nggak ada yang diambil. Obatnya pintu yang lebih lebar di tempat jauh (CDN) dan satpam yang sopan (rate limit).',
		'[fyi] Tahun 2018, GitHub diserang banjir sebesar 1,35 terabit per detik, salah satu yang terbesar pada masanya. Dengan bantuan layanan perlindungan DDoS, GitHub pulih dalam sekitar sepuluh menit.',
		'Mau ngerasain bedanya? Matikan dan nyalakan perisainya, lalu lihat banjirnya. Semua di sini cuma pura pura, nggak ada situs asli yang dirugikan.'
	],
	reactions: {
		shieldOff:
			'Perisai mati. Seluruh botnet langsung menghantam nimbus.com, servernya megap megap, dan hampir nggak ada pengunjung asli yang bisa masuk.',
		shieldOn:
			'Perisai nyala. Banjirnya pecah di CDN yang jauh, rate limit menolak sisanya, dan pengunjung asli masuk dengan santai.'
	},
	steps: [
		{
			tag: 'Hari biasa',
			title: 'Toko kecil',
			body: 'Server cuma bisa menjawab sekian <b>request</b> tiap detik. Di hari biasa itu lebih dari cukup.'
		},
		{
			tag: 'Satu pengirim',
			title: 'DoS',
			body: 'Satu mesin membanjiri situs supaya yang lain <b>nggak bisa masuk</b>. Blokir satu alamat itu, selesai.'
		},
		{
			tag: 'Kerumunan',
			title: 'DDoS dan botnet',
			body: 'Ribuan <b>perangkat yang dibajak</b> membanjiri sekaligus. Nggak ada satu alamat yang bisa diblokir.'
		},
		{
			tag: 'Oktober 2016',
			title: 'Mirai',
			body: 'Kamera dan router dengan <b>password bawaan pabrik</b> jadi botnet yang bikin situs besar tumbang berjam jam.'
		},
		{
			tag: 'Pertahanan',
			title: 'Rate limit',
			body: 'Tiap alamat cuma dapat sedikit request per detik. Ini <b>memperlambat</b> banjir, tapi nggak cukup buat yang raksasa.'
		},
		{
			tag: 'Pertahanan',
			title: 'Perisai CDN',
			body: 'Banyak server di seluruh dunia <b>menyerap</b> banjirnya jauh dari servermu, dan meloloskan pengunjung asli.'
		},
		{
			tag: 'Biar nempel',
			title: 'Kerumunan di pintu',
			body: 'DDoS nggak mengambil apa pun, dia <b>nutup pintu</b>. Lebarkan pintunya dan tambah satpam.'
		},
		{
			tag: 'Sekilas',
			title: 'GitHub, 2018',
			body: 'Banjir terbesar pada masanya, dan pulih dalam sekitar <b>sepuluh menit</b> berkat layanan perlindungan.'
		},
		{
			tag: 'Opsional',
			title: 'Perisai nyala, perisai mati',
			body: 'Ganti saklarnya dan lihat berapa banyak pengunjung asli yang bisa masuk.'
		}
	],
	visitorsLabel: 'Pengunjung asli',
	attackerLabel: 'Satu pembuat onar',
	botsLabel: 'Botnet',
	serverLabel: 'nimbus.com',
	rateLabel: 'Rate limit',
	cdnLabel: 'CDN',
	states: { up: 'Buka', slow: 'Kewalahan', down: 'Tumbang' },
	served: '{n}% pengunjung asli bisa masuk',
	stamp: 'Oktober 2016',
	rule: 'Kerumunan di pintu, bukan maling',
	pickLabel: 'Perisainya',
	modes: { off: 'Mati', on: 'Nyala' }
};
