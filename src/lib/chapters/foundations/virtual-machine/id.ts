import type { VirtualMachineText } from '../../types';

export const id: VirtualMachineText = {
	title: 'Apa itu virtual machine?',
	intro: [
		'Lihat laptop ini. Di dalamnya cuma ada satu mesin, CPU, RAM, dan disk. Dan biasanya satu mesin cuma menjalankan satu sistem untuk satu pemakai.',
		'Padahal mesin yang kuat sering banget nganggur, tenaganya kepakai sedikit doang. Triknya, satu mesin dibelah jadi beberapa komputer virtual. Teknik membelahnya namanya <b>virtualization</b>, dan tiap potongan hasilnya namanya <b>virtual machine</b> (VM).',
		'Tiap VM punya sistem operasi sendiri dan merasa seperti komputer utuh, padahal semuanya berbagi satu hardware. Mirip gedung apartemen, satu bangunan, banyak unit, tiap penghuni punya pintu sendiri. Simpan baik baik konsep ini, sebentar lagi dia jadi kunci.',
		'Mesinnya sudah menunggu, 8 vCPU dan 16 GB RAM yang banyak nganggurnya. Tambah VM satu per satu sampai penuh, dan perhatikan jatah CPU dan RAM ikut terbagi.',
		'[ingat] Beberapa VM dapat berjalan pada satu komputer fisik dan berbagi sumber dayanya.'
	],
	reactions: {
		first:
			'Satu sayatan, dan VM 1 langsung dapat jatahnya sendiri, 2 vCPU dan 4 GB, lengkap dengan sistem operasinya sendiri. Dia merasa jadi komputer utuh, padahal cuma sepotong.',
		more: 'Tambah terus. Tiap VM dapat potongan tenaga yang sama dan saling tidak bisa mengintip, persis unit apartemen yang bertetangga.',
		full: 'Penuh. Satu mesin fisik sekarang berisi 4 komputer yang berdiri sendiri sendiri, dan tenaga yang tadinya nganggur kepakai semua. Trik inilah yang dipakai di mana mana.'
	},
	hostLabel: 'Satu mesin fisik',
	hostCpu: '8 vCPU',
	hostRam: '16 GB RAM',
	virtLayer: 'Virtualization',
	virtSub: 'membagi satu mesin fisik jadi banyak VM',
	singleLabel: 'Satu sistem',
	singleSub: 'Seluruh sumber daya untuk satu sistem',
	addVm: 'Tambah VM',
	vmName: 'VM {n}',
	vmSub: 'OS sendiri',
	perVm: 'Tiap VM 2 vCPU, 4 GB',
	usedLabel: 'CPU teralokasi {n}%',
	fullLabel: '4 komputer dalam 1 mesin',
	prompt: 'Tambahkan VM selama sumber daya tersedia'
};
