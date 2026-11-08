import type { IdsText } from './types';

export const id: IdsText = {
	title: 'IDS dan IPS',
	intro: [
		'Trafik yang diizinkan firewall masih bisa berisi pola serangan. Kita perlu memeriksa aktivitas lebih lanjut untuk mendeteksi penyalahgunaan.',
		'<b>IDS</b> (Intrusion Detection System) memeriksa isi tasnya. Dia membaca setiap request yang lewat, membandingkannya dengan pola serangan yang sudah dikenal dan dengan lalu lintas yang biasanya normal, lalu membunyikan alarm kalau ada yang mencurigakan.',
		'<b>IPS</b>, Intrusion Prevention System, dapat mendeteksi dan memblokir trafik. IDS memberi peringatan, sedangkan IPS dapat menerapkan tindakan pencegahan pada jalur trafik.',
		'Bagian tersulitnya adalah menyetel. Terlalu ketat, pengunjung asli ikut diblokir (namanya <b>false positive</b>). Terlalu longgar, serangan lolos (namanya <b>false negative</b>). Semua tim keamanan bergulat dengan keseimbangan ini.',
		'[fyi] Idenya lebih tua dari web. Tahun 1987 peneliti Dorothy Denning menjelaskan cara mengenali penyusup dari perilaku yang nggak wajar, dan tahun 1998 Martin Roesch merilis <b>Snort</b>, IDS gratis yang masih dipakai sampai sekarang. Di cloud kamu tinggal menyewanya sebagai layanan siap pakai.',
		'[ingat] IDS mendeteksi dan memberi peringatan. IPS juga dapat memblokir trafik berdasarkan aturan deteksi.',
		'Sepuluh request sebentar lagi sampai di nimbus.com, dan tiga di antaranya serangan. Atur seberapa ketat penjaganya, pilih mode, lalu biarkan lalu lintasnya masuk.'
	],
	reactions: {
		ids: 'Alarmnya bunyi untuk serangan, tapi lihat, mereka tetap sampai ke server. IDS cuma mengawasi dan memberi tahu. Ganti ke IPS supaya penjaganya benar benar bisa memblokir.',
		strict:
			'Aturan ini memblokir serangan sekaligus beberapa request sah. Periksa false positive sebelum memilih pengaturan.',
		loose:
			'Terlalu longgar. Ada serangan yang melenggang lewat penjaga dan menghantam server. Buat penjaganya sedikit lebih ketat.',
		perfect:
			'Pas banget. Ketiga serangan diblokir dan semua pengunjung asli bisa masuk, termasuk pengunjung dari negara baru dan pembeli yang super cepat, aneh tapi nggak berbahaya. Kalau banjirnya jutaan request ([[DDoS|security/ddos]]), itu lain cerita, butuh tembok yang jauh lebih besar.'
	},
	youLabel: 'Pengunjung',
	guardLabel: 'Penjaga',
	serverLabel: 'nimbus.com',
	modeIds: 'IDS, cuma alarm',
	modeIps: 'IPS, alarm dan blokir',
	strictLabel: 'Seberapa ketat',
	strictLow: 'longgar',
	strictHigh: 'ketat',
	runBtn: 'Biarkan lalu lintas masuk',
	runAgain: 'Jalankan lagi',
	packets: {
		home: 'Membuka halaman depan',
		products: 'Melihat lihat produk',
		login: 'Salah ketik password sekali',
		sqli: 'Mencoba mengakali database (SQL injection)',
		cart: 'Memasukkan barang ke keranjang',
		abroad: 'Pengunjung asli dari negara baru',
		traversal: 'Mencoba menyelundupkan file sistem',
		fast: 'Pembeli super cepat, 30 pencarian semenit',
		portscan: 'Mengetuk seribu port mencari celah',
		blog: 'Membaca blog'
	},
	scoreLabel: 'kecurigaan',
	tagPass: 'masuk',
	tagAlert: 'alarm, tetap masuk',
	tagBlock: 'diblokir',
	attackTag: 'serangan',
	resultAttacks: '{n} dari {total} serangan dihentikan',
	resultVisitors: '{n} pengunjung asli diblokir',
	hintIdle: 'Tiap request punya skor kecurigaan, yang melewati garis akan ditandai'
};
