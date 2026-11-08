import type { WhatDevopsText } from './types';

export const id: WhatDevopsText = {
	title: 'Apa itu DevOps',
	intro: [
		'Tim pengembangan menulis fitur nimbus.com, sementara tim operasi menjaga layanan tetap berjalan. Keduanya perlu berbagi informasi tentang perubahan dan kondisi aplikasi.',
		'Dalam contoh ini, perubahan dikumpulkan lama sebelum diserahkan ke tim operasi. Akibatnya, satu rilis memuat banyak hal yang perlu dipahami, diuji, dan dipasang bersamaan.',
		'Jika rilis bermasalah, tim harus mencari perubahan penyebabnya. Semakin banyak perubahan dalam satu rilis, semakin banyak kemungkinan yang perlu diperiksa.',
		'<b>DevOps</b> adalah cara kerja yang menghubungkan pengembangan dan operasi melalui tanggung jawab bersama, otomatisasi, dan umpan balik. Perubahan kecil serta [[CI/CD|compute/cicd]] membantu tim menguji dan mengirim perbaikan.',
		'[fyi] DevOps awalnya adalah cara kerja, bukan alat. Namanya mulai populer sekitar 2009, waktu orang mulai bikin konferensi "DevOpsDays". Sekarang "DevOps engineer" juga jadi nama pekerjaan, tapi idenya tetap sama, satu tim, langkah kecil.',
		'[ingat] <b>Perubahan kecil, umpan balik cepat.</b> Uji, rilis, pantau, dan perbaiki bersama. DevOps mencakup kerja sama tim serta prosesnya, bukan satu alat tertentu.',
		'Setiap rilis simulasi memuat satu bug untuk membandingkan banyaknya kode yang perlu diperiksa. Coba rilis tahunan dan harian, lalu bandingkan ukuran setiap perubahan.'
	],
	reactions: {
		yearly:
			'Rilis ini berisi banyak perubahan. Dalam simulasi, pemeriksaan memerlukan waktu lebih lama karena lebih banyak bagian yang mungkin menjadi penyebab.',
		middle:
			'Jumlah perubahan berkurang, sehingga bagian yang perlu diperiksa lebih sedikit. Bandingkan dengan rilis harian.',
		daily:
			'Rilis ini hanya memuat satu perubahan. Pada contoh ini, tim lebih cepat mengidentifikasi dan membatalkannya. Waktu nyata bergantung pada sistem dan kesiapan pemulihan.',
		both: 'Ukuran perubahan memengaruhi kemudahan pengujian dan penelusuran masalah. Frekuensi rilis perlu didukung otomatisasi, pemantauan, dan kemampuan pemulihan.'
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
	findLabel: 'Waktu pencarian dalam simulasi',
	finds: ['2 hari', '1 hari', '6 jam', '1 jam', '5 menit'],
	shipBtn: 'Kirim rilis ini',
	againBtn: 'Kirim lagi',
	downTag: 'mati',
	backTag: 'beres',
	noteIdle: 'Pilih ritmenya, lalu kirim kotaknya',
	noteBig: 'Ada {n} perubahan untuk diperiksa. Perkiraan latihan {t}.',
	noteSmall: 'Satu perubahan diperiksa. Waktu simulasi 5 menit.'
};
