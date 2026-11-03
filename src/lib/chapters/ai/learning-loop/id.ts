import type { LearningLoopText } from './types';

export const id: LearningLoopText = {
	title: 'Gradient descent',
	intro: [
		'Masih ingat [[neural network|ai/neural-net]] payung yang belajar sendiri? Tiap langkah dia menggeser bobotnya sedikit biar makin jarang salah. Hari ini kita zoom ke gerakan itu, namanya <b>gradient descent</b>.',
		'Bayangkan satu bobot saja. Untuk tiap nilai yang mungkin, jaringannya salah tebak sekian hari. Kalau digambar, jadinya seperti bentang alam, tinggi di tempat tebakannya jelek dan rendah di tempat tebakannya bagus. Modelnya mengincar <b>dasar lembah</b>.',
		'Masalahnya, model nggak bisa melihat seluruh bentang alamnya. Rasanya seperti berdiri di bukit yang tertutup kabut tebal. Yang bisa kamu rasakan cuma tanah di bawah kaki dan ke arah mana miringnya. Kemiringan itu namanya <b>gradient</b>, istilah keren untuk lereng.',
		'Jadi resepnya sederhana. Rasakan lerengnya, melangkah turun, rasakan lagi, melangkah lagi. Tebak, ukur seberapa salah, geser sedikit, lalu ulangi berkali kali. Hampir semua AI modern belajar dengan putaran ini.',
		'Seberapa besar tiap langkah juga punya nama, <b>learning rate</b>. Langkah mini itu aman tapi lambat banget. Lompatan raksasa malah bisa melewati lembahnya dan mendarat lebih tinggi dari tempat awal.',
		'[fyi] Jaringan sungguhan punya jutaan bahkan miliaran bobot, jadi bentang alamnya punya arah sebanyak itu sekaligus. Nggak ada yang bisa membayangkannya, tapi bolanya tetap menggelinding dengan cara yang sama, turun sedikit di semua arah bersamaan.',
		'Ini bolaku di bukit kesalahan, lagi nangkring di bobot yang jelek. Pilih ukuran langkah, lalu melangkah sendiri atau biarkan menggelinding. Coba yang mini, yang raksasa, lalu cari yang sampai ke dasar dengan cepat.'
	],
	reactions: {
		step: 'Satu langkah! Bolanya merasakan lereng di bawahnya (panah kecil itu) lalu bergerak turun. Lihat meteran salahnya, barusan turun sedikit.',
		small:
			'Langkah sekecil ini memang aman, tapi lihat lambatnya merayap. Melatih AI sungguhan begini bisa makan waktu lama dan listrik yang banyak. Coba langkah yang lebih besar.',
		zigzag:
			'Lihat dia loncat dari sisi lembah satu ke sisi lainnya? Langkahnya agak kebesaran jadi kelewatan, tapi akhirnya tetap tenang juga.',
		big: 'Waduh, tiap lompatan mendarat makin tinggi! Kalau learning rate kebesaran, modelnya malah makin buruk, bukan makin bagus. Geser slidernya mundur.',
		flew: 'Bolanya terbang keluar dari bukit. Di pelatihan sungguhan inilah saat angkanya meledak dan modelnya rusak (orang bilang <b>diverge</b>). Ulangi dan pilih langkah yang lebih kalem.',
		slow: 'Sampai juga ke dasar, walau agak lama. Berhasil sih, tapi engineer selalu mencari ukuran langkah yang lebih cepat sampai. Bisa nggak kamu sampai dalam dua belas langkah atau kurang?',
		bottom:
			'Dasar lembah, cuma dalam beberapa langkah! Itu titik pasnya. Jaringan payung tadi melakukan persis ini, hanya saja untuk semua bobotnya sekaligus dan ribuan kali.'
	},
	axisWeight: 'nilai bobot',
	axisError: 'seberapa salah',
	lowest: 'paling sedikit salah',
	stepBtn: 'Melangkah sekali',
	rollBtn: 'Biar menggelinding',
	rolling: 'Menggelinding, langkah {n}',
	reset: 'Ulangi',
	rateLabel: 'Ukuran langkah (learning rate)',
	rateLow: 'langkah mini',
	rateHigh: 'lompatan raksasa',
	rateTags: ['mini', 'pas', 'loncat loncat', 'kebesaran'],
	errorLabel: 'Seberapa salah',
	steps: '{n} langkah',
	slopeHint: 'Panahnya menunjukkan arah turun',
	flew: 'Bolanya terbang keluar bukit',
	bottom: 'Sampai di dasar dalam {n} langkah'
};
