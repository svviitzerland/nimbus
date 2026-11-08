import type { QosText } from './types';

export const id: QosText = {
	title: 'Apa itu QoS',
	intro: [
		'Senin pagi di kantor nimbus.com. Ada yang lagi video call sama klien, ada yang curi curi main game sebentar, dan ada yang mulai download update 40 GB. Semuanya desak desakan lewat satu jalur internet.',
		'Ingat [[bandwidth|trafficflow/bandwidth-throughput]], tiap jalur punya batas atas. Kalau data yang datang lebih banyak dari yang bisa dibawa jalur, router nyuruh paket nunggu di <b>antrean</b>. Kalau antreannya penuh, paket baru langsung dibuang.',
		'Bawaannya, antrean itu siapa cepat dia dapat. Paket video call yang mungil kejebak di belakang puluhan potongan download, jadi nyampenya telat atau malah nggak nyampe. Suara yang telat itu nggak ada gunanya, makanya call jadi patah patah dan macet.',
		'<b>QoS</b> (Quality of Service) bikin router bisa ngurutin antrean itu berdasarkan <b>prioritas</b>. Trafik yang benci nunggu (call, game) jalan duluan, trafik yang santai (download gede) ambil sisanya. Download hampir nggak kerasa bedanya, cuma kelarnya sedikit lebih lama.',
		'[fyi] Di router MikroTik, ini diatur pakai queue, yang bakal kamu temui di [[manajemen bandwidth|netlab/router-queue]]. Jaringan besar bahkan nempelin nomor prioritas di dalam header tiap paket (namanya DSCP), jadi tiap router di sepanjang jalan tahu siapa yang duluan.',
		'[ingat] QoS mengatur prioritas dan pembagian kapasitas trafik. Ia tidak menambah kapasitas fisik sambungan.',
		'Di sini jalur kantornya lagi macet. Lihat callnya kesusahan, terus nyalain QoS dan kasih prioritas ke tiap jenis trafik.'
	],
	reactions: {
		stutter:
			'Kedengeran? Callnya terus macet. Paketnya nunggu di belakang potongan download, dan sebagian dibuang waktu antreannya meluap. Jalurnya nggak rusak, cuma penuh.',
		qosOn:
			'QoS udah nyala, tapi semua trafik masih punya prioritas yang sama, jadi antreannya kerja persis kayak tadi. Kasih tahu router siapa yang paling penting.',
		allSame: 'Semua kelas memiliki prioritas sama, sehingga belum ada trafik yang didahulukan.',
		dlFirst:
			'Aduh, sekarang download nyerobot di depan semuanya, dan callnya makin parah. Download nggak keberatan nunggu, kasih dia posisi paling bawah.',
		callFixed:
			'Callnya lancar lagi, paketnya sekarang boleh nyelak antrean. Tapi gamenya masih kejebak di belakang download, naikin juga dong.',
		fixed:
			'Call lancar, game responsif, dan download tetap jalan, cuma sedikit lebih pelan. Nggak ada yang dapat bandwidth tambahan, router cuma milih urutan yang lebih pintar. Itulah QoS.',
		qosOff: 'QoS mati, balik lagi ke siapa cepat dia dapat, dan callnya mulai patah patah lagi.'
	},
	qosLabel: 'QoS',
	on: 'nyala',
	off: 'mati',
	flows: ['Video call', 'Game', 'Download'],
	priorityBtn: 'Prioritas {p}',
	priorities: ['rendah', 'biasa', 'tinggi'],
	smooth: 'lancar',
	stutter: 'patah patah',
	lag: 'lag',
	delay: 'delay {n} ms',
	speed: '{n} Mbps',
	dropped: '{n} hilang',
	routerLabel: 'Router kantor',
	queueLabel: 'Antrean, nunggu giliran keluar',
	lineLabel: 'Jalur internet, 30 Mbps',
	noteOff: 'Siapa cepat dia dapat',
	noteOn: 'Prioritas lebih tinggi keluar duluan'
};
