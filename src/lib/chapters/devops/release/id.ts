import type { ReleaseText } from './types';

export const id: ReleaseText = {
	title: 'Strategi rilis',
	intro: [
		'Versi 2 nimbus.com udah lolos semua tes di [[pipeline CI/CD|compute/cicd]]. Tapi ada bug yang baru muncul kalau dipakai orang beneran, di HP beneran, dengan data beneran. Tes nggak bisa nangkep semuanya.',
		'Cara paling polos, pindahin semua orang ke v2 sekaligus. Kalau v2 punya bug tersembunyi, <b>semua</b> user kena error di detik yang sama, dan ngebalikinnya butuh waktu.',
		'<b>Canary release</b> lebih halus. [[Load balancer|traffic/load-balancer]] (pembagi trafik di tengah) ngirim v2 cuma ke sedikit user dulu, di sini satu dari sepuluh. Sisanya tetap di v1.',
		'Terus kamu pantau. Satu user canary itu kena bugnya, dan error cuma naik di v2. Itu tanda bahayanya.',
		'Jadi user itu langsung dibalikin ke v1. Sembilan dari sepuluh nggak sadar apa apa. Timnya benerin bug dan nyiapin versi 2.1.',
		'Versi yang udah dibenerin mulai kecil lagi. Kalau tetap sehat, porsinya naik pelan pelan, satu dari sepuluh, terus nambah, terus setengah, terus semuanya.',
		'[ingat] Namanya dari tambang batu bara. Penambang dulu bawa burung <b>kenari</b> (canary) ke bawah tanah, karena burung kecil itu ngerasain gas beracun duluan sebelum manusia. <b>Kirim burung kecil duluan</b>, sedikit user dulu, baru semuanya.',
		'[fyi] Ada juga cara <b>blue green</b>. Kamu punya dua setup yang identik, blue jalanin versi lama dan green jalanin versi baru, terus load balancer mindahin semua orang sekaligus. Kalau ada yang aneh, tinggal dipindah balik.',
		'Mau bandingin? Rilis v2 yang ada bugnya ke semua orang sekaligus, atau sebagai canary, terus hitung berapa user yang kena.'
	],
	reactions: {
		bigbang:
			'Aduh, sepuluh user kena error barengan. Bugnya ketemu sih, tapi semua orang ikut kena, dan ngebalikinnya makan waktu.',
		canary:
			'Cuma satu dari sepuluh yang lihat error, dan dalam hitungan detik dia udah balik ke v1. Sembilan lainnya nggak tahu ada kejadian apa apa.'
	},
	steps: [
		{
			tag: 'Situasinya',
			title: 'Versi baru',
			body: 'Sepuluh user (HP di atas) lagi nyaman di <b>v1</b>. Versi 2 nunggu di kanan, dengan bug yang belum ketahuan.'
		},
		{
			tag: 'Sekaligus',
			title: 'Semua kena',
			body: 'Sepuluh HP pindah ke v2 bareng, jadi sepuluh sepuluhnya lihat error. Terus semuanya harus dipindah balik.'
		},
		{
			tag: 'Idenya',
			title: 'Canary release',
			body: 'Cuma <b>satu dari sepuluh HP</b> yang ke v2. Sembilan lainnya tetap pakai v1 kayak nggak ada apa apa.'
		},
		{
			tag: 'Memantau',
			title: 'Tanda bahaya',
			body: 'Error cuma muncul di v2. Yang kena satu user, dan sekarang timnya tahu ada yang salah.'
		},
		{
			tag: 'Batalin',
			title: 'Balik aman',
			body: 'User itu balik ke v1 dalam hitungan detik. Bugnya dibenerin, dan <b>v2.1</b> siap.'
		},
		{
			tag: 'Membesar',
			title: 'Pelan pelan',
			body: '1 dari 10, lalu 3, lalu 5, lalu semua 10. Tiap langkah nunggu dulu, errornya harus tetap nol.'
		},
		{
			tag: 'Biar nempel',
			title: 'Burung kecil',
			body: 'Sedikit user dulu, baru semuanya. Kenarinya ngasih tanda sebelum seisi tambang kena masalah.'
		},
		{
			tag: 'Cara lain',
			title: 'Blue green',
			body: 'Dua setup identik, dan satu saklar yang mindahin semua orang sekaligus, dan bisa balik secepat itu juga.'
		},
		{
			tag: 'Opsional',
			title: 'Bandingin',
			body: 'Rilis v2 yang ada bugnya dengan salah satu cara, terus hitung HP yang merah.'
		}
	],
	lbLabel: 'Load balancer',
	usersLabel: 'Sepuluh user',
	errors: '{n} dari 10 user kena error',
	allOk: 'Nggak ada yang kena error',
	rule: 'Sedikit dulu, baru semua',
	pickLabel: 'Rilis v2 yang ada bugnya',
	bigbangBtn: 'Ke semua sekaligus',
	canaryBtn: 'Sebagai canary'
};
