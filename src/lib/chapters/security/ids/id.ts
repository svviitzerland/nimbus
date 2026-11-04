import type { IdsText } from './types';

export const id: IdsText = {
	title: 'IDS dan IPS',
	intro: [
		'[[Firewall|networking/firewall]] itu kayak penjaga pintu yang pegang daftar tamu. Dia memeriksa siapa yang datang dan pintu mana yang dituju. Tapi gimana kalau tamunya ada di daftar, padahal tasnya berisi barang berbahaya?',
		'<b>IDS</b> (Intrusion Detection System) memeriksa isi tasnya. Dia membaca setiap request yang lewat dan membandingkannya dengan daftar trik serangan yang sudah dikenal, namanya <b>signature</b>. Kalau cocok, alarm bunyi.',
		'Dia juga belajar seperti apa yang normal. Satu pengunjung yang mencoba halaman login tiga ratus kali per menit itu nggak normal, walaupun tiap requestnya kelihatan sopan.',
		'<b>IPS</b> (Intrusion Prevention System) melakukan semua itu dan juga bisa langsung menghentikan request di tempat. IDS itu kamera CCTV yang menelepon kamu, IPS itu satpam yang menutup pintu.',
		"Bagian tersulitnya adalah menyetel. Terlalu ketat, pengunjung asli bernama O'Brien ikut diblokir gara gara tanda petik di namanya (namanya <b>false positive</b>). Terlalu longgar, serangan yang menyamar malah lolos (namanya <b>false negative</b>).",
		'[fyi] Idenya lebih tua dari web. Tahun 1987 peneliti Dorothy Denning menjelaskan cara mengenali penyusup dari perilaku yang nggak wajar, dan tahun 1998 Martin Roesch merilis <b>Snort</b>, IDS gratis yang masih dipakai sampai sekarang. Di cloud kamu tinggal menyewanya sebagai layanan siap pakai.',
		'[ingat] IDS itu Detektif, cuma mengamati lalu lapor. IPS itu Penjaga, bisa langsung menghadang. D untuk Detektif, P untuk Penjaga.',
		'Kalau mau, giliran kamu. Ganti penjaganya antara mode kamera dan mode satpam, lalu lihat apa yang terjadi pada serangan yang sama.'
	],
	reactions: {
		ids: 'Mode kamera. Semua serangan tetap sampai ke server, tapi sekarang ada yang dikabari. Berguna, cuma lebih lambat.',
		ips: 'Mode satpam. Serangannya berhenti di pos jaga dan nggak pernah menyentuh nimbus.com.'
	},
	steps: [
		{
			title: 'Firewall',
			body: 'Firewall memeriksa <b>alamat dan pintu</b> tiap pengunjung. Dia nggak pernah membuka tasnya.'
		},
		{
			title: 'Signature',
			body: 'IDS membandingkan tiap request dengan <b>signature</b> serangan yang sudah dikenal, kayak papan foto buronan.'
		},
		{
			title: 'Nggak normal',
			body: 'Dia juga menandai perilaku yang <b>nggak biasa</b>, misalnya terlalu banyak percobaan dari satu tempat.'
		},
		{
			title: 'Alarm atau blokir',
			body: '<b>IDS</b> cuma membunyikan alarm. <b>IPS</b> berdiri tepat di jalur dan memblokir.'
		},
		{
			title: 'Menyetel',
			body: '<b>False positive</b>, pengunjung baik ikut diblokir. <b>False negative</b>, serangan asli terlewat. Yang satu ditukar dengan yang lain.'
		},
		{
			tag: 'Info',
			title: 'Ide lama',
			body: 'Snort masih gratis. Provider cloud menjual ide yang sama sebagai layanan, sering disebut <b>WAF</b> (web application firewall).'
		},
		{
			tag: 'Cara ingat',
			title: 'D atau P',
			body: 'D untuk <b>Detektif</b>, P untuk <b>Penjaga</b>.'
		},
		{
			tag: 'Giliranmu',
			title: 'Kamera atau satpam',
			body: 'Ganti modenya dan lihat dua serangan yang sama datang lagi.'
		}
	],
	internetLabel: 'Internet',
	serverLabel: 'nimbus.com',
	firewallName: 'Firewall',
	idsName: 'IDS',
	ipsName: 'IPS',
	verdicts: {
		pass: 'Pintu 443, silakan',
		ok: 'Kelihatan normal',
		alarm: 'Serangan, alarm',
		blocked: 'Serangan, diblokir',
		unusual: 'Nggak normal, alarm',
		falsePos: 'Salah blokir',
		falseNeg: 'Terlewat'
	},
	cameraMode: 'Kamera (IDS)',
	guardMode: 'Satpam (IPS)'
};
