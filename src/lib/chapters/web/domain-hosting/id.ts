import type { DomainHostingText } from './types';

export const id: DomainHostingText = {
	title: 'Domain dan hosting',
	intro: [
		'Biar seluruh dunia bisa buka <b>nimbus.com</b>, kamu butuh dua hal. <b>Nama</b> yang bisa diketik orang, dan <b>komputer</b> yang nyala terus siang malam buat ngasih halamanmu.',
		'Nama itu disebut <b>domain</b>. Kamu dapatnya dari <b>registrar</b>, toko yang menyewakan nama. Domain nggak pernah jadi milikmu selamanya, kamu sewa per tahun, dan kalau lupa perpanjang, orang lain bisa ngambil.',
		'<b>Hosting</b> menyediakan tempat untuk menjalankan atau menyimpan situs agar dapat diakses pengunjung. Pilih layanan sesuai kebutuhan aplikasi dan pengelolaannya.',
		'<b>Shared hosting</b> berbagi server dengan situs lain. <b>VPS</b> menyediakan mesin virtual yang kamu kelola. Layanan <b>cloud</b> menyediakan berbagai sumber daya dan layanan terkelola, dengan kapasitas sesuai konfigurasi.',
		'Setelah memilih domain dan host, atur [[DNS|networking/dns]]. <b>A record</b> pada contoh ini menghubungkan nama domain ke alamat IPv4 host.',
		'[fyi] Kata sama, dunia beda. Di kantor, <b>domain</b> (misalnya Windows domain) artinya sekelompok komputer yang pakai satu sistem login bareng. Nggak ada hubungannya sama alamat web, cuma namanya aja yang sama.',
		'[ingat] Domain adalah nama situs. Hosting menjalankan atau menyimpan situs. DNS menyediakan record yang menghubungkan nama dengan tujuan layanan.',
		'Giliran kamu! Sewa namanya, pilih rumah buat situsmu, lalu sambungkan keduanya dan buka di HP kamu.'
	],
	reactions: {
		taken:
			'Udah ada yang punya. Nama itu siapa cepat dia dapat, dan begitu disewa orang, nggak ada yang bisa pakai sampai dilepas. Coba nama lain, atau akhiran lain.',
		bought:
			'Jadi milikmu! Eh, disewa maksudnya. Kamu bayar ke registrar tiap tahun, dan selama terus bayar, nama itu nunjuk ke mana pun kamu mau. Tapi sekarang dia belum nunjuk ke mana mana.',
		shared:
			'Shared hosting memakai sumber daya bersama situs lain. Periksa batas kapasitas dan pengelolaannya sebelum memilih layanan.',
		vps: 'Sebuah <b>VPS</b>. Kamu dapat mesin virtual sendiri yang dipotong dari server besar, dengan jatah tenaga tetap dan kendali penuh. Lebih bebas, tapi kamu yang ngurus sendiri.',
		cloud:
			'Cloud menyediakan kapasitas dan layanan yang dapat dikonfigurasi. Scaling otomatis memerlukan dukungan layanan dan pengaturan yang sesuai.',
		unreachable:
			'DNS pada simulasi ini belum memiliki record menuju host. Lengkapi record agar browser mengetahui alamat tujuan.',
		wrongip:
			'Hmm, alamat itu bukan host kamu. DNS bakal nurut aja ngirim semua orang ke tempat yang salah, jadi salin IP nya langsung dari kartu host kamu.',
		connected: 'A record tersimpan dan menunjuk ke alamat host. Coba buka situsnya kembali.',
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
	toHost: 'Pilih tempat menjalankan situs',
	hosts: {
		shared: {
			name: 'Shared hosting',
			sub: 'Satu server untuk banyak situs',
			price: 'Rp45 rb sebulan',
			points: ['Paling murah buat mulai', 'Satu server dipakai banyak situs']
		},
		vps: {
			name: 'VPS',
			sub: 'Mesin virtual untuk situsmu',
			price: 'Rp90 rb sebulan',
			points: ['Mesin virtual milikmu sendiri', 'Kamu yang ngurus sendiri']
		},
		cloud: {
			name: 'Cloud',
			sub: 'Kapasitas dapat disesuaikan',
			price: 'bayar sesuai pemakaian',
			points: ['Kapasitas dapat ditambah sesuai kebutuhan', 'Pilihan layanan terkelola']
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
