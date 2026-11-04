import type { VpnText } from './types';

export const id: VpnText = {
	title: 'Apa itu VPN',
	intro: [
		'Bayangin ini. Kamu kerja di nimbus.com, dan hari ini kamu kerja dari kafe, ada kopi di meja dan laptopmu terbuka.',
		'Kamu butuh halaman gaji. Halaman itu ada di server di dalam kantor, dan server itu cuma mau buka pintu buat <b>jaringan kantor</b> (komputer yang nyolok langsung di kantor). Dari kafe, kamu orang luar.',
		'Masalahnya ada satu lagi. WiFi kafe dipakai bareng orang asing, dan siapa pun di situ bisa diam diam membaca apa yang lewat. Namanya [[sniffing|security/sniffing]]. Lihat deh apa yang kelihatan di layar orang di meja sebelah.',
		'<b>VPN</b> (Virtual Private Network) menyelesaikan dua masalah itu. Laptopmu membangun <b>terowongan</b>, jalan pribadi dari kamu langsung ke kantor, lewat WiFi kafe dan internet.',
		'Semua yang kamu kirim [[dienkripsi|networking/encryption]] dulu sebelum masuk, diacak pakai kunci rahasia yang cuma dimiliki kamu dan kantor. Orang asing itu tetap lihat ada yang lewat, tapi buat dia isinya cuma acakan.',
		'Di ujung kantor, terowongannya terbuka dan permintaanmu keluar, sudah di dalam. Server mengira ada rekan kerja yang duduk di mejanya, jadi pintunya dibuka.',
		'[ingat] VPN itu cuma dua hal, <b>terowongan</b> dan <b>gembok</b>. Terowongan bikin kamu seolah ada di dalam, gembok bikin barang bawaanmu nggak kebaca di jalan.',
		'[fyi] Kata yang sama, dunia yang beda. VPN kantor membawamu masuk ke kantor, aplikasi VPN di HP membawamu keluar lewat server di negara lain, dan di cloud ada site to site VPN yang menyambungkan kantor ke [[VPC|networking/vpc]]. Idenya selalu sama, terowongan bergembok ke jaringan lain.',
		'Itu dia triknya. Kalau mau, matikan dan nyalakan saklar VPN, lalu lihat apa yang berubah di layar orang asing dan di pintu kantor.'
	],
	reactions: {
		off: 'VPN mati. Permintaanmu jalan terbuka lagi, orang asing bisa membacanya, dan pintu kantor tetap tertutup.',
		on: 'VPN nyala. Terowongan jadi, gembok terpasang, orang asing cuma dapat acakan dan kantor membukakan pintu.'
	},
	steps: [
		{
			tag: 'Kamu',
			title: 'Kerja dari kafe',
			body: 'Laptopmu masuk ke WiFi kafe seperti pengunjung lain. Buat internet, kamu cuma salah satu tamu kafe itu.'
		},
		{
			title: 'Pintu kantor',
			body: 'Server gaji mengecek dari mana setiap permintaan datang. Dari jaringan kantor, silakan masuk. Dari tempat lain, pintunya tetap tertutup.'
		},
		{
			title: 'Jalan terbuka',
			body: 'Tanpa VPN, permintaanmu jalan sebagai pesan yang bisa dibaca. Siapa pun di WiFi yang sama bisa menangkap dan membacanya.'
		},
		{
			title: 'Terowongan',
			body: 'Aplikasi VPN di laptopmu tersambung ke <b>server VPN</b> di kantor. Mulai sekarang semua yang kamu kirim lewat satu sambungan itu.'
		},
		{
			title: 'Gembok',
			body: 'Sebelum masuk terowongan, semuanya dienkripsi. Orang luar bisa tahu kamu mengirim sesuatu, tapi nggak tahu isinya.'
		},
		{
			title: 'Keluar di dalam',
			body: 'Server VPN membuka bungkusan permintaanmu dan meneruskannya dari dalam kantor. Buat server gaji, permintaan itu datang dari jaringan kantor.'
		},
		{
			tag: 'Cara ingat',
			title: 'Terowongan dan gembok',
			body: '<b>Terowongan</b> menaruhmu di dalam jaringan lain. <b>Gembok</b> menjaga perjalanannya tetap rahasia.'
		}
	],
	cafeLabel: 'Kafe',
	youLabel: 'Kamu',
	officeLabel: 'Kantor',
	serverLabel: 'Gaji',
	internetLabel: 'Internet',
	tunnelLabel: 'Terowongan VPN',
	snooperLabel: 'Orang asing di WiFi kafe',
	peekPlain: 'halaman gaji, login kamu',
	peekIdle: 'menunggu',
	doorShut: 'orang luar',
	doorOpen: 'silakan masuk',
	vpnLabel: 'VPN',
	onLabel: 'nyala',
	offLabel: 'mati'
};
