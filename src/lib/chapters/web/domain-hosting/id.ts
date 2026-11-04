import type { DomainHostingText } from './types';

export const id: DomainHostingText = {
	title: 'Domain dan hosting',
	intro: [
		'Biar seluruh dunia bisa buka <b>nimbus.com</b>, kamu butuh dua hal. <b>Nama</b> yang bisa diketik orang, dan <b>komputer</b> yang nyala terus siang malam buat ngasih halamanmu. Yuk kita dapetin dua duanya, satu satu.',
		'Nama itu disebut <b>domain</b>. Kamu dapatnya dari <b>registrar</b>, toko yang menyewakan nama. Domain nggak pernah jadi milikmu selamanya, kamu sewa per tahun, dan kalau lupa perpanjang, orang lain bisa ngambil.',
		'Komputer yang nyala terus itu <b>host</b> kamu. Menyewa tempat di server orang lain namanya <b>hosting</b>. Host kamu dapat <b>alamat IP</b> sendiri, deretan angka kayak 203.0.113.10, dan dari situlah komputer lain bisa nemuin dia.',
		'Hosting itu ada ukurannya, kayak tempat tinggal. <b>Shared hosting</b> itu kos kosan, murah tapi dipakai bareng banyak situs. <b>VPS</b> itu kamar sendiri, sebuah [[mesin virtual|foundations/virtual-machine]] yang cuma kamu yang atur. Hosting <b>cloud</b> bisa melar ngikutin kamu tumbuh.',
		'Sekarang temanmu ngetik nimbus.com di HP, dan... nggak ada apa apa. Punya nama dan punya host belum otomatis nyambung. HP temanmu nanya ke sana sini, tapi nggak ada yang tahu nama itu tinggal di mana.',
		'Sambungannya ada di [[DNS|networking/dns]], buku telepon internet. Kamu nambahin satu baris yang bilang nimbus.com tinggal di 203.0.113.10. Baris itu namanya <b>A record</b>.',
		'Coba lagi. HP temanmu nanya ke DNS, dapat alamat IP host kamu, ngetuk pintunya, dan halamannya balik. nimbus.com online! Di dunia nyata record baru bisa butuh beberapa menit sampai beberapa jam buat menyebar, jadi santai kalau nggak langsung.',
		'[ingat] <b>Domain itu alamat rumah, hosting itu rumahnya, DNS itu peta</b> yang nyambungin keduanya. Kalau alamatnya nggak ada di peta, tamunya nyasar.',
		'[fyi] Kata sama, dunia beda. Di kantor, <b>domain</b> (misalnya Windows domain) artinya sekelompok komputer yang pakai satu sistem login bareng. Nggak ada hubungannya sama alamat web, cuma namanya aja yang sama.',
		'Mau lihat akibat salah ketik di DNS? Arahkan A record ke IP yang salah dan lihat HP temanmu nyasar. Habis itu balikin lagi.'
	],
	reactions: {
		wrongip:
			'HP temanmu nurut banget sama DNS dan ngetuk pintu yang salah. Di sana nggak ada yang ngelayanin nimbus.com, jadi halamannya nggak pernah datang. DNS nggak ngecek ketikanmu, dia cuma nurut.',
		fixed: 'IP yang benar udah balik. HP nanya ke DNS, nemu host kamu, dan halamannya pulang lagi.'
	},
	steps: [
		{
			tag: 'Tujuannya',
			title: 'Nama dan rumah',
			body: 'Orang butuh sesuatu buat diketik, dan halamanmu butuh tempat tinggal.'
		},
		{
			tag: 'Bagian 1',
			title: 'Domain',
			body: 'Disewa dari <b>registrar</b>, dibayar tiap tahun, siapa cepat dia dapat. Domain .com kira kira Rp200 ribu setahun.'
		},
		{
			tag: 'Bagian 2',
			title: 'Host',
			body: 'Komputer yang nggak pernah tidur. <b>Alamat IP</b> komputer ini adalah nomor yang dipakai komputer lain buat nyampe ke dia.'
		},
		{
			tag: 'Ukuran',
			title: 'Shared, VPS, cloud',
			body: '<b>Shared</b> paling murah, <b>VPS</b> ngasih jatah sendiri, <b>cloud</b> melar waktu lagi ramai.'
		},
		{
			tag: 'Celahnya',
			title: 'Belum nyambung',
			body: 'Nama dan host udah ada, tapi nggak ada yang bilang mereka satu paket. Browser bilang <b>Situs tidak dapat dijangkau</b>.'
		},
		{
			tag: 'Bagian 3',
			title: 'A record',
			body: 'Satu baris di DNS. <b>nimbus.com</b> nunjuk ke <b>203.0.113.10</b>.'
		},
		{
			tag: 'Akhir bahagia',
			title: 'Online',
			body: 'HP nanya ke DNS, DNS jawab pakai IP, host ngirim halamannya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Alamat, rumah, peta',
			body: '<b>Domain</b> itu alamat, <b>host</b> itu rumah, <b>DNS</b> itu peta di antara keduanya.'
		},
		{
			tag: 'Kata sama',
			title: 'Windows domain',
			body: 'Di kantor artinya sekelompok komputer dengan satu login bareng. Katanya sama, idenya beda jauh.'
		},
		{
			tag: 'Opsional',
			title: 'Rusakin recordnya',
			body: 'Arahkan A record ke IP yang salah. DNS nurut, jadi semua pengunjung nyasar ke pintu yang salah.'
		}
	],
	shopLabel: 'Registrar',
	price: 'Rp200rb setahun',
	hostLabel: 'Host',
	hostKinds: { shared: 'Shared', vps: 'VPS', cloud: 'Cloud' },
	dnsLabel: 'DNS',
	recordLabel: 'A record',
	noRecord: 'belum ada record',
	phone: { cannot: 'Situs tidak dapat dijangkau', welcome: 'Selamat datang di Nimbus' },
	breakIt: 'Arahkan ke IP yang salah',
	fixIt: 'Balikin IP yang benar'
};
