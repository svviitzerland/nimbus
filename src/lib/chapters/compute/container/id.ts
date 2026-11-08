import type { ContainerText } from '../types';

export const id: ContainerText = {
	title: 'Container',
	intro: [
		'Aplikasimu tidak jalan sendirian. Dia butuh bahasa pemrograman, library, dan file pengaturan. Pindahkan ke komputer lain, satu saja kelupaan, langsung error. Klasik, "di laptopku jalan kok".',
		'Makanya semua kebutuhannya dibungkus jadi satu paket bernama <b>container</b>. Lihat susunannya. Paling bawah mesinnya, di atasnya <b>Docker</b> sebagai alas yang menjalankan container, dan di atasnya container container berdiri rapi, masing masing membawa kebutuhannya sendiri.',
		'<b>Docker</b> itu alat container paling umum, hampir semua orang mulai dari sini. Kalau mesinnya lebih dari satu, ada <b>Docker Swarm</b> yang membuat beberapa mesin menjalankan container bersama sama.',
		'<b>Kubernetes</b> mengatur container pada beberapa mesin. <b>Control plane</b> mengoordinasikan penempatan dan menjaga jumlah container sesuai konfigurasi. Docker tidak harus digunakan bersama Kubernetes. Proyek kecil dapat menjalankan container tanpa Kubernetes.',
		'Paket container itu disimpan sebagai <b>image</b>, cetakan beku yang siap dijalankan. Image ditaruh di <b>registry</b>, gudang online khusus image, dan yang paling terkenal <b>Docker Hub</b>. Kamu <b>push</b> (kirim) image dari laptop ke sana, lalu tiap server tinggal <b>pull</b> (ambil) image yang sama dari situ.',
		'Sekarang giliran aplikasimu yang dibungkus. Jadikan dia sebuah <b>image</b> (cetakan beku yang bisa dijalankan jadi container di mana saja), lalu jalankan salinan yang sama persis di tiga tempat berbeda.',
		'[ingat] Container membawa aplikasi dan kebutuhannya, sambil berbagi kernel sistem operasi host.'
	],
	reactions: {
		built:
			'Image sudah jadi. Aplikasi, library, dan pengaturannya terkunci rapi dalam satu paket yang tidak bisa kelupaan apa apa.',
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
	k8sBadge: 'scaling & failover otomatis',
	noteIdle: 'Bungkus dulu aplikasimu',
	noteBuilt: 'Terbungkus rapi, siap dibawa ke mana saja',
	noteRan: 'Satu image, tiga tempat, hasil yang sama persis',
	registryName: 'Docker Hub',
	registrySub: 'registry, gudang image',
	pushTag: 'push',
	pullTag: 'pull',
	serverLabel: 'Server {n}'
};
