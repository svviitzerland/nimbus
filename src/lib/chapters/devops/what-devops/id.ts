import type { WhatDevopsText } from './types';

export const id: WhatDevopsText = {
	title: 'Apa itu DevOps',
	intro: [
		'Dulu, perusahaan software terbelah dua. <b>Developer</b> (Dev) menulis fitur baru. <b>Operations</b> (Ops) menjaga server tetap hidup. Di antara mereka berdiri tembok yang tinggi.',
		'Developer kerja berbulan bulan, menumpuk semua perubahan ke satu kotak besar, lalu melemparnya ke balik tembok. Ops yang harus memasangnya di server, tanpa tahu isinya apa.',
		'Ya jelas ada yang rusak. Developer bilang "di laptopku jalan kok", Ops bilang "kodemu yang rusak". Dua duanya takut hari rilis, jadi rilisnya makin jarang, dan kotaknya makin besar lagi.',
		'<b>DevOps</b> merobohkan tembok itu. Dev dan Ops jadi satu tim yang membangun, mengirim, dan merawat aplikasinya bareng bareng. Kuncinya, kirim <b>perubahan kecil, sesering mungkin</b>, dan biarkan mesin mengerjakan bagian yang membosankan, seperti [[pipeline CI/CD|compute/cicd]] yang sudah kamu kenal.',
		'[fyi] DevOps awalnya adalah cara kerja, bukan alat. Namanya mulai populer sekitar 2009, waktu orang mulai bikin konferensi "DevOpsDays". Sekarang "DevOps engineer" juga jadi nama pekerjaan, tapi idenya tetap sama, satu tim, langkah kecil.',
		'Tiap rilis di sini menyimpan satu bug tersembunyi, persis kayak di dunia nyata. Geser ritmenya, kirim setahun sekali, lalu kirim tiap hari, dan bandingkan mana yang lebih bikin deg degan.'
	],
	reactions: {
		yearly:
			'Aduh. Satu kotak raksasa, ratusan perubahan, dan bugnya ngumpet entah di mana. Situsnya mati selama semua orang mengubek ubek kotak mencari biang keroknya. Pantas saja dulu orang takut hari rilis.',
		middle:
			'Kotaknya lebih kecil, nyarinya juga lebih cepat. Kelihatan kan, makin kecil kotaknya makin ringan sakitnya. Coba geser sampai mentok.',
		daily:
			'Cuma satu perubahan kecil yang keluar. Dia rusak, tapi tersangkanya cuma satu, jadi dibatalkan dalam hitungan menit. Penggunamu hampir nggak sadar.',
		both: 'Itulah inti DevOps. Makin sering kamu kirim, makin kecil tiap rilisnya, dan makin kecil rilisnya, makin nggak menakutkan. Perusahaan besar bisa rilis ratusan kali sehari justru karena alasan ini.'
	},
	everyLabel: 'Rilis tiap',
	cadences: ['tahun', '3 bulan', 'bulan', 'minggu', 'hari'],
	devLabel: 'Dev',
	opsLabel: 'Ops',
	oneTeam: 'Satu tim',
	wallLabel: 'tembok',
	changesTag: '{n} perubahan',
	changesOne: '1 perubahan',
	waitLabel: 'Fitur yang sudah jadi menunggu',
	waits: [
		'sampai setahun',
		'sampai 3 bulan',
		'sampai sebulan',
		'sampai seminggu',
		'paling lama sehari'
	],
	findLabel: 'Mencari bugnya butuh',
	finds: ['2 hari', '1 hari', '6 jam', '1 jam', '5 menit'],
	shipBtn: 'Kirim rilis ini',
	againBtn: 'Kirim lagi',
	downTag: 'mati',
	backTag: 'beres',
	noteIdle: 'Pilih ritmenya, lalu kirim kotaknya',
	noteBig: 'Bugnya ngumpet di antara {n} perubahan. Butuh {t} untuk menemukannya.',
	noteSmall: 'Cuma satu perubahan yang dicek. Beres dalam 5 menit.'
};
