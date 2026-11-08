import type { PortText } from '../../types';

export const id: PortText = {
	title: 'Apa itu port?',
	intro: [
		'Tiap server cuma punya satu alamat, tapi di balik alamat itu ada banyak pintu bernomor. Tiap pintu namanya <b>port</b>, dan tiap layanan nungguin di pintunya sendiri.',
		'Bayangin server itu gedung dengan satu alamat tapi banyak pintu. Jadi pas nyambung, kamu nggak cuma sebut alamat, tapi juga pintu mana yang mau kamu tuju.',
		'[fyi] Biar nggak ketuker ya. Port yang ini pintu <b>logis</b>, cuma angka di dalam server. Di router atau switch, misalnya [[MikroTik|netlab/router-intro]] atau [[Cisco|netlab/cisco-intro]], ada juga port <b>fisik</b>, lubang tempat kamu colok kabel LAN (di MikroTik namanya ether1, ether2, dan seterusnya). Sama sama disebut port, tapi beda dunia.',
		'Ketuk tiap pintu buat lihat layanan apa yang nungguin di baliknya.',
		'[ingat] IP memilih komputer, port memilih layanan di komputer itu.'
	],
	reactions: {
		'22': 'Port 22 itu pintu <b>SSH</b>, buat masuk ke terminal server Linux dari jauh.',
		'80': 'Port 80 itu pintu <b>web biasa</b> (HTTP), tempat halaman website dikirim ke browser.',
		'443': 'Port 443 itu pintu <b>web aman</b> (HTTPS), sama seperti 80 tapi terenkripsi.',
		'3389': 'Port 3389 itu pintu <b>RDP</b>, buat remote desktop ke server Windows.',
		'5432':
			'Port 5432 itu pintu <b>database Postgres</b>, tempat aplikasi baca dan tulis data. Tiap database beda portnya, MySQL misalnya di 3306.',
		all: 'Nah, satu alamat, banyak pintu, tiap layanan punya port sendiri. Makanya nanti pas masuk ke server cloud, <b>SSH lewat port 22</b> dan <b>RDP lewat port 3389</b>. Angka angka ini cuma default yang umum dipakai, dan sebenarnya bisa kamu ganti sendiri.'
	},
	addrLabel: 'Satu alamat',
	address: 'nimbus.com',
	tapHint: 'Ketuk tiap pintu buat lihat layanannya.',
	ports: [
		{ port: '22', name: 'SSH', desc: 'pintu remote terminal buat ngatur server Linux.' },
		{ port: '80', name: 'Web', desc: 'pintu website biasa (HTTP).' },
		{ port: '443', name: 'Web aman', desc: 'pintu website terenkripsi (HTTPS).' },
		{ port: '3389', name: 'RDP', desc: 'pintu remote desktop buat server Windows.' },
		{ port: '5432', name: 'Postgres', desc: 'pintu aplikasi nyambung ke database Postgres.' }
	]
};
