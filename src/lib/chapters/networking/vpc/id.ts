import type { NetworkText } from '../types';

export const id: NetworkText = {
	title: 'Private network dan subnet',
	intro: [
		'<b>VPC</b> adalah jaringan virtual yang terisolasi secara logis di cloud. Kamu menentukan rentang IP, subnet, rute, dan aturan aksesnya.',
		'<b>Subnet</b> membagi rentang alamat dalam VPC. Pada contoh ini, public subnet memiliki rute ke internet gateway. Web server juga memerlukan alamat dan aturan akses yang sesuai agar dapat dijangkau.',
		'Yang di belakang disebut <b>private subnet</b>, tidak punya pintu ke jalan sama sekali. Database ditaruh di sini, cuma boleh diajak bicara oleh web server dari dalam.',
		'[fyi] Di kantor yang punya server sendiri (on premise), ide yang sama dibangun pakai kotak sungguhan. Ruangannya dipisah pakai subnet dan [[VLAN|network/vlan]] di switch, pagarnya firewall di router seperti [[MikroTik|netlab/router-intro]] atau [[Cisco|netlab/cisco-intro]]. Bedanya, di cloud semuanya virtual dan cukup diatur dari layar, sedangkan di kantor kamu sendiri yang beli alatnya dan colok kabelnya.',
		'Coba akses situs melalui web server. Lalu coba akses database langsung dari internet untuk melihat perbedaannya.',
		'[ingat] Jaringan privat memberi batas ruang. Route dan firewall menentukan jalur serta siapa yang bisa masuk.'
	],
	reactions: {
		web: 'Web server menerima request dan mengambil data dari database melalui jaringan privat. Pengunjung menerima hasil dari web server.',
		blocked:
			'Database ini tidak memiliki jalur akses langsung dari internet. Private subnet tetap memerlukan aturan akses yang tepat untuk sumber lain.'
	},
	vpcLabel: 'VPC',
	vpcSub: 'private network milikmu',
	internetLabel: 'Internet',
	publicLabel: 'Public subnet',
	publicSub: 'Memiliki rute ke internet gateway',
	privateLabel: 'Private subnet',
	privateSub: 'Tanpa rute langsung ke internet gateway',
	webLabel: 'Web server',
	dbLabel: 'Database',
	visitSite: 'Kunjungi situs',
	attackDb: 'Coba akses database dari internet',
	noteIdle: 'Server web dan database berada di subnet yang berbeda',
	noteWeb: 'Server web menerima request lalu mengambil data dari database',
	noteBlocked: 'Database ini tidak memiliki jalur akses langsung dari internet'
};
