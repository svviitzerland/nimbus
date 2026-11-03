import type { VpnText } from './types';

export const id: VpnText = {
	title: 'Apa itu VPN',
	intro: [
		'Bayangin kamu kerja di nimbus.com, dan hari ini kamu kerja dari kafe. Kamu butuh halaman gaji yang ada di server di dalam kantor.',
		'Server itu cuma mau membuka pintu buat <b>jaringan kantor</b>, komputer yang nyolok langsung di kantor. Dari kafe, kamu datang dari luar, jadi pintunya tetap tertutup.',
		'Masalahnya nggak cuma itu. WiFi kafe dipakai bareng orang asing, dan siapa pun di situ bisa diam diam membaca lalu lintas yang lewat kalau nggak dikunci. Namanya [[sniffing|security/sniffing]].',
		'<b>VPN</b> (Virtual Private Network) menyelesaikan dua masalah itu sekaligus. Laptopmu membangun <b>terowongan</b> ke kantor, dan semua yang kamu kirim [[dienkripsi|networking/encryption]] dulu sebelum masuk, lalu dibuka lagi di ujung kantor.',
		'Buat server kantor, kamu kelihatan seperti lagi duduk di mejamu, karena permintaanmu keluar dari terowongan di dalam kantor. Buat penyadap di kafe, isinya cuma acakan nggak jelas.',
		'[fyi] Kata yang sama, dunia yang beda. VPN kantor membawamu masuk ke kantor, aplikasi VPN di HP membawamu keluar lewat server di negara lain, dan di cloud ada site to site VPN yang menyambungkan kantor ke [[VPC|networking/vpc]]. Idenya selalu sama, terowongan terenkripsi ke jaringan lain.',
		'Sekarang kamu di kafe. Coba buka server kantor tanpa VPN dulu, lalu nyalakan VPN dan coba lagi. Perhatikan si penyadap ya.'
	],
	reactions: {
		blocked:
			'Ditolak. Kantor melihat orang asing dari kafe, bukan rekan kerja. Terus lihat penyadapnya, dia baca seluruh permintaanmu, sampai nama halamannya.',
		on: 'Terowongannya sudah jadi. Laptopmu dan kantor sudah sepakat soal kunci rahasia, jadi mulai sekarang semua yang kamu kirim jalan di dalam, terkunci.',
		through:
			'Kamu masuk. Kantor melihat alamat dari dalam jaringannya sendiri, jadi pintunya dibuka. Sementara itu penyadap cuma dapat acakan, dia tahu kamu kirim sesuatu tapi nggak tahu apa.',
		off: 'VPN mati. Permintaanmu jalan terbuka lagi, langsung lewat WiFi kafe.'
	},
	vpnLabel: 'VPN',
	onLabel: 'nyala',
	offLabel: 'mati',
	openBtn: 'Buka server kantor',
	youLabel: 'Kamu',
	youSub: 'di kafe',
	officeLabel: 'Server kantor',
	officeSub: 'khusus jaringan kantor',
	cafeWifi: 'WiFi kafe dan internet',
	tunnelLabel: 'terowongan terenkripsi',
	snooperLabel: 'Penyadap di WiFi kafe',
	snooperIdle: 'Menunggu ada yang lewat',
	seenAsLabel: 'Kantor melihatmu sebagai',
	seenCafe: 'tamu dari kafe',
	seenOffice: 'orang di dalam kantor',
	blockedTag: 'bukan dari kantor',
	okTag: 'silakan masuk',
	noteIdle: 'Belum pakai VPN, permintaanmu bakal jalan terbuka',
	noteOn: 'Terowongan siap, coba buka servernya lagi',
	noteBlocked: 'Kantor menolak, dan penyadap membaca semuanya',
	noteOk: 'Lewat terowongan, masuk ke kantor'
};
