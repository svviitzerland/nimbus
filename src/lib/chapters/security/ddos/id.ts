import type { DdosText } from './types';

export const id: DdosText = {
	title: 'Apa itu DDoS',
	intro: [
		'Server nimbus.com memiliki kapasitas komputasi dan jaringan yang terbatas. Jika beban melebihi kapasitas, request dapat melambat atau gagal.',
		'<b>Denial of service</b> atau DoS mengganggu ketersediaan layanan. Pada contoh ini, trafik berlebih menghabiskan kapasitas sehingga pengunjung lain sulit mengakses situs.',
		'<b>Distributed denial of service</b> atau DDoS memakai banyak sumber serangan. Sebagian serangan memakai botnet, yaitu kumpulan perangkat yang dikendalikan penyerang.',
		'Oktober 2016, botnet bernama <b>Mirai</b>, yang sebagian besar terdiri dari kamera dan router yang masih pakai password bawaan pabrik, membanjiri perusahaan DNS bernama Dyn. Berjam jam banyak orang di Amerika dan Eropa nggak bisa membuka Twitter, Netflix, Reddit, dan banyak situs lain.',
		'[fyi] Tahun 2018 GitHub diserang banjir sebesar 1,35 terabit per detik, salah satu yang terbesar saat itu. Dengan bantuan layanan perlindungan DDoS, GitHub kembali normal dalam sekitar sepuluh menit.',
		'[ingat] DDoS mengganggu ketersediaan dengan trafik atau pekerjaan berlebih. Perlindungan perlu sesuai jenis serangan dan kapasitas jaringan.',
		'Penjaga melawan dengan <b>rate limit</b> (setiap alamat cuma boleh mengirim sekian request per detik) dan [[CDN|traffic/cdn]], ratusan server di seluruh dunia yang menyerap banjir jauh dari servermu. Mulai banjirnya, lalu jaga nimbus.com tetap terbuka untuk pengunjung asli, bahkan saat botnetnya paling besar.'
	],
	reactions: {
		flood:
			'Tumbang. Titik merah itu request sampah dari botnet, dan yang hijau itu orang sungguhan. Server sibuk banget menjawab sampah sampai hampir nggak ada pengunjung asli yang kebagian giliran.',
		rateWin:
			'Hidup lagi. Sekarang setiap bot cuma boleh mengirim sedikit request per detik, dan orang sungguhan yang klik sana sini nggak pernah menyentuh batas itu. Melawan botnet kecil, ini saja sudah cukup. Coba besarkan botnetnya.',
		rateLose:
			'Rate limit membantu, tapi botnya kebanyakan. Masing masing tetap sopan di bawah batas, tapi kalau digabung tetap menenggelamkan server. Kamu butuh sesuatu yang jauh lebih lega.',
		cdnWin:
			'Perisainya kuat. CDN menyebarkan banjir ke banyak edge server di seluruh dunia, jadi masing masing cuma kena sedikit. Kebanyakan sampah bahkan nggak sampai ke servermu.',
		cdnLose:
			'Di ukuran segini CDN pun kewalahan, setiap bot menembak dengan kecepatan penuh. Ada cara supaya setiap bot mengirim lebih sedikit?',
		down: 'Lalu lintasnya kebanyakan, pengunjung asli ditolak lagi. Coba kombinasi pertahanan yang lain.',
		holding: 'Masih berdiri. Coba besarkan botnetnya dan lihat apakah pertahananmu masih kuat.',
		saved:
			'Sepuluh ribu bot dan nimbus.com tetap terbuka untuk orang sungguhan. Rate limit bikin setiap bot lemah, dan CDN memberi ruang untuk menyerap sisanya. Di belakang perisai, [[load balancer|traffic/load-balancer]] membagi sisa request, dan kalau satu region tetap tumbang, [[failover|resilience/failover]] siap menggantikan.'
	},
	startBtn: 'Mulai banjirnya',
	stopBtn: 'Hentikan banjirnya',
	sizeLabel: 'Ukuran botnet',
	rateToggle: 'Rate limit',
	cdnToggle: 'Perisai CDN',
	on: 'nyala',
	off: 'mati',
	visitorsLabel: 'Pengunjung asli',
	botsLabel: '{n} perangkat dibajak',
	cdnLabel: 'Edge server CDN',
	serverLabel: 'nimbus.com',
	rps: '{n} request per detik',
	served: 'Pengunjung asli yang bisa masuk, {n}%',
	calm: 'Hari yang tenang, semua pengunjung bisa masuk',
	states: { up: 'online', slow: 'lambat banget', down: 'tumbang' },
	numberLocale: 'id-ID'
};
