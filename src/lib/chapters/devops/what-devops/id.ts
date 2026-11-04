import type { WhatDevopsText } from './types';

export const id: WhatDevopsText = {
	title: 'Apa itu DevOps',
	intro: [
		'Dulu, orang orang yang bikin aplikasi dipecah jadi dua tim. <b>Developer</b> (Dev) nulis fitur baru di laptop mereka. <b>Operations</b> (Ops) ngejaga [[server|foundations/server]] tetap nyala. Di antara mereka berdiri tembok tinggi.',
		'Developer kerja berbulan bulan dan numpuk semua perubahan ke satu kotak raksasa. Terus kotaknya dilempar lewat tembok, dan Ops harus masang tanpa tahu isinya apa.',
		'Ya jelas ada yang rusak. Dev bilang di laptopnya jalan kok, Ops bilang kodenya yang rusak. Hari rilis jadi menakutkan, jadi rilisnya makin jarang, dan kotaknya makin gede.',
		'<b>DevOps</b> ngerobohin tembok itu. Namanya cuma gabungan dua kata tadi, karena Dev dan Ops jadi satu tim yang bareng bareng bikin, ngirim, dan ngerawat aplikasinya.',
		'Rahasianya, kirim <b>perubahan kecil, tapi sering</b>. Bagian yang membosankan dikerjain mesin, ngetes dan ngirim tiap kotak kecil sendiri, kayak [[pipeline CI/CD|compute/cicd]] yang udah kamu kenal.',
		'Kotak kecil juga kadang rusak. Tapi kalau isinya cuma satu perubahan, kamu langsung tahu salahnya di mana. Tarik balik, benerin, kirim lagi, semuanya beres dalam beberapa menit.',
		'[ingat] <b>Kecil tapi sering, jangan besar tapi jarang.</b> Kotak kecil gampang dicek dan gampang ditarik balik. Kotak raksasa nyembunyiin bugnya kayak jarum di tumpukan jerami.',
		'[fyi] DevOps awalnya cara kerja, bukan alat yang tinggal diinstal. Namanya mulai ngetren sekitar 2009, waktu orang mulai bikin acara DevOpsDays. Sekarang DevOps engineer juga jadi nama pekerjaan, tapi idenya tetap sama, satu tim, langkah kecil.',
		'Mau bandingin? Ganti ganti antara cara lama dan cara DevOps, terus lihat gimana kotaknya jalan. Atau tonton aja terus, itu juga boleh.'
	],
	reactions: {
		old: 'Cara lama lagi. Satu kotak raksasa terbang lewat tembok, servernya merah, dan semua orang mulai saling tunjuk. Nyari satu bug di antara ratusan perubahan bisa makan waktu berhari hari.',
		new: 'Balik ke DevOps. Satu tim, kotak kecil terus mengalir, dan kalau ada masalah, tersangkanya cuma satu perubahan.'
	},
	steps: [
		{
			tag: 'Dua tim',
			title: 'Dev dan Ops',
			body: '<b>Developer</b> bikin fitur baru. <b>Operations</b> ngejaga server tetap hidup. Dulu mereka jarang banget ngobrol.'
		},
		{
			tag: 'Rilis cara lama',
			title: 'Satu kotak raksasa',
			body: 'Perubahan berbulan bulan dikirim sekaligus. Ops nerima kotak yang belum pernah mereka lihat.'
		},
		{
			tag: 'Hari rilis',
			title: 'Saling salahin',
			body: 'Isinya ratusan perubahan, jadi nggak ada yang tahu mana yang bikin situsnya rusak. Akhirnya rilis berikutnya ditunda lebih lama lagi.'
		},
		{
			tag: 'Idenya',
			title: 'DevOps',
			body: 'Dev ditambah Ops, satu tim. Yang nulis kode juga ikut ngejalanin, jadi nggak ada yang dilempar lewat tembok.'
		},
		{
			tag: 'Kebiasaannya',
			title: 'Kecil dan sering',
			body: 'Tiap kotak isinya satu perubahan kecil. Pipeline ngetes dan ngirimnya sendiri, berkali kali seminggu, bahkan sehari.'
		},
		{
			tag: 'Kalau rusak',
			title: 'Tersangkanya satu',
			body: 'Yang keluar cuma satu perubahan, jadi penyebabnya jelas. Ditarik balik dan dibenerin dalam hitungan menit, bukan hari.'
		},
		{
			tag: 'Biar nempel',
			title: 'Kecil menang',
			body: '<b>Kecil tapi sering</b> ngalahin <b>besar tapi jarang</b>. Lihat setahun di bawah, banyak kotak mungil, bukan satu kotak raksasa.'
		},
		{
			tag: 'Sejarah',
			title: 'Cara kerja',
			body: 'DevOps itu soal orang dulu. Alatnya (pipeline, otomasi, monitoring) datang setelah timnya mau kerja sebagai satu tim.'
		},
		{
			tag: 'Opsional',
			title: 'Bandingin',
			body: 'Ganti antara dua cara kerja ini dan perhatiin kotaknya.'
		}
	],
	devLabel: 'Dev',
	opsLabel: 'Ops',
	oneTeam: 'Satu tim',
	blameDev: 'Di laptopku jalan kok',
	blameOps: 'Kodemu yang rusak',
	bigBox: '200 perubahan',
	oneChange: 'Cuma 1 perubahan dicek',
	fixed: 'Udah dibenerin',
	yearLabel: 'Rilis dalam setahun',
	modeLabel: 'Pilih cara kerja',
	oldBtn: 'Cara lama',
	newBtn: 'Cara DevOps'
};
