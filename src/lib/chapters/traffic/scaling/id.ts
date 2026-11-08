import type { ScalingText } from '../types';

export const id: ScalingText = {
	title: 'Vertical vs horizontal scaling',
	intro: [
		'Trafikmu makin naik dan satu server biasa mulai keteteran. Ada dua cara menambah tenaga, dan keduanya beda gaya.',
		'Cara pertama namanya <b>vertical scaling</b>. Kamu bikin satu mesin jadi lebih kuat, tambah CPU, RAM, dan disknya. Gampang dinaikin, tapi ada batas atasnya, dan kalau mau diturunkan lagi malah ribet karena mesin harus dimatikan dulu.',
		'Cara kedua namanya <b>horizontal scaling</b>. Daripada satu mesin gede, kamu pakai banyak mesin identik dan bagi bebannya lewat load balancer. Nambah atau ngurangin gampang, dan kalau satu mati yang lain tetap jalan.',
		'Dua sisi ini mulai dari mesin yang sama persis. Naikkan pengunjungnya sampai keduanya keteteran, lalu selamatkan sisi kiri lewat Upgrade dan sisi kanan lewat Tambah.',
		'[ingat] Vertical membesarkan satu server. Horizontal menambah jumlah server.'
	],
	reactions: {
		surge:
			'Pengunjungnya naik dan servernya mulai kewalahan. Sekarang selamatkan dua duanya, sisi kiri dengan upgrade mesin, sisi kanan dengan nambah mesin.',
		vertical:
			'Vertical scaling bikin satu mesin yang sama jadi lebih besar, CPU, RAM, dan disknya naik. Kapasitasnya ikut naik. Terus upgrade sampai mentok.',
		ceiling:
			'Nah, mentok. Mesinnya sudah paling gede dan nggak bisa lebih. Itu batas atas vertical scaling, dan tetap satu titik yang kalau mati semua ikut mati. Coba Horizontal.',
		downgrade:
			'Lihat, buat ngecilin mesin dia harus dimatikan dulu, jadi situs sempat down. Naik gampang, turun ribet. Itu sisi repot vertical scaling.',
		horizontal:
			'Horizontal scaling nambah mesin identik dan load balancer membagi pengunjung rata. Mau nambah atau ngurangin gampang tanpa matiin apa apa, dan satu mesin mati pun yang lain tetap melayani.'
	},
	tabVertical: 'Vertical',
	tabHorizontal: 'Horizontal',
	hintVertical: 'Tambah kapasitas satu server',
	hintHorizontal: 'Tambah jumlah server',
	trafficLabel: 'Pengunjung',
	levelCalm: 'Sepi',
	levelBusy: 'Ramai',
	levelFlood: 'Sangat ramai',
	statusOk: 'Kapasitas cukup',
	statusOver: 'Kewalahan',
	promptRaise: 'Tambah pengunjung untuk melihat batas kapasitas kedua sistem.',
	promptRescue: 'Tambah kapasitas server di kiri atau jumlah server di kanan.',
	promptDone:
		'Dua duanya kuat lagi, tapi caranya beda. Yang kiri mesinnya membesar, yang kanan mesinnya bertambah.',
	specCpu: 'CPU',
	specRam: 'RAM',
	specDisk: 'Disk',
	perMachineSpec: 'Tiap mesin 2 vCPU, 4 GB',
	capacity: 'Kapasitas sekitar {n} pengunjung',
	upgrade: 'Upgrade',
	downgrade: 'Turunkan',
	maxedOut: 'Kapasitas maksimum',
	siteDown: 'Situs down sebentar',
	addMachine: 'Tambah',
	removeMachine: 'Kurangi',
	balancerLabel: 'Load balancer',
	machineLabel: 'Mesin {n}',
	tradeoffVertical:
		'Simpel, tapi ada batas atas dan menurunkannya ribet karena mesin harus mati dulu.',
	tradeoffHorizontal:
		'Lentur, gampang nambah atau ngurangi, dan tahan satu mesin mati. Butuh load balancer.'
};
