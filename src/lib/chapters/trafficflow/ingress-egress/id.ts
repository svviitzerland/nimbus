import type { IngressEgressText } from '../types';

export const id: IngressEgressText = {
	title: 'Ingress dan egress',
	intro: [
		'Server kamu kerjanya dua arah, ada data yang masuk dan ada yang keluar.',
		'Yang masuk ke server, kayak permintaan dan unggahan foto, namanya <b>ingress</b>. Yang keluar dari server, kayak foto dan video yang dikirim balik ke pengunjung, namanya <b>egress</b>.',
		'Coba dua duanya, orang upload foto (masuk) lalu orang unduh foto (keluar), dan perhatiin tagihannya.',
		'[ingat] Ingress masuk, egress keluar. Selalu tentukan dulu sisi yang sedang kamu ukur.'
	],
	reactions: {
		in: 'Itu <b>ingress</b>, data masuk ke server kamu. Di cloud, ingress biasanya <b>gratis</b>, jadi tagihannya nggak gerak.',
		out: 'Itu <b>egress</b>, data keluar dari server kamu. Di cloud, egress <b>dibayar</b>, makanya tagihannya naik tiap server ngirim ke pengunjung.',
		both: 'Jadi ingress masuk (gratis), egress keluar (dibayar). Makin banyak yang diunduh atau ditonton pengunjung, makin gede tagihan egress. Inilah kenapa nanti <b>caching</b> dan <b>CDN</b> penting, biar nggak semua harus keluar dari server kamu.'
	},
	visitorLabel: 'Pengunjung',
	serverLabel: 'Server kamu di cloud',
	billLabel: 'Tagihan egress',
	pickIn: 'Orang upload foto',
	pickOut: 'Orang unduh foto',
	inTag: 'Masuk, gratis',
	outTag: 'Keluar, dibayar'
};
