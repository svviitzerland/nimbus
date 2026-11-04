import type { NetworkText } from '../types';

export const id: NetworkText = {
	title: 'Private network dan subnet',
	intro: [
		'Server servermu di cloud tinggal di sebuah <b>VPC</b>, private network milikmu sendiri. Bayangkan sebuah rumah dengan pagar, kamu yang menentukan ruangan dan pintunya.',
		'Di dalamnya, ruangan ruangan itu namanya <b>subnet</b>. Yang menghadap jalan disebut <b>public subnet</b>, pintunya terbuka ke internet, di sinilah web server menyambut pengunjung.',
		'Yang di belakang disebut <b>private subnet</b>, tidak punya pintu ke jalan sama sekali. Database ditaruh di sini, cuma boleh diajak bicara oleh web server dari dalam.',
		'[fyi] Di kantor yang punya server sendiri (on premise), ide yang sama dibangun pakai kotak sungguhan. Ruangannya dipisah pakai subnet dan [[VLAN|network/vlan]] di switch, pagarnya firewall di router seperti [[MikroTik|netlab/router-intro]] atau [[Cisco|netlab/cisco-intro]]. Bedanya, di cloud semuanya virtual dan cukup diatur dari layar, sedangkan di kantor kamu sendiri yang beli alatnya dan colok kabelnya.',
		'Rumah berpagarnya sudah berdiri lengkap dengan dua ruangan itu. Kirim pengunjung lewat pintu depan, lalu iseng todong database-nya langsung dari internet dan lihat sejauh mana dia bisa masuk.'
	],
	reactions: {
		web: 'Pengunjung masuk lewat pintu depan, dilayani web server di public subnet, dan web server-lah yang mengambilkan data ke database di belakang. Tamu tidak pernah menyentuh database.',
		blocked:
			'Ditolak mentah mentah. Private subnet tidak punya pintu ke internet, jadi orang iseng tidak bisa menyentuh database-mu walau tahu alamatnya. Itulah gunanya memisahkan ruangan.'
	},
	vpcLabel: 'VPC',
	vpcSub: 'private network milikmu',
	internetLabel: 'Internet',
	publicLabel: 'Public subnet',
	publicSub: 'pintunya ke internet',
	privateLabel: 'Private subnet',
	privateSub: 'tanpa pintu keluar',
	webLabel: 'Web server',
	dbLabel: 'Database',
	visitSite: 'Kunjungi situs',
	attackDb: 'Todong database dari luar',
	noteIdle: 'Dua ruangan, cuma satu yang punya pintu',
	noteWeb: 'Tamu dilayani di depan, data diambilkan dari belakang',
	noteBlocked: 'Tidak ada pintu, tidak ada jalan masuk'
};
