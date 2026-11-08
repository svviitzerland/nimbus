import type { ExperimentText } from '../../types';

export const id: ExperimentText = {
	title: 'ARP dan gateway',
	intro: [
		'Kita sudah punya [[IP|network/ip-address]] dan [[MAC|network/mac]]. Untuk IPv4 di LAN ini, komputer perlu tahu MAC penerima berikutnya sebelum mengirim data lewat Ethernet.',
		'<b>ARP</b> bertanya ke jaringan lokal, siapa yang punya IP ini? Pemiliknya menjawab dengan MAC. Hasilnya disimpan sebentar dalam <b>ARP cache</b>.',
		'Kirim ke komputer 192.168.1.20. Karena masih satu subnet, HP mencari MAC komputer itu. Coba kirim lagi, kali ini cache membuat pertanyaan ulang tidak perlu.',
		'Untuk nimbus.com di luar subnet, HP mencari MAC <b>gateway</b>, router yang menjadi pintu keluar. IP tujuan paket tetap server. MAC pada frame menunjuk penerima di langkah lokal ini.',
		'[ingat] <b>IP tujuan perjalanan, MAC penerima langkah berikutnya.</b> IPv6 memakai Neighbor Discovery, bukan ARP.'
	],
	reactions: {
		local: 'Komputer tetangga menjawab. Sekarang cache memasangkan IP lokal dengan MAC miliknya.',
		remote:
			'Yang dicari adalah MAC gateway, bukan MAC server di internet. Router meneruskan paket ke jaringan berikutnya.',
		cached:
			'Pasangannya sudah tersimpan. Frame bisa langsung dikirim tanpa menyiarkan pertanyaan ARP lagi.'
	},
	labLabel: 'Percobaanmu',
	goal: 'Cari penerima di jaringan lokal',
	tasks: ['Kirim ke tetangga', 'Kirim ke luar jaringan', 'Pakai cache'],
	hintLabel: 'Petunjuk',
	hint: 'Kirim ke tetangga, lalu ke nimbus.com. Ulangi salah satunya dan perhatikan cache.',
	scope: 'Simulasi lokal. Semua contoh berjalan di halaman ini tanpa menghubungi nimbus.com.',
	labels: {
		destination: 'Tujuan paket',
		local: 'Tetangga 192.168.1.20',
		remote: 'nimbus.com di internet',
		send: 'Kirim paket',
		you: 'HP kamu',
		router: 'Router rumah',
		cache: 'ARP cache di HP',
		empty: 'Belum ada pasangan alamat',
		broadcast: 'ARP mencari',
		cached: 'Cache menemukan',
		frame: 'MAC penerima frame',
		packet: 'IP tujuan paket',
		waiting: 'Pilih tujuan lalu kirim'
	}
};
