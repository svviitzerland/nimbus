import type { ConfigMgmtText } from './types';

export const id: ConfigMgmtText = {
	title: 'Configuration management',
	intro: [
		'nimbus.com sekarang lagi rame. Dia jalan di enam server di belakang [[load balancer|traffic/load-balancer]], dan hari ini versi 2 aplikasinya udah siap. Keenam server itu semuanya butuh update.',
		'Cara manualnya, masuk ke tiap server pakai [[SSH|cloud/remote-access]] (cara ngetik perintah di komputer lain), ngetik perintah yang sama, terus pindah ke server berikutnya. Satu satu, enam kali.',
		'Kira kira di server keempat kamu mulai capek, dan ada salah ketik nyelip. Sekarang satu server rusak dan sisanya nggak sama semua. Bayangin kalau servernya ada seratus.',
		'<b>Configuration management</b> ngeberesin ini. Kamu tulis sekali gimana seharusnya tiap server (versi aplikasi berapa, settingannya apa), terus ada alat yang bikin semuanya sama.',
		'Alat yang populer namanya <b>Ansible</b>. Daftar langkahnya ada di file yang namanya <b>playbook</b>. Ansible masuk ke enam server itu buat kamu, jalanin langkahnya di semua server sekaligus, terus lapor balik.',
		'Jalanin lagi pun nggak bakal ada yang rusak. Ansible ngecek tiap server dulu, kalau udah sesuai ya dibiarin. Laporannya cuma bilang nggak ada yang berubah.',
		'[ingat] <b>Tulis sekali, beres semua.</b> Playbook itu satu daftar cek yang dibacain ke semua server barengan. Server yang udah sesuai cuma ngangguk dan nunggu.',
		'[fyi] [[Terraform|devops/iac]] yang bikin servernya, Ansible yang ngatur isi di dalamnya, jadi tim sering pakai dua duanya. Tim jaringan juga suka Ansible, bisa ngatur ratusan router dan switch sekaligus.',
		'Mau coba? Pencet satu server buat ngacak acak dia pakai tangan, terus lihat playbook ngerapiinnya lagi. Atau tonton aja terus.'
	],
	reactions: {
		drift:
			'Server itu diubah pakai tangan, jadi dia melenceng dari playbook. Ansible jalan lagi, cuma benerin yang satu itu, dan nggak nyentuh yang lain.'
	},
	steps: [
		{
			tag: 'Tugasnya',
			title: 'Enam server, satu update',
			body: 'Semua server masih jalan di <b>v1</b>. Keenamnya harus pindah ke <b>v2</b>, dengan settingan yang sama persis.'
		},
		{
			tag: 'Pakai tangan',
			title: 'Satu per satu',
			body: 'Masuk, ketik perintah, keluar, lanjut. Beberapa baris yang sama, diketik terus berulang ulang.'
		},
		{
			tag: 'Masalahnya',
			title: 'Salah ketik nyelip',
			body: '<b>nimbus-ap</b>, bukan nimbus-app. Kurang satu huruf, server itu rusak sementara yang lain udah lanjut.'
		},
		{
			tag: 'Idenya',
			title: 'Tulis sekali',
			body: 'Satu file yang bilang gimana tiap server seharusnya. Di sini isinya pasang versi 2, terus restart aplikasinya.'
		},
		{
			tag: 'Alatnya',
			title: 'ansible-playbook',
			body: 'Satu perintah. Ansible nyampe ke enam server sekaligus dan jalanin langkah yang sama di tiap server, tanpa salah ketik.'
		},
		{
			tag: 'Aman diulang',
			title: 'changed=0',
			body: 'Semuanya udah sesuai, jadi nggak ada yang disentuh. Playbook boleh dijalanin sesering yang kamu mau.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tulis sekali, beres semua',
			body: 'Satu daftar cek buat semua server. Yang udah sesuai cukup ngangguk.'
		},
		{
			tag: 'Perlu tahu',
			title: 'Terraform dan Ansible',
			body: '<b>Terraform</b> bikin mesinnya, <b>Ansible</b> ngatur isi di dalamnya.'
		},
		{
			tag: 'Opsional',
			title: 'Rusakin satu',
			body: 'Pencet satu server buat ngubahnya pakai tangan. Playbook jalan dan ngembaliin dia.'
		}
	],
	terminalTab: 'Terminal',
	serversLabel: 'Server',
	brokenTag: 'rusak',
	driftTag: 'diubah',
	tapHint: 'Pencet satu server'
};
