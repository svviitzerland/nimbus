import type { LabPickText } from './types';

export const id: LabPickText = {
	title: 'Pilih perangkat lab',
	intro: [
		'Selamat datang di lab. Di sini kamu bukan cuma baca soal router, tapi beneran ngatur satu, lengkap dengan terminalnya, buat kantor kecil nimbus.',
		'Router itu dibuat banyak merek, dan dua yang paling sering kamu temui di dunia kerja adalah <b>MikroTik</b> dan <b>Cisco</b>. Konsepnya sama persis, IP, DHCP, NAT, firewall, cuma bahasa perintahnya yang beda.',
		'[fyi] MikroTik banyak dipakai ISP, warnet, dan RT RW net karena murah tapi kuat. Cisco merajai kantor dan perusahaan besar, dan sertifikasinya, CCNA, jadi salah satu yang paling dicari buat kerja di jaringan.',
		'[ingat] Mereknya beda, idenya sama. IP, DHCP, NAT, dan firewall ada di semua router, yang beda cuma cara ngetiknya. Jadi yang kamu pelajari di satu merek tetap kepakai di merek lain.',
		'Pilih satu buat didalami duluan. Tenang, yang satunya tetap ada di menu, kapan saja kamu bisa pindah dan coba dua duanya.'
	],
	reactions: {
		mikrotik:
			'MikroTik dipilih! Kamu bakal ngetik di terminal <b>RouterOS</b>, dari kasih nama router sampai bikin hotspot pakai voucher. Lanjut kalau sudah siap.',
		cisco:
			'Cisco dipilih! Kamu bakal ngetik di <b>Cisco IOS</b>, masuk mode enable dan configure, sampai ngamanin router pakai SSH. Ini bekal yang sama dengan materi awal CCNA. Lanjut kalau sudah siap.'
	},
	hint: 'Ketuk salah satu perangkat',
	pickedTag: 'pilihanmu',
	note: 'Mau coba yang satunya? Buka menu, labnya selalu ada di sana.',
	options: {
		mikrotik: {
			name: 'MikroTik',
			os: 'RouterOS',
			points: [
				'Favorit ISP dan RT RW net',
				'Bisa diatur lewat Winbox atau terminal',
				'Ada hotspot dan bagi bandwidth'
			]
		},
		cisco: {
			name: 'Cisco',
			os: 'Cisco IOS',
			points: [
				'Raja jaringan kantor dan perusahaan',
				'Bekal sertifikasi CCNA',
				'Ada VLAN, ACL, dan SSH'
			]
		}
	}
};
