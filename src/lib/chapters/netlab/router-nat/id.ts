import type { RouterNatText } from './types';

export const id: RouterNatText = {
	title: 'NAT dan masquerade',
	intro: [
		'Laptopnya udah punya alamat, 192.168.88.sekian. Tapi itu <b>alamat privat</b>, nomor rumah yang cuma berarti di dalam kantor ini. Ribuan kantor lain juga pakai nomor yang persis sama.',
		'Internet cuma mau ngantar ke <b>alamat publik</b>, dan ISP cuma ngasih satu ke kantor ini, nempel di ether1. Lihat terminalnya nampilin dua duanya. Tiga laptop, satu alamat publik.',
		'Terus gimana kalau Sari buka nimbus.com sekarang? Paketnya keluar dengan alamat pengirim privat. ISP lihat sekilas lalu langsung buang, soalnya balasannya nggak mungkin bisa nemu jalan pulang.',
		'<b>NAT</b> mengubah alamat pada paket. Pada contoh ini, router mengganti alamat sumber laptop dengan alamat interface yang menuju internet. Lihat juga [[NAT|network/nat]].',
		'Baca aturannya dari kiri ke kanan. <b>srcnat</b> artinya ganti source (pengirimnya), <b>out-interface=ether1</b> artinya cuma waktu keluar ke internet, dan <b>masquerade</b> artinya pakai alamat apa pun yang lagi dipegang ether1. Lihat label paketnya berubah di router.',
		'Bagian surat juga nyatat siapa ngirim apa, jadi waktu balasan datang ke alamat kantor, dia tau harus dianter ke meja siapa. Buku catatan itu namanya <b>connection table</b>.',
		'[ingat] Masquerade mengganti alamat sumber dengan alamat interface keluar. Catatan koneksi membantu router mengarahkan balasan ke perangkat asal.',
		'[fyi] Yang jeli mungkin sadar 10.20.30.2 itu juga rentang privat. Banyak ISP ngelakuin NAT lagi di sisi mereka (namanya CGNAT), jadi kantor ini juga berbagi alamat sama tetangga. Di cloud, NAT gateway ngerjain tugas yang sama buat sebuah [[VPC|networking/vpc]].',
		'Giliran kamu. Lihat aturan yang sekarang dipakai kantor pakai <b>/ip firewall nat print</b>.'
	],
	reactions: {
		natPrint:
			'Itu dia, aturan 0, chain srcnat, action masquerade. Satu baris itu ada di hampir semua MikroTik di dunia.',
		conntrack:
			'Tabel koneksi mencatat pemetaan alamat dan port. Router memakai catatan ini untuk mengarahkan paket balasan ke perangkat asal.',
		error:
			'Yang itu RouterOS nggak ngerti. Cek lagi ejaannya, atau tekan sarannya dan lihat diketikin.'
	},
	steps: [
		{
			tag: 'privat',
			title: 'Alamat IP privat',
			body: '<b>192.168.x.x</b>, <b>10.x.x.x</b>, dan <b>172.16 sampai 172.31</b> itu privat. Siapa aja boleh pakai, jadi internet nggak mau ngantar ke sana.'
		},
		{
			tag: 'publik',
			title: 'Alamat IP publik',
			body: 'ISP ngasih router satu alamat di <b>ether1</b>. Semua yang dikirim kantor ke luar harus pakai alamat itu.'
		},
		{
			title: 'Paket belum mendapat balasan',
			body: 'Paket yang keluar dengan pengirim privat bakal dibuang, soalnya nggak ada yang bisa bales ke sana.'
		},
		{
			tag: 'NAT',
			title: 'Mengubah alamat sumber',
			body: '<b>Network Address Translation</b> nulis ulang pengirim waktu keluar, lalu balikin lagi waktu balasan masuk.'
		},
		{
			tag: 'masquerade',
			title: 'Aturan masquerade',
			body: '<b>chain=srcnat</b> (ganti pengirim), <b>out-interface=ether1</b> (cuma ke arah internet), <b>action=masquerade</b> (pakai alamat ether1).'
		},
		{
			tag: 'connection',
			title: 'Tabel koneksi',
			body: 'Tiap penukaran dicatat. Huruf <b>s</b> artinya srcnat, dan nomor port yang ngebedain balasan satu sama lain.'
		},
		{
			tag: 'Cara ingat',
			title: 'Alamat sebelum dan sesudah NAT',
			body: 'Alamat sumber berubah saat paket keluar. Catatan koneksi digunakan untuk mengarahkan balasannya.'
		},
		{
			title: 'NAT pada dua router',
			body: 'Di balik CGNAT, alamat kantor dibagi lagi sama ISP. Di cloud, <b>NAT gateway</b> itu aturan ini dalam bentuk layanan.'
		},
		{
			title: 'Tambahkan aturan NAT',
			body: 'Aturan NAT ada di <b>/ip firewall nat</b>, sebelahan sama firewall, karena dua duanya ngelihat tiap paket.'
		}
	],
	ispLabel: 'ISP',
	serverLabel: 'nimbus.com',
	tagFrom: 'dari {ip}',
	tagTo: 'ke {ip}',
	tagDropped: 'dibuang',
	inputLabel: 'perintah',
	tryLabel: 'Coba ini',
	termHint: '# giliran kamu, ketik perintahnya lalu tekan Enter',
	hintTry: '# coba {cmd}',
	didYouMean: '# mungkin maksudnya {word}',
	hintPublic: '# ether1 megang satu alamat yang dikasih ISP',
	hintSrcnat: '# s artinya srcnat, router menukar pengirimnya'
};
