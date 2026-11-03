import type { Ipv6Text } from './types';

export const id: Ipv6Text = {
	title: 'IPv4 dan IPv6',
	intro: [
		'Di [[pelajaran alamat IP|network/ip-address]] kamu sudah kenal alamat seperti 192.168.1.20, empat angka dari 0 sampai 255. Format itu namanya <b>IPv4</b>, versi 4 dari Internet Protocol, ditulis tahun 1981 waktu seluruh internet cuma berisi beberapa ratus komputer besar.',
		'Tiap alamat IPv4 panjangnya 32 <b>bit</b>, 32 sakelar kecil yang bisa nyala atau mati. Hitung semua kemungkinan polanya, dapatnya sekitar 4,3 miliar alamat. Dulu angka itu terdengar jauh lebih dari cukup.',
		'Lalu datang komputer rumahan, lalu HP, lalu jam tangan, TV, kamera, bahkan kulkas. Sekarang jumlah perangkat yang online sudah miliaran lebih banyak dari jumlah alamat IPv4.',
		'Tahun 2011, stok pusat alamat IPv4 resmi habis. Solusinya <b>IPv6</b>, alamatnya sepanjang 128 bit. Ditulis dalam heksadesimal (angka 0 sampai 9 ditambah huruf a sampai f), dibagi jadi delapan kelompok.',
		'[fyi] Kenapa nggak ada IPv5? Angka 5 sudah dipakai di tahun 1980an oleh protokol percobaan untuk streaming suara dan video, jadi versi berikutnya langsung 6.',
		'Memindahkan seluruh dunia ke IPv6 butuh puluhan tahun, jadi sementara itu ada trik bernama [[NAT|network/nat]] yang bikin satu rumah bisa berbagi satu alamat IPv4. Itulah kenapa IPv4 masih jalan sampai sekarang.',
		'Bagikan alamat IPv4 ke dunia yang terus tumbuh, lima tahun sekali, dan lihat apa yang terjadi waktu stoknya habis.'
	],
	reactions: {
		grow: 'Masih lega. Tiap kotak di kolam ini mewakili sekitar 67 juta alamat, dan baru sedikit yang terpakai.',
		tight:
			'Lihat, sudah penuh banget. Di masa ini, para pengelola internet mulai menghitung tiap alamat yang tersisa. Tahun 2011 blok besar terakhir dibagikan.',
		full: 'Kolamnya habis, tapi perangkat terus berdatangan. Mereka berdiri di luar tanpa alamat sendiri. Saatnya pindah ke IPv6.',
		ipv6: 'Semua perangkat tadi sekarang muat di dalam satu titik kecil. IPv6 punya sekitar 340 undesiliun alamat, angka sepanjang 39 digit. Coba hal konyol berikutnya.',
		sand: 'Bahkan setelah tiap butir pasir di Bumi dapat alamat sendiri, kolamnya hampir nggak berkurang. Tiap butir bisa dapat miliaran alamat dan masih banyak sisanya.'
	},
	growBtn: 'Bagikan alamat untuk tahun {year}',
	switchBtn: 'Pindahkan dunia ke IPv6',
	sandBtn: 'Kasih alamat ke tiap butir pasir',
	yearLabel: 'Tahun {year}',
	devicesLabel: '{n} perangkat butuh alamat',
	billion: '{n} miliar',
	poolV4: 'Kolam IPv4',
	poolV6: 'Kolam IPv6',
	seatHint: 'satu kotak sekitar 67 juta alamat',
	outside: '{n} perangkat tanpa alamat',
	dotLabel: 'semua perangkat muat di sini',
	sandLabel: 'ditambah tiap butir pasir',
	sampleLabel: 'Bentuk alamatnya',
	totalLabel: 'Jumlah alamat',
	bits: '{n} bit',
	scale:
		'Kalau seluruh IPv6 dibentangkan seluas permukaan Bumi, seluruh IPv4 cuma jadi titik yang lebih kecil dari satu bakteri.',
	decimal: ',',
	thousands: '.',
	notes: {
		idle: 'Internet masih muda, kolamnya masih lowong',
		growing: 'Perangkat makin banyak, kotak makin terisi',
		tight: 'Hampir semua kotak sudah terisi',
		full: 'Kolamnya habis, sisanya menunggu di luar',
		v6: 'Perangkatnya sama, kolamnya jauh tak terbayangkan',
		sand: 'Pasir sudah masuk, kolamnya masih nyaris kosong'
	}
};
