import type { ContainerText } from '../types';

export const id: ContainerText = {
	title: 'Container',
	intro: [
		'Aplikasimu tidak jalan sendirian. Dia butuh bahasa pemrograman, library, dan file pengaturan. Pindahkan ke komputer lain, satu saja kelupaan, langsung error. Klasik, "di laptopku jalan kok".',
		'Makanya semua kebutuhannya dibungkus jadi satu paket bernama <b>container</b>. Lihat susunannya. Paling bawah mesinnya, di atasnya <b>Docker</b> sebagai alas yang menjalankan container, dan di atasnya container container berdiri rapi, masing masing membawa kebutuhannya sendiri.',
		'<b>Docker</b> itu alat container paling umum, hampir semua orang mulai dari sini. Kalau mesinnya lebih dari satu, ada <b>Docker Swarm</b> yang membuat beberapa mesin menjalankan container bersama sama.',
		'<b>Kubernetes</b> membantu mengatur container di beberapa mesin melalui control plane. Ia bisa menjaga jumlah replika dan mengganti yang gagal. Docker tidak wajib dipasangkan dengan Kubernetes. Kita akan mencoba [[Kubernetes|devops/kubernetes]] setelah memahami container.',
		'Sekarang giliran aplikasimu yang dibungkus. Jadikan dia sebuah image, lalu jalankan salinan yang sama persis di tiga tempat berbeda.',
		'[ingat] Container membawa aplikasi dan kebutuhannya, sambil berbagi kernel sistem operasi host.'
	],
	reactions: {
		built:
			'Image-nya jadi. Aplikasi, library, dan pengaturannya terkunci rapi dalam satu paket yang tidak bisa kelupaan apa apa.',
		ran: 'Dan jalan semuanya. Tiga tempat berbeda, container yang sama persis, tanpa drama "di laptopku jalan". Itulah kenapa container dipakai di mana mana.'
	},
	buildLabel: 'Bungkus jadi image',
	runLabel: 'Jalankan di 3 tempat',
	imageLabel: 'nimbus-app v1',
	machines: ['Laptopmu', 'Server kantor', 'Cloud'],
	sameTag: 'sama persis',
	pieces: ['app.js', 'library', 'config'],
	yourLaptop: 'Laptopmu',
	otherMachine: 'Komputer lain',
	brokenTag: 'error, ada yang kelupaan',
	archMachine: 'Mesin, laptop atau server',
	archDocker: 'Docker',
	archApps: ['App A + kebutuhannya', 'App B + kebutuhannya'],
	swarmTag: 'Docker Swarm, beberapa mesin diatur bersama',
	k8sPlane: 'Control plane, otak Kubernetes',
	nodeLabel: 'Node {n}',
	k8sBadge: 'auto scaling & failover otomatis',
	noteIdle: 'Bungkus dulu aplikasimu',
	noteBuilt: 'Terbungkus rapi, siap dibawa ke mana saja',
	noteRan: 'Satu image, tiga tempat, hasil yang sama persis'
};
