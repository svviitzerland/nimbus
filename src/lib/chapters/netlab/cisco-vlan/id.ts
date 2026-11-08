import type { CiscoVlanText } from './types';

export const id: CiscoVlanText = {
	title: 'VLAN dan trunk',
	intro: [
		'Laptop staf dan access point tamu terhubung ke switch yang sama. Saat semua port berada di VLAN 1, broadcast dari perangkat tamu juga diteruskan ke port staf.',
		'<b>VLAN</b> memisahkan broadcast domain secara logis pada switch. Port staf dan tamu dapat ditempatkan pada VLAN berbeda. Lihat dasarnya di [[VLAN|network/vlan]].',
		'Pertama kita bikin ruangannya. <b>vlan 10</b> namanya STAFF dan <b>vlan 20</b> namanya GUEST. Tiap VLAN itu cuma nomor plus label nama.',
		'Pilih port staf dengan <b>interface range fa0/1-3</b>. Atur <b>switchport mode access</b>, lalu <b>switchport access vlan 10</b>. Warna biru menunjukkan port yang menjadi anggota VLAN 10.',
		'Tempatkan access point tamu pada Fa0/8 di VLAN 20. Broadcast staf dan tamu kini berada pada domain yang berbeda.',
		'[ingat] Port access membawa trafik satu VLAN data. Trunk dapat membawa beberapa VLAN dengan penandaan 802.1Q, kecuali trafik native VLAN sesuai konfigurasinya.',
		'Gi0/1 menjadi <b>trunk</b> untuk membawa trafik kedua VLAN melalui satu sambungan ke router. Label VLAN membantu membedakan trafiknya.',
		'Jalankan <b>show vlan brief</b> untuk melihat VLAN dan anggota port access. Kirim broadcast dari tamu lagi dan amati port mana yang menerimanya.',
		'[fyi] VLAN memisahkan broadcast domain pada lapisan link. [[Subnet|network/subnet]] membagi alamat pada lapisan IP. Keduanya sering dipakai bersama, tetapi merupakan konsep yang berbeda.',
		'Giliran kamu. Ada laptop staf baru nyolok di Fa0/4. Ketik <b>conf t</b>, lalu <b>int fa0/4</b>, lalu <b>switchport access vlan 10</b>.'
	],
	reactions: {
		task: 'Fa0/4 kini menjadi anggota VLAN 10 bersama port staf lain. Broadcast VLAN tamu tidak diteruskan ke port ini.',
		wrongVlan: 'Port belum berada di VLAN staf. Gunakan <b>switchport access vlan 10</b>.',
		needEnable:
			'Perintah ini memerlukan mode privileged EXEC. Jalankan <b>enable</b>, lalu coba kembali.',
		needConfig: 'Itu ngubah switch, ketik <b>conf t</b> dulu.',
		needDo: 'Di mode config, kasih <b>do</b> di depan, misalnya <b>do sh vlan brief</b>.',
		needSub: 'Yang itu tempatnya di dalam port. Masuk dulu pakai <b>int fa0/4</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Satu broadcast domain',
			body: 'Pada konfigurasi awal, semua port access berada di VLAN 1. Broadcast diteruskan ke port lain dalam VLAN itu.'
		},
		{
			title: 'Memisahkan jaringan dengan VLAN',
			body: 'VLAN membuat broadcast domain yang terpisah pada switch. Trafik antar VLAN memerlukan routing.'
		},
		{
			title: 'Membuat VLAN',
			body: '<code>vlan 10</code> membuka konfigurasi VLAN 10. <code>name STAFF</code> memberi nama agar mudah dikenali.'
		},
		{
			title: 'Port access',
			body: '<code>interface range</code> ngatur beberapa port sekaligus. <code>switchport access vlan 10</code> mindahin mereka ke ruang 10.'
		},
		{
			title: 'VLAN untuk tamu',
			body: 'Fa0/8 gabung ke VLAN 20. Tiga ide yang sama, pilih port, jadiin access, tentuin ruangannya.'
		},
		{
			title: 'Perbedaan access dan trunk',
			tag: 'Cara ingat',
			body: 'Access menghubungkan perangkat ke satu VLAN data. Trunk dapat membawa beberapa VLAN pada satu sambungan.'
		},
		{
			title: 'Trunk',
			body: '<code>switchport mode trunk</code> di Gi0/1 bikin dua VLAN bisa jalan ke router lewat satu kabel.'
		},
		{
			title: 'Membatasi jangkauan broadcast',
			body: 'Tabel menampilkan port access STAFF dan GUEST. Periksa keanggotaan VLAN, lalu uji jangkauan broadcast.'
		},
		{
			title: 'VLAN di perangkat lain',
			body: 'VLAN membatasi broadcast pada lapisan link. Subnet membagi ruang alamat IP. Keduanya dapat digunakan bersama.'
		},
		{
			title: 'Konfigurasikan VLAN',
			tag: 'Coba',
			body: 'Ketik <code>conf t</code>, lalu <code>int fa0/4</code>, lalu <code>switchport access vlan 10</code>, tekan Enter tiap selesai satu.'
		}
	],
	apLabel: 'WiFi tamu',
	newLabel: 'Laptop baru',
	heard: 'kedengeran',
	ispLabel: 'ISP',
	inputLabel: 'perintah',
	doneNote: 'Beres',
	termHint: '! Nim ngetik duluan di sini, giliranmu nanti di akhir',
	hintInvalid: '! IOS bingung di tanda ^, cek kata itu atau ketik ? buat lihat yang cocok',
	hintIncomplete:
		'! dikit lagi, perintahnya kurang kata, kasih spasi lalu ? buat lihat lanjutannya',
	hintAmbiguous:
		'! kependekan, ada lebih dari satu perintah yang awalnya begitu, tambah satu dua huruf',
	hintUnknown: '! perintah itu nggak ada di sini, ketik ? buat lihat daftarnya',
	didYouMean: '! mungkin maksudnya {word}',
	hintNeedEnable: '! gunakan enable untuk masuk ke privileged EXEC',
	hintNeedConfig: '! itu ngubah switch, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh vlan brief',
	hintSub: '! yang itu tempatnya di dalam port, masuk dulu pakai int fa0/4',
	hintMask: '! tulis subnet mask lengkap, misalnya 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
