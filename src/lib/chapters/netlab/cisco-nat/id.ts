import type { CiscoNatText } from './types';

export const id: CiscoNatText = {
	title: 'NAT overload',
	intro: [
		'Laptopnya udah punya alamat, tapi alamatnya <b>privat</b>, 192.168.88.sekian, nomor rumah yang cuma berarti di dalam kantor ini. Lihat Sari coba buka nimbus.com. ISP langsung buang paketnya.',
		'ISP cuma ngasih kantor ini satu alamat yang bisa dipakai, <b>10.20.30.2</b> di Gi0/0. Jadi router jadi bagian surat menyurat. Tiap surat keluar dicap alamat kantor, terus dicatat siapa pengirimnya, biar balasannya nyampe ke meja yang bener. Trik ini namanya <b>NAT</b>, lihat [[Apa itu NAT|network/nat]].',
		'Pertama, router harus tau sisi mana yang mana. Gi0/1 ngadep ke kantor, jadi <b>ip nat inside</b>. Gi0/0 ngadep ke internet, jadi <b>ip nat outside</b>. Lihat label kecil di bawah portnya.',
		'Berikutnya, siapa yang boleh ditranslasi? Kita tulis di <b>access list</b>, daftar pendek berisi alamat. access-list 1 ngizinin satu kantor, 192.168.88.0 dengan <b>0.0.0.255</b>.',
		'[ingat] 0.0.0.255 itu <b>wildcard</b>, subnet mask yang dibalik. 0 artinya bagian ini harus sama, 255 artinya bebas. Jadi 255.255.255.0 dibalik jadi 0.0.0.255. Gampangnya, nol itu wajib, 255 itu terserah.',
		'Sekarang aturan yang nyatuin semuanya. Translasi sumber inside di list 1 jadi alamat g0/0, dan <b>overload</b>. Overload artinya banyak laptop berbagi satu alamat itu, dibedain pakai nomor port.',
		'Semua orang buka nimbus.com barengan. Perhatiin label tiap paket berubah di router, dan tiap laptop nambah satu baris baru di tabel.',
		'IOS nampilin tabel yang sama pakai <b>show ip nat translations</b>. Inside local itu alamat asli laptop, inside global itu yang dilihat internet.',
		'[fyi] Di [[MikroTik|netlab/router-nat]], seluruh lesson ini cuma satu aturan masquerade. Konsepnya sama, istilahnya beda. Di cloud, NAT gateway ngerjain tugas yang sama buat jaringan privat.',
		'Giliran kamu. Minta tabelnya sendiri ke router, pakai versi pendeknya <b>sh ip nat tr</b>.'
	],
	reactions: {
		task: 'Nah itu. Tiga laptop di kiri, satu alamat publik di kanan, masing masing dengan nomor port sendiri. Dari port itulah router tau balasan mana buat meja siapa.',
		cleared:
			'Kamu barusan ngapus tabelnya. Nggak ada yang rusak kok, begitu ada yang buka halaman lagi router tinggal nulis baris baru.',
		needEnable: 'Itu butuh prompt bos. Ketik <b>enable</b> dulu.',
		needConfig: 'Itu ngubah router, ketik <b>conf t</b> dulu.',
		needDo:
			'Di mode config, kasih <b>do</b> di depan, misalnya <b>do sh ip nat tr</b>, atau ketik <b>end</b> dulu.',
		needSub:
			'Perintah itu tempatnya di dalam interface. Masuk dulu, misalnya <b>interface g0/1</b>.',
		wild: 'Hati hati, access list maunya wildcard, mask yang dibalik. Buat kantor ini jadinya <b>0.0.0.255</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Alamat privat',
			body: 'Alamat 192.168.x.x dipakai ulang sama jutaan kantor, jadi internet nggak pernah ngirim ke sana. Paket yang keluar pakai alamat itu dibuang.'
		},
		{
			title: 'Trik bagian surat',
			body: 'NAT itu Network Address Translation. Router nuker pengirim privat jadi alamat publiknya waktu keluar, terus nuker balik waktu masuk.'
		},
		{
			title: 'Inside dan outside',
			body: '<code>ip nat inside</code> di port kantor, <code>ip nat outside</code> di port internet. Bayangin pintu depan rumah, inside itu rumah, outside itu jalan.'
		},
		{
			title: 'Access list 1',
			body: '<code>access-list 1 permit 192.168.88.0 0.0.0.255</code> cocok sama semua alamat dari 192.168.88.0 sampai 192.168.88.255.'
		},
		{
			title: 'Wildcard',
			tag: 'Cara ingat',
			body: 'Balik masknya. <b>0</b> wajib sama, <b>255</b> terserah. 255.255.255.0 jadi <b>0.0.0.255</b>.'
		},
		{
			title: 'Overload',
			body: '<code>ip nat inside source list 1 interface g0/0 overload</code>. Sumber inside di list 1 dapat alamat g0/0, dipakai rame rame.'
		},
		{
			title: 'Banyak jadi satu',
			body: 'Semua laptop keluar sebagai 10.20.30.2. Cuma nomor port yang ngebedain, makanya ini juga disebut PAT (Port Address Translation).'
		},
		{
			title: 'Tabelnya',
			body: '<b>Inside local</b> itu laptopnya, <b>inside global</b> itu wajah publiknya. <b>Outside</b> itu websitenya, di sini nimbus.com port 443.'
		},
		{
			title: 'Ide yang sama di tempat lain',
			body: 'MikroTik nyebutnya masquerade, router rumah ngerjainnya diam diam, dan jaringan cloud nyewain dalam bentuk NAT gateway.'
		},
		{
			title: 'Giliran kamu',
			tag: 'Coba',
			body: 'Tap console lalu ketik <code>sh ip nat tr</code>. Cocokin alamat tiap laptop sama portnya.'
		}
	],
	tagFrom: 'dari {ip}',
	tagTo: 'ke {ip}',
	tagDropped: 'privat, dibuang',
	insideTag: 'inside',
	outsideTag: 'outside',
	tableTitle: 'Tabel NAT',
	thLocal: 'inside local',
	thGlobal: 'inside global',
	tableEmpty: 'Kosong, belum ada yang keluar lewat NAT',
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
	hintNeedConfig: '! itu ngubah router, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh run',
	hintSub: '! perintah itu tempatnya di dalam interface, pool, atau line, masuk dulu ke sana',
	hintMask: '! Cisco mau masknya ditulis lengkap, kayak 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
