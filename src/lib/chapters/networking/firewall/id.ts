import type { FirewallText } from '../types';

export const id: FirewallText = {
	title: 'Firewall',
	intro: [
		'Layanan yang dapat dijangkau jaringan perlu membatasi trafik yang diterima. Aturan akses membantu menentukan koneksi mana yang diizinkan.',
		'<b>Firewall</b> memeriksa trafik berdasarkan aturan, misalnya alamat sumber, tujuan, protokol, dan port. Trafik dapat diizinkan atau ditolak.',
		'Pada latihan ini, izinkan trafik yang diperlukan situs dan tolak trafik lainnya. Aturan harus sesuai kebutuhan layanan agar pengguna yang sah tetap bisa mengaksesnya.',
		'[fyi] Penyaringan trafik dapat dilakukan di komputer, router, dan layanan cloud. Contohnya [[firewall MikroTik|netlab/router-firewall]], [[ACL Cisco|netlab/cisco-acl]], dan security group AWS. Detail aturan tiap alat berbeda.',
		'Kirim trafik web dan trafik yang tidak diizinkan. Perhatikan keputusan firewall pada masing masing request.',
		'[ingat] Firewall memeriksa aturan lalu lintas. Aturan yang terlalu longgar ikut membuka jalan yang tidak diinginkan.'
	],
	reactions: {
		allow: 'Trafik cocok dengan aturan izin, jadi firewall meneruskannya ke server.',
		deny: 'Orang iseng tidak ada di daftar, langsung ditolak di depan pintu bahkan sebelum menyentuh server. Itulah firewall, menolak dulu, mengizinkan seperlunya.'
	},
	guardLabel: 'Firewall',
	guardSub: 'Memeriksa trafik berdasarkan aturan',
	serverLabel: 'Server',
	rulesTitle: 'Aturan trafik',
	ruleAllow: 'Izinkan trafik web',
	ruleDeny: 'Tolak trafik lainnya',
	guestWeb: 'Trafik web',
	guestBad: 'Trafik yang diblokir',
	sendWeb: 'Kirim trafik web',
	sendBad: 'Kirim trafik yang diblokir',
	allowedTag: 'masuk',
	deniedTag: 'ditolak',
	noteIdle: 'Firewall siap memeriksa trafik',
	noteAllow: 'Trafik cocok dengan aturan izin',
	noteDeny: 'Trafik cocok dengan aturan penolakan'
};
