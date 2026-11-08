import type { ReleaseText } from './types';

export const id: ReleaseText = {
	title: 'Strategi rilis',
	intro: [
		'Versi 2 nimbus.com sudah lolos semua test di [[pipeline CI/CD|compute/cicd]]. Tapi ada bug yang baru muncul kalau dipakai orang sungguhan, di HP sungguhan, dengan data sungguhan. Test nggak bisa menangkap semuanya.',
		'Cara paling polos, ganti semua server ke v2 sekaligus. Kalau v2 rusak, <b>semua</b> pengguna kena error, dan untuk mundur kamu harus deploy ulang versi lama sementara situsnya kebakaran.',
		'<b>Blue green</b> menyiapkan dua lingkungan yang kembar. Blue menjalankan v1 dan melayani semua orang, green berisi v2 dan menunggu. [[Load balancer|traffic/load-balancer]] memindahkan semua lalu lintas ke green sekaligus, dan kalau ada yang salah, langsung dipindah balik ke blue. Membatalkannya cuma sedetik.',
		'<b>Canary</b> mengirim v2 ke sebagian kecil pengguna dulu, misalnya 5 persen, lalu memantau errornya. Kalau sehat, porsinya dinaikkan pelan pelan. Kalau jelek, yang sedikit itu dikembalikan ke v1 dan hampir nggak ada yang sadar.',
		'[fyi] Namanya dari tambang batu bara. Dulu penambang membawa burung kenari (canary) ke bawah tanah, karena burung kecil itu lebih dulu merasakan gas beracun dibanding manusia. 5 persen pengguna pertamamu itulah peringatan dininya.',
		'[ingat] Canary mengirim versi baru ke sebagian trafik dahulu. Pantau hasilnya sebelum memperluas rilis atau melakukan rollback.',
		'v2 di sini menyimpan bug tersembunyi. Coba ketiga cara merilisnya. Perhatikan berapa banyak pengguna yang kena, dan seberapa cepat kamu bisa membatalkannya.'
	],
	reactions: {
		bigbang:
			'Semua pengguna kena bug di detik yang sama. Itulah masalahnya rilis sekaligus, satu versi jelek langsung menghantam semua orang.',
		slowBack:
			'Kembali ke v1, tapi deploy ulangnya makan waktu, dan selama itu pengguna melototi error terus.',
		flipped:
			'Load balancer memindahkan semua orang ke green, dan green ada bugnya. Cepat, balikkan.',
		flipBack:
			'Balik dalam sedetik. Blue dari tadi masih menjalankan v1, jadi membatalkannya cukup dengan memindah lalu lintasnya.',
		canary:
			'Cuma sebagian kecil pengguna yang dapat v2, dan error di kelompok itu sudah kelihatan. Sisanya aman aman saja.',
		canaryBig:
			'Makin besar porsinya, makin banyak yang kena bug. Tim sungguhan cuma menaikkan canary selama jumlah errornya tetap nol.',
		canaryBack:
			'Pengguna yang sedikit itu sudah kembali ke v1. Bugnya cuma melukai segelintir orang, bukan semuanya, dan timnya bisa membetulkan dengan tenang.',
		both: 'Sekarang kamu kenal dua jagoannya. Blue green memberi tombol batal instan, canary menjaga kerusakannya tetap kecil. Banyak tim bahkan menggabungkan keduanya.'
	},
	modes: ['Sekaligus', 'Blue green', 'Canary'],
	usersLabel: '{n} dari 20 pengguna kena error',
	allOk: 'Semua 20 pengguna senang',
	lbLabel: 'Load balancer',
	blueLabel: 'Blue, v1',
	greenLabel: 'Green, v2',
	liveTag: 'live',
	deployAllBtn: 'Deploy v2 ke semua server',
	rollbackBtn: 'Mundur ke v1',
	rollingBack: 'Deploy ulang v1...',
	switchToGreen: 'Pindahkan ke green',
	switchToBlue: 'Balikkan ke blue',
	canaryLabel: '{n}% pengguna di v2',
	canaryBack: 'Kembalikan semua ke v1',
	bugNote: 'v2 menyimpan bug yang lolos dari test'
};
