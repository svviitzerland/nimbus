import type { CiscoVlanText } from './types';

export const id: CiscoVlanText = {
	title: 'VLAN dan trunk',
	intro: [
		'Kantor sekarang punya WiFi tamu di lobi, nyolok ke <b>switch</b> Cisco yang sama dengan Sari, Budi, dan Dewi. Switch itu kotak dengan banyak port yang nyambungin perangkat dalam satu jaringan. Lihat HP tamu teriak broadcast, pesan buat semua orang. Semua laptop staf ikut denger.',
		'Satu switch artinya satu ruangan gede, jadi tamu yang kepo bisa lihat laptop staf. <b>VLAN</b> (virtual LAN) misahin satu switch itu jadi beberapa ruangan tanpa beli switch kedua. Konsepnya ada di [[Apa itu VLAN|network/vlan]].',
		'Pertama kita bikin ruangannya. <b>vlan 10</b> namanya STAFF dan <b>vlan 20</b> namanya GUEST. Tiap VLAN itu cuma nomor plus label nama.',
		'Berikutnya port staf dimasukin ke ruang 10. <b>interface range fa0/1-3</b> milih tiga port sekaligus, <b>switchport mode access</b> artinya satu perangkat satu ruangan, dan <b>switchport access vlan 10</b> nentuin ruangannya. Lihat portnya jadi biru.',
		'WiFi tamu di Fa0/8 masuk ke ruang 20 dengan cara yang sama. Sekarang switchnya punya dua ruangan yang nggak saling denger.',
		'[ingat] Port <b>access</b> itu pintu ke satu ruangan, satu warna. <b>Trunk</b> itu lorong yang bawa semua warna, tiap paket pakai label nama kecil (802.1Q) biar ujung satunya tau dia milik ruangan mana. Gampangnya, access itu pintu kamar, trunk itu lorong hotel.',
		'Kabel ke router harus bawa dua ruangan sekaligus, jadi Gi0/1 dijadiin <b>trunk</b>. Lihat kabel ke atas, dua warna dalam satu kabel.',
		'Saatnya tes. <b>show vlan brief</b> nampilin tiap ruangan dan portnya, terus si tamu teriak lagi. Kali ini cuma ruang tamu yang denger.',
		'[fyi] Konsepnya sama, istilahnya beda. MikroTik bikin VLAN pakai VLAN interface, dan di cloud pemisahan yang sama dilakuin pakai subnet di dalam [[VPC|networking/vpc]]. Router tetap bisa nyambungin antar ruangan, tapi cuma di tempat yang kamu izinin.',
		'Giliran kamu. Ada laptop staf baru nyolok di Fa0/4. Ketik <b>conf t</b>, lalu <b>int fa0/4</b>, lalu <b>switchport access vlan 10</b>.'
	],
	reactions: {
		task: 'Fa0/4 barusan jadi biru. Laptop barunya udah di ruang staf, dia bisa denger Sari, Budi, dan Dewi, dan tamu nggak bisa lihat dia.',
		wrongVlan:
			'Port itu masuk ke ruangan lain. Staf tinggalnya di <b>vlan 10</b>, jadi pakai switchport access vlan 10.',
		needEnable: 'Itu butuh prompt bos. Ketik <b>enable</b> dulu.',
		needConfig: 'Itu ngubah switch, ketik <b>conf t</b> dulu.',
		needDo: 'Di mode config, kasih <b>do</b> di depan, misalnya <b>do sh vlan brief</b>.',
		needSub: 'Yang itu tempatnya di dalam port. Masuk dulu pakai <b>int fa0/4</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Satu ruangan gede',
			body: '<b>Broadcast</b> itu pesan buat semua orang di jaringan. Tanpa VLAN, semua port switch ada di ruangan yang sama, jadi semua orang nerima.'
		},
		{
			title: 'Ruangan virtual',
			body: 'VLAN itu ruangan yang dibentuk dari port switch. Port di VLAN berbeda kelakuannya kayak nyolok di switch yang berbeda.'
		},
		{
			title: 'Bikin ruangan',
			body: '<code>vlan 10</code> ngebuka <b>(config-vlan)#</b> dan <code>name STAFF</code> ngasih labelnya. VLAN 1 itu ruangan bawaan tempat semua port mulai.'
		},
		{
			title: 'Port access',
			body: '<code>interface range</code> ngatur beberapa port sekaligus. <code>switchport access vlan 10</code> mindahin mereka ke ruang 10.'
		},
		{
			title: 'Ruang tamu',
			body: 'Fa0/8 gabung ke VLAN 20. Tiga ide yang sama, pilih port, jadiin access, tentuin ruangannya.'
		},
		{
			title: 'Pintu dan lorong',
			tag: 'Biar nempel',
			body: '<b>Access</b> itu pintu kamar, satu ruangan. <b>Trunk</b> itu lorong hotel buat semua ruangan, tiap paket pakai label nama.'
		},
		{
			title: 'Trunk',
			body: '<code>switchport mode trunk</code> di Gi0/1 bikin dua VLAN bisa jalan ke router lewat satu kabel.'
		},
		{
			title: 'Ruangan yang tenang',
			body: 'Tabelnya nunjukin STAFF di Fa0/1 sampai Fa0/3 dan GUEST di Fa0/8. Port trunk nggak dicantumin, dia milik semua ruangan.'
		},
		{
			title: 'Di tempat lain',
			body: 'Misahin satu jaringan jadi beberapa ruangan ada di mana mana, VLAN di kantor, subnet di cloud. Cuma istilahnya yang beda.'
		},
		{
			title: 'Giliran kamu',
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
	hintNeedEnable: '! itu butuh mode bos, ketik enable dulu',
	hintNeedConfig: '! itu ngubah switch, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh vlan brief',
	hintSub: '! yang itu tempatnya di dalam port, masuk dulu pakai int fa0/4',
	hintMask: '! Cisco mau masknya ditulis lengkap, kayak 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
