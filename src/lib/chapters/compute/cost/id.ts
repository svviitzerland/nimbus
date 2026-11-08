import type { CostText } from '../types';

export const id: CostText = {
	title: 'Mengatur biaya',
	intro: [
		'Di cloud kamu bayar sesuai pakai. Enaknya di situ, bahayanya juga di situ, karena semua yang lupa dimatikan terus menagih diam diam.',
		'Dua pemborosan yang paling sering bikin tagihan membengkak, yaitu server <b>nganggur</b> yang menyala terus tanpa kerjaan, dan server <b>kebesaran</b> yang tenaganya cuma kepakai sedikit.',
		'Solusinya namanya <b>right sizing</b>, yaitu menyesuaikan ukuran server dengan kebutuhan nyata. Matikan yang nganggur, kecilkan yang kebesaran, dan tagihanmu langsung turun tanpa situsmu terganggu sedikit pun.',
		'Tagihan bulan ini lagi bengkak, dan dua pemborosannya bersembunyi di antara tiga server itu. Bereskan keduanya dan lihat angkanya menyusut.',
		'[ingat] Tagihan mengikuti sumber daya dan pemakaian. Ukur dulu sebelum memilih yang lebih besar.'
	],
	reactions: {
		off: 'Satu server nganggur dimatikan, tiga puluh dolar langsung balik ke kantong tiap bulan. Di perusahaan sungguhan, pemborosan beginilah yang paling sering kejadian.',
		resize:
			'Mesin kebesaran dikecilkan menjadi pas, kerjanya tetap beres, harganya jauh lebih murah. Itulah right sizing.'
	},
	billLabel: 'Tagihan bulan ini',
	perMonth: 'per bulan',
	idleName: 'Server uji coba',
	idleSub: 'nyala terus, kepakai 2%',
	bigName: 'Server laporan',
	bigSub: 'gede banget, kepakai 15%',
	rightName: 'Server web',
	rightSub: 'ukurannya pas',
	turnOff: 'Matikan',
	downsize: 'Kecilkan',
	offTag: 'mati, $0',
	resizedTag: 'pas sekarang',
	savedTag: 'hemat ${n}',
	noteIdle: 'Ada dua pemborosan bersembunyi di tagihan ini',
	noteOff: 'Yang nganggur tidak menagih lagi',
	noteResize: 'Yang kebesaran sekarang pas',
	noteDone: 'Tagihan turun, situs tetap jalan'
};
