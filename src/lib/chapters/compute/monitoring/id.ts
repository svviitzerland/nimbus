import type { MonitoringText } from '../types';

export const id: MonitoringText = {
	title: 'Monitoring',
	intro: [
		'Pikirkan dashboard mobil. Ada speedometer, suhu mesin, sisa bensin. Tanpa itu kamu menyetir buta dan baru sadar mesin overheat setelah ngebul.',
		'Server juga begitu. <b>Metrik</b> adalah angka kesehatannya, pemakaian CPU, jumlah trafik, jumlah error, dan <b>dashboard</b> menampilkan semuanya dalam satu layar.',
		'Tapi kamu tidak mungkin melototin dashboard seharian. Makanya ada <b>alarm</b>. Kamu pasang batas, dan begitu terlewati, alarm langsung mengabarimu, jauh sebelum pengunjung merasa ada yang aneh.',
		'Dashboard sudah menyala dan ketiga angkanya masih hijau. Bikin trafiknya melonjak, dan tebak siapa yang berteriak duluan.',
		'[ingat] Ukur kondisi, bandingkan dengan kebutuhan, lalu bertindak saat ada masalah.'
	],
	reactions: {
		alarm:
			'Itu dia. CPU tembus batas dan alarm langsung mengabarimu, padahal pengunjung belum merasakan apa apa. Kamu dapat waktu untuk bertindak sebelum semuanya kacau. Itulah gunanya monitoring.'
	},
	cpuLabel: 'CPU',
	trafficLabel: 'Trafik',
	errorsLabel: 'Error',
	ruleLabel: 'Kalau CPU lewat 80%, bunyikan alarm',
	surge: 'Bikin trafik melonjak',
	again: 'Tenangkan lagi',
	alarmTag: 'ALARM',
	notifText: 'CPU 92%, cek servermu!',
	statusOk: 'Semua tenang',
	noteIdle: 'Tiga angka kesehatan servermu, semuanya hijau',
	noteAlarm: 'Alarm menyala sebelum pengunjung sadar'
};
