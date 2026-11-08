import type { BandwidthThroughputText } from '../types';

export const id: BandwidthThroughputText = {
	title: 'Bandwidth dan throughput',
	intro: [
		'Bayangin kamu naruh video di server, terus videonya viral. Banyak orang nonton bareng. Di sinilah bandwidth dan throughput kerasa.',
		'<b>Bandwidth</b> itu kapasitas jalan dari server-mu ke internet, batas atasnya. <b>Throughput</b> itu data yang beneran terkirim tiap detik.',
		'Tambah penonton satu satu sampai ada yang buffering, lalu upgrade bandwidth-nya.',
		'[ingat] Bandwidth adalah kapasitas sambungan. Throughput adalah jumlah data yang berhasil dikirim per detik.'
	],
	reactions: {
		full: 'Nah, penontonnya kebanyakan buat kapasitas bandwidth-mu. Throughput mentok di batas atas, jadi sebagian video mulai <b>buffering</b>. Persis kayak pas video tiba tiba rame ditonton.',
		fixed:
			'Setelah bandwidth di-upgrade, kapasitasnya naik, throughput bisa lebih tinggi, dan semua penonton lancar lagi. Jadi <b>bandwidth</b> itu batas atas, <b>throughput</b> yang beneran kepakai. Istilah lain yang sering kedengeran, <b>RPS</b> (request per detik), <b>concurrency</b> (berapa dilayani barengan), dan <b>jitter</b> (delay naik turun yang bikin video patah patah).'
	},
	sourceLabel: 'Video di server-mu',
	addBtn: 'Tambah penonton',
	upgradeBtn: 'Upgrade bandwidth',
	tpLabel: 'Throughput',
	bwLabel: 'Bandwidth',
	unit: 'MB/s',
	hd: 'HD',
	buffering: 'Buffering'
};
