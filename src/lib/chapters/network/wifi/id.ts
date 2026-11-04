import type { WifiText } from './types';

export const id: WifiText = {
	title: 'Apa itu WiFi',
	intro: [
		'<b>WiFi</b> itu radio. Gelombang tak terlihat yang sejenis dengan yang membawa lagu FM ke radio mobil, cuma router memakainya buat mengantar data ke HP kamu, dan HP kamu membalas lewat gelombang yang sama.',
		'Kebanyakan router bicara di dua <b>band</b>. Yang pertama <b>2.4 GHz</b>. Gelombangnya panjang, jadi bisa menembus tembok dan jangkauannya jauh, tapi data yang dibawanya lebih sedikit.',
		'Yang kedua <b>5 GHz</b>. Jauh lebih cepat, tapi gelombangnya yang pendek gampang tertahan tembok dan lebih cepat melemah. Lewat dua tembok, biasanya sudah hilang.',
		'[ingat] Angka kecil, jangkauan jauh. Dari balik tembok kamu bisa dengar bass musik tetangga, tapi nggak pernah dengar siulannya. 2.4 GHz itu bassnya, 5 GHz itu siulannya.',
		'Tiap band dibagi jadi jalur jalur yang disebut <b>channel</b>. Di 2.4 GHz cuma ada tiga jalur yang nggak saling tumpang tindih (1, 6, dan 11). Kalau router tetangga ada di jalurmu, keduanya harus gantian bicara, dan dua duanya jadi lebih lambat.',
		'[fyi] WiFi cuma menutup beberapa meter terakhir, antara HP dan router. Dari router ke luar, semuanya lewat [[kabel|network/cabling]]. Oh ya, microwave di dapur juga memakai gelombang sekitar 2.4 GHz, makanya WiFi bisa tersendat waktu microwave menyala.',
		'Mau jalan jalan? Ketuk sebuah ruangan buat membawa HP ke sana, lalu lihat kedua bandnya.'
	],
	reactions: {
		near: 'Dekat router, dua band sama sama kuat, dan 5 GHz paling ngebut. Nggak ada yang menghalangi.',
		mid: 'Ada satu tembok di tengah. 2.4 GHz hampir nggak terpengaruh, tapi 5 GHz sudah kehilangan banyak.',
		far: 'Kebanyakan tembok buat 5 GHz, sinyalnya hilang. 2.4 GHz masih tembus, lebih lambat tapi tetap hidup. Makanya kamar yang jauh sering terasa lebih enak di 2.4.'
	},
	steps: [
		{
			title: 'Gelombang radio',
			body: 'Router mengirim data lewat udara sebagai gelombang radio. HP kamu mendengarkan, lalu membalas dengan cara yang sama.'
		},
		{
			title: '2.4 GHz',
			body: 'Gelombang panjang. Bisa menembus tembok dan jangkauannya jauh, tapi datanya lebih sedikit.'
		},
		{
			title: '5 GHz',
			body: 'Gelombang pendek. Jauh lebih cepat kalau dekat, tapi tiap tembok menelan sebagian besar gelombangnya.'
		},
		{
			tag: 'Cara ingat',
			title: 'Bass dan siulan',
			body: 'Angka kecil, jangkauan jauh. <b>2.4</b> jauh tapi lambat, <b>5</b> cepat tapi dekat.'
		},
		{
			title: 'Channel',
			body: 'Jalur di dalam sebuah band. Dua router di jalur yang sama harus gantian. Di 2.4 GHz, pilih <b>1</b>, <b>6</b>, atau <b>11</b>.'
		},
		{
			tag: 'FYI',
			title: 'Cuma beberapa meter terakhir',
			body: 'Dari router ke luar, data jalan lewat kabel. WiFi cuma lompatan pendek ke HP kamu.'
		},
		{
			tag: 'Coba',
			title: 'Jalan jalan',
			body: 'Ketuk sebuah ruangan. Lihat 5 GHz hilang di balik tembok sementara 2.4 GHz tetap bertahan.'
		}
	],
	routerLabel: 'Router',
	neighbourLabel: 'Tetangga',
	rooms: ['Ruang tamu', 'Dapur', 'Ruang kerja', 'Kamar', 'Taman'],
	bands: { b24: '2.4 GHz', b5: '5 GHz' },
	noSignal: 'nggak ada sinyal',
	laneLabel: 'Channel di 2.4 GHz',
	clashTag: 'gantian',
	clearTag: 'jalur sendiri',
	toInternet: 'ke internet',
	tapHint: 'Ketuk sebuah ruangan buat membawa HP ke sana'
};
