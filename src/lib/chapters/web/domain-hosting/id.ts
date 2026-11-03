import type { DomainHostingText } from './types';

export const id: DomainHostingText = {
	title: 'Domain dan hosting',
	intro: [
		'Biar seluruh dunia bisa buka <b>nimbus.com</b>, kamu butuh dua hal. <b>Nama</b> yang bisa diketik orang, dan <b>komputer</b> yang nyala terus siang malam buat ngasih halamanmu.',
		'Nama itu disebut <b>domain</b>. Kamu dapatnya dari <b>registrar</b>, toko yang menyewakan nama. Domain nggak pernah jadi milikmu selamanya, kamu sewa per tahun, dan kalau lupa perpanjang, orang lain bisa ngambil.',
		'Komputer yang nyala terus itu <b>host</b> kamu. Menyewa tempat di server orang lain namanya <b>hosting</b>, dan ukurannya macam macam, kayak tempat tinggal.',
		'<b>Shared hosting</b> itu kayak kos kosan, banyak situs kecil numpang di satu server, murah tapi semuanya dipakai bareng. <b>VPS</b> (virtual private server) itu kamar sendiri, sebuah [[mesin virtual|foundations/virtual-machine]] yang cuma kamu yang atur. Hosting <b>cloud</b> nyewain persis sebanyak yang kamu butuh dan ikut membesar bareng kamu.',
		'Beli nama dan sewa host belum otomatis nyambung. Kamu harus bilang ke [[DNS|networking/dns]], buku telepon internet, kalau namamu tinggal di alamat IP host kamu. Catatan itu namanya <b>A record</b>.',
		'[fyi] Kata sama, dunia beda. Di kantor, <b>domain</b> (misalnya Windows domain) artinya sekelompok komputer yang pakai satu sistem login bareng. Nggak ada hubungannya sama alamat web, cuma namanya aja yang sama.',
		'Giliran kamu! Sewa namanya, pilih rumah buat situsmu, lalu sambungkan keduanya dan buka di HP kamu.'
	],
	reactions: {
		taken:
			'Udah ada yang punya. Nama itu siapa cepat dia dapat, dan begitu disewa orang, nggak ada yang bisa pakai sampai dilepas. Coba nama lain, atau akhiran lain.',
		bought:
			'Jadi milikmu! Eh, disewa maksudnya. Kamu bayar ke registrar tiap tahun, dan selama terus bayar, nama itu nunjuk ke mana pun kamu mau. Tapi sekarang dia belum nunjuk ke mana mana.',
		shared:
			'<b>Shared hosting</b>, pilihan paling murah dan cukup buat blog kecil. Kamu tinggal di satu server bareng ratusan situs lain, jadi kalau tetangga lagi ramai, situsmu bisa ikut lemot.',
		vps: 'Sebuah <b>VPS</b>. Kamu dapat mesin virtual sendiri yang dipotong dari server besar, dengan jatah tenaga tetap dan kendali penuh. Lebih bebas, tapi kamu yang ngurus sendiri.',
		cloud:
			'Hosting <b>cloud</b>. Kamu nyewa dari kolam raksasa dan bayar sesuai pemakaian. Hari sepi, tagihan kecil. Tiba tiba ramai, dia melar menyesuaikan. Kebanyakan situs besar tinggal di sini.',
		unreachable:
			'Situsnya nggak bisa dibuka. HP kamu nanya ke DNS namamu tinggal di mana, dan DNS nggak punya jawabannya. Nama dan host kamu belum saling kenal.',
		wrongip:
			'Hmm, alamat itu bukan host kamu. DNS bakal nurut aja ngirim semua orang ke tempat yang salah, jadi salin IP nya langsung dari kartu host kamu.',
		connected:
			'Tersimpan. A record kamu sekarang bilang namamu tinggal di alamat IP host kamu. Coba buka situsnya lagi.',
		live: 'Situsmu online! HP kamu nanya ke DNS, dapat IP host kamu, lalu host kamu ngirim halamannya. Di dunia nyata record baru bisa butuh beberapa menit (kadang berjam jam) buat menyebar ke mana mana, jadi santai kalau nggak langsung.'
	},
	acts: ['Sewa nama', 'Pilih host', 'Sambungkan'],
	registrarLabel: 'Registrar',
	registrarSub: 'toko yang menyewakan nama',
	searchLabel: 'Cari nama',
	search: 'Cari',
	available: 'tersedia',
	taken: 'sudah dipakai',
	prices: { com: 'Rp180 rb', id: 'Rp220 rb', dev: 'Rp210 rb' },
	perYear: '{price} per tahun',
	buy: 'Sewa',
	owned: 'punyamu',
	toHost: 'Sekarang cari rumahnya',
	hosts: {
		shared: {
			name: 'Shared hosting',
			sub: 'kayak kos kosan',
			price: 'Rp45 rb sebulan',
			points: ['Paling murah buat mulai', 'Satu server dipakai banyak situs']
		},
		vps: {
			name: 'VPS',
			sub: 'kamar sendiri',
			price: 'Rp90 rb sebulan',
			points: ['Mesin virtual milikmu sendiri', 'Kamu yang ngurus sendiri']
		},
		cloud: {
			name: 'Cloud',
			sub: 'ikut membesar',
			price: 'bayar sesuai pemakaian',
			points: ['Melar waktu lagi ramai', 'Rumah kebanyakan situs besar']
		}
	},
	pick: 'Pilih',
	picked: 'dipilih',
	ipLabel: 'Alamat IP',
	toConnect: 'Sambungkan namanya',
	dnsTitle: 'DNS record untuk {domain}',
	recordType: 'Tipe',
	recordName: 'Nama',
	recordValue: 'Menuju',
	valuePlaceholder: 'IP host kamu',
	copyHint: 'Pencet IP nya buat menyalin',
	save: 'Simpan',
	saved: 'Record tersimpan',
	wrong: 'Itu bukan host kamu',
	open: 'Buka {domain}',
	unreachable: 'Situs ini tidak dapat dijangkau',
	siteTitle: 'Selamat datang di Nimbus',
	siteSub: 'dikirim dari {ip}',
	youLabel: 'HP kamu'
};
