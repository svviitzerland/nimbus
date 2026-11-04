import type { QosText } from './types';

export const id: QosText = {
	title: 'Apa itu QoS',
	intro: [
		'Senin pagi di kantor nimbus.com. Ada yang lagi video call sama klien, ada yang nyolong main game sebentar, dan ada yang mulai download 40 GB. Semuanya desak desakan lewat satu jalur internet.',
		'Tiap jalur punya batas atas (ingat [[bandwidth|trafficflow/bandwidth-throughput]]). Kalau yang datang lebih banyak dari yang bisa dibawa, router ngantriin paketnya di <b>queue</b>, alias antrean, kayak mobil di gerbang tol.',
		'Bawaannya, antreannya siapa cepat dia dapat. Paket call yang hijau dan mungil kejebak di belakang tumpukan potongan download yang oranye. Suara yang telat itu nggak ada gunanya, jadi call nya putus putus.',
		'<b>QoS</b> (Quality of Service) bikin router bisa ngurutin antrean itu berdasarkan <b>prioritas</b>. Lihat paket call dan game nyelip ke depan.',
		'Call nya mulus lagi. Download nya hampir nggak kerasa, cuma selesai beberapa detik lebih lama. Yang benci nunggu jalan duluan, yang santai ambil sisanya.',
		'[ingat] QoS itu kayak ambulans di jalan macet. Semua minggir buat dia, truk truk tetap sampai rumah, cuma agak telat dikit.',
		'[fyi] Di router MikroTik ini diatur pakai queue, yang nanti kamu temui di [[manajemen bandwidth|netlab/router-queue]]. Jaringan besar bahkan nempelin nomor prioritas di dalam tiap paket (namanya DSCP), jadi tiap router di sepanjang jalan tahu siapa yang duluan.',
		'Itulah QoS, antrean yang lebih pintar. Kalau mau lihat bedanya, matiin terus nyalain lagi.'
	],
	reactions: {
		qosOff:
			'Siapa cepat dia dapat lagi. Paket call nunggu di belakang potongan download, dan suaranya mulai putus putus.',
		qosOn: 'Prioritas nyala lagi. Paket call nyelip ke depan antrean, suaranya mulus lagi.'
	},
	steps: [
		{
			title: 'Satu jalur, tiga kerjaan',
			body: 'Video call, game, dan download gede semuanya pakai jalur internet yang sama.'
		},
		{
			title: 'Antrean',
			body: 'Kalau paket datang lebih cepat dari yang bisa dikirim jalurnya, mereka nunggu di <b>queue</b> di dalam router.'
		},
		{
			title: 'Siapa cepat dia dapat',
			body: 'Tanpa aturan, paket call nunggu di belakang tiap potongan download di depannya. Suara yang telat kedengaran rusak.'
		},
		{
			title: 'Prioritas',
			body: 'Dengan <b>QoS</b> router ngirim paket yang mendesak duluan. Call dan game itu mendesak, download nggak.'
		},
		{
			title: 'Semua tetap nyampe',
			body: 'Call langsung dapat paket yang dia butuhin. Download tinggal pakai sisanya.'
		},
		{
			tag: 'Pegangan',
			title: 'Jalur ambulans',
			body: 'Yang mendesak jalan duluan. Yang gede tetap nyampe, cuma agak telat.'
		},
		{
			title: 'Paket bertanda',
			body: 'Nomor prioritas namanya <b>DSCP</b> bisa ikut di dalam tiap paket, jadi semua router di jalan ngurutinnya dengan cara yang sama.'
		},
		{
			title: 'Coba deh',
			body: 'Matiin dan nyalain QoS, terus perhatiin paket call yang hijau.'
		}
	],
	flows: ['Video call', 'Game', 'Download'],
	routerLabel: 'Antrean router',
	lineLabel: 'Jalur kantor',
	qosOn: 'QoS nyala',
	qosOff: 'QoS mati',
	callStatus: 'Video call',
	smooth: 'mulus',
	stutter: 'putus putus',
	offBtn: 'Matiin QoS',
	onBtn: 'Nyalain QoS'
};
