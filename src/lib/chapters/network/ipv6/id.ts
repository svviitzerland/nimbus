import type { Ipv6Text } from './types';

export const id: Ipv6Text = {
	title: 'IPv4 dan IPv6',
	intro: [
		'Di [[pelajaran alamat IP|network/ip-address]] kamu sudah kenal alamat seperti 192.168.1.20, empat angka dari 0 sampai 255 dengan titik di antaranya. Gaya itu namanya <b>IPv4</b>, versi 4 dari Internet Protocol, ditulis tahun 1981.',
		'Empat angka seperti itu bisa membentuk sekitar 4,3 miliar alamat berbeda. Waktu itu seluruh internet cuma beberapa ratus komputer besar, jadi rasanya tempatnya nggak bakal habis.',
		'Lalu datang komputer rumahan, lalu HP, lalu jam tangan, TV, kamera, sampai kulkas. Lihat kolamnya terisi, tahun demi tahun.',
		'Tahun 2011 kolam pusatnya habis. Perangkat baru terus berdatangan, tapi sudah nggak ada alamat IPv4 baru yang bisa dibagikan.',
		'Solusinya <b>IPv6</b>. Alamatnya empat kali lebih panjang, ditulis dalam delapan kelompok huruf dan angka (angka 0 sampai 9 plus a sampai f), dengan titik dua di antara kelompoknya.',
		'Seberapa besar? Saking besarnya, semua alamat IPv4 di dunia muat di dalam satu titik kecil di sana. IPv6 punya sekitar 340 undesiliun alamat, angka sepanjang 39 digit.',
		'[ingat] Cara gampang membedakannya. Titik satu, empat angka, itu IPv4. Titik dua, ada hurufnya, itu IPv6. Pokoknya kalau ada huruf di alamatnya, pasti IPv6.',
		'[fyi] Kenapa nggak ada IPv5? Angka 5 sudah dipakai tahun 1980an untuk protokol eksperimen streaming suara, jadi versi berikutnya langsung 6.',
		'Memindahkan seluruh dunia butuh puluhan tahun, jadi sekarang kebanyakan perangkat membawa dua duanya, dan trik bernama [[NAT|network/nat]] membuat alamat IPv4 lama tetap cukup. Kalau mau, kasih alamat ke tiap butir pasir di Bumi dan lihat sisa ruangnya.'
	],
	reactions: {
		sand: 'Tiap butir pasir di Bumi sekarang punya alamat IPv6 sendiri, dan ruangnya hampir nggak berkurang. Tiap butir bisa dikasih miliaran alamat pun masih banyak sisanya.'
	},
	steps: [
		{
			title: 'Alamat IPv4',
			body: 'Empat angka, masing masing dari <b>0 sampai 255</b>, dipisah titik. Tiap perangkat online butuh satu supaya bisa dihubungi.'
		},
		{
			title: 'Kolam IPv4',
			body: 'Semua alamat IPv4 yang mungkin ada sekitar <b>4,3 miliar</b>. Kedengarannya banyak, sampai semua orang minta satu.'
		},
		{
			title: 'Makin penuh',
			body: 'Tiap HP, laptop, atau kamera baru mengambil satu alamat dari kolam yang sama.'
		},
		{
			title: 'Habis',
			body: 'Tahun 2011 blok besar terakhir sudah dibagikan. Perangkat tetap datang, tapi nggak ada lagi yang bisa diberikan.'
		},
		{
			title: 'Alamat IPv6',
			body: 'Delapan kelompok huruf dan angka, dipisah titik dua. Panjang, tapi jarang kamu ketik sendiri.'
		},
		{
			title: 'Cukup untuk semuanya',
			body: 'Seluruh kolam IPv4 cuma setitik di dalam IPv6. Praktis nggak mungkin habis.'
		},
		{
			title: 'Titik atau titik dua',
			tag: 'cara ingat',
			body: 'Titik dan 4 angka berarti <b>IPv4</b>. Titik dua, huruf, dan 8 kelompok berarti <b>IPv6</b>.'
		},
		{
			title: 'Ke mana versi 5',
			tag: 'info',
			body: 'Versi 5 cuma eksperimen yang nggak pernah jadi internet, jadi hitungannya lompat dari 4 ke 6.'
		},
		{
			title: 'Dua duanya sekaligus',
			tag: 'giliranmu',
			body: 'Kebanyakan HP sekarang memegang alamat IPv4 dan IPv6 berdampingan. Opsional, coba tombol pasirnya.'
		}
	],
	v4Label: 'IPv4',
	v6Label: 'IPv6',
	partHint: '0 sampai 255',
	poolLabel: 'Semua alamat IPv4',
	poolCount: 'sekitar 4,3 miliar',
	yearLabel: 'Tahun {year}',
	outsideLabel: 'nggak kebagian alamat',
	fieldLabel: 'Semua alamat IPv6',
	fieldCount: 'sekitar 340 undesiliun',
	dotLabel: 'seluruh IPv4',
	ruleV4: 'titik, 4 angka',
	ruleV6: 'titik dua, huruf, 8 kelompok',
	skipped: 'nggak pernah dipakai',
	bothLabel: 'HP mu sekarang',
	sandBtn: 'Kasih alamat ke tiap butir pasir',
	sandLabel: 'tiap butir pasir di Bumi'
};
