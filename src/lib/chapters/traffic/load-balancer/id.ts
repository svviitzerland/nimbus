import type { LoadBalancerText } from '../types';

export const id: LoadBalancerText = {
	title: 'Load balancer',
	intro: [
		'Satu server itu ada batasnya. Selama trafik kalem, dia santai. Tapi begitu pengunjung membludak, dia kewalahan.',
		'Bayangkan kamu lagi adain <b>flash sale</b>. Jam 12 tepat, ribuan orang buka situsmu barengan. Satu server langsung penuh, situs melambat, lalu down.',
		'Solusinya, taruh <b>load balancer</b> di depan beberapa server yang identik. Tugasnya membagi permintaan ke semua server, biasanya bergiliran satu per satu (namanya round robin, ada juga cara lain seperti memilih server yang paling sepi), jadi tidak ada satu pun yang kebanjiran sendirian.',
		'Bonusnya, kalau satu server mati, balancer langsung berhenti mengirim ke server itu dan mengalihkan trafik ke yang masih hidup. Pengunjung tidak sadar apa apa.',
		'Flash salenya tinggal dimulai, dan baru ada satu server yang berjaga. Biarkan dia tumbang dulu, lalu pasang load balancer dengan beberapa server dan perhatikan bebannya terbagi rata.'
	],
	reactions: {
		overload:
			'Nah, satu server tidak kuat menampung lonjakan flash sale. Bebannya tembus merah dan situs mulai down. Tambahkan load balancer biar bebannya dibagi.',
		balanced:
			'Lihat, sekarang beban terbagi rata ke semua server. Semuanya tetap hijau dan situs tetap ngebut walau trafik tinggi. Itulah kerja load balancer.',
		rerouted:
			'Satu server mati, tapi balancer langsung mengalihkan trafiknya ke server yang masih hidup. Situs jalan terus tanpa gangguan.'
	},
	startSale: 'Mulai flash sale',
	addServer: 'Tambah server',
	killServer: 'Matikan satu server',
	reset: 'Ulangi',
	balancerLabel: 'Load balancer',
	balancerNote: 'membagi pengunjung rata',
	serverLabel: 'Server {n}',
	crowdOne: '1 pengunjung',
	crowdMany: 'Pengunjung membludak',
	promptStart: 'Situs lagi sepi, baru satu pengunjung dan satu server. Coba bikin tiba tiba rame.',
	promptOverload: 'Pengunjung membludak ke satu server dan dia kewalahan. Coba tambah server.',
	promptBalanced:
		'Sekarang ada beberapa server, dan load balancer membagi pengunjung rata ke semuanya. Coba matikan satu server.',
	promptDone:
		'Satu server mati, tapi load balancer langsung mengalihkan pengunjung ke yang lain. Situs tetap jalan.',
	statusUp: 'Online',
	statusOver: 'Kewalahan',
	statusDown: 'Mati',
	siteFast: 'Situs ngebut',
	siteSlow: 'Situs lambat',
	siteDown: 'Situs down',
	loadLabel: 'Beban'
};
