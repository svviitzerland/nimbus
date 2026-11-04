import type { CiscoSshText } from './types';

export const id: CiscoSshText = {
	title: 'SSH dan enable secret',
	intro: [
		'Admin jarang banget jalan ke router bawa kabel console. Mereka login dari laptop sendiri lewat jaringan, itu namanya [[remote access|cloud/remote-access]]. Dulu ada yang udah nyiapin router nimbus buat itu, lihat <b>vty lines</b>nya, pintu virtual buat login jarak jauh. Passwordnya cisco, transportnya telnet.',
		'Sekarang Budi login pakai <b>Telnet</b>. Tapi ada laptop orang asing nyolok di switch yang sama, diam diam ngerekam lalu lintas. Lihat apa yang dia dapet.',
		'[ingat] Telnet itu <b>kartu pos</b>, semua orang yang megang di jalan bisa baca. SSH itu <b>amplop tertutup</b>, cuma penerimanya yang bisa buka. Telnet telanjang, SSH sembunyi.',
		'Yuk kita kunci satu per satu. Pertama tangga bos, enable. <b>enable secret</b> masang password buat dia, dan IOS nyimpennya dalam bentuk acak jadi nggak ada yang bisa baca dari config.',
		'SSH butuh kunci buat nyegel amplopnya, dan kuncinya butuh nama lengkap. Jadi kita set <b>ip domain-name nimbus.com</b>, lalu <b>crypto key generate rsa</b>. IOS nanya seberapa gede kuncinya, dan 2048 bit itu jawaban yang bagus buat sekarang.',
		'Berikutnya akun beneran. <b>username budi secret</b> ngasih Budi nama dan password sendiri, jadi router tau persis siapa yang login.',
		'Terakhir pintunya sendiri. <b>line vty 0 4</b> milih lima pintu login jarak jauh, <b>transport input ssh</b> cuma ngizinin SSH lewat, dan <b>login local</b> ngecek akun yang barusan kita bikin.',
		'Budi login lagi, sekarang pakai <b>SSH</b>. Si orang asing masih ngerekam semuanya, tapi yang dia dapet cuma acakan. <b>show ip ssh</b> mastiin SSH udah nyala.',
		'[fyi] Ini awal dari <b>hardening</b>, bikin perangkat lebih susah diserang, lihat [[hardening|security/hardening]]. Admin pro juga masang access list dari [[lesson sebelumnya|netlab/cisco-acl]] ke vty lines, biar cuma laptop admin yang boleh ngetok.',
		'Giliran kamu. Semua ini ilang kalau router restart sebelum disimpan. Ketik <b>wr</b>.'
	],
	reactions: {
		task: 'Tersimpan! Walau listrik mati, nimbus bakal nyala lagi dengan SSH aja, enable secret yang teracak, dan akun Budi. Router yang aman diatur dari mana aja di kantor.',
		reloaded:
			'Routernya restart. Kalau tadi udah disimpan, SSH tetap nyala. Kalau belum, dia balik ke setelan Telnet lama, makanya kita nyimpen.',
		needEnable:
			'Itu butuh prompt bos. Ketik <b>enable</b>, dan kali ini dia nanya secretnya, Nimbus2026.',
		needConfig: 'Itu ngubah router, ketik <b>conf t</b> dulu.',
		needDo:
			'Di mode config, kasih <b>do</b> di depan, misalnya <b>do wr</b>, atau ketik <b>end</b> dulu.',
		badSecret:
			'Secretnya salah. Itu tandanya enable secret lagi kerja. Yang kita pasang tadi <b>Nimbus2026</b>.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ nunjuk kata yang bikin bingung, dan <b>?</b> nampilin yang cocok.'
	},
	steps: [
		{
			title: 'Pintu jarak jauh',
			body: '<code>show running-config | section line vty</code> cuma nampilin bagian itu dari config. Tanda <b>|</b> nyaring output yang panjang.'
		},
		{
			title: 'Ada yang nguping',
			body: 'Telnet ngirim tiap huruf apa adanya, password juga. Siapa pun di jalur itu bisa baca.'
		},
		{
			title: 'Kartu pos dan amplop',
			tag: 'Biar nempel',
			body: '<b>Telnet</b> itu kartu pos, <b>SSH</b> itu amplop tertutup. Telnet pakai port 23, SSH pakai port 22.'
		},
		{
			title: 'enable secret',
			body: 'Sekarang <code>enable</code> nanya password. Di config dia muncul sebagai hash acak, nggak pernah sebagai kata aslinya.'
		},
		{
			title: 'Kunci butuh nama',
			body: 'Kuncinya dinamain dari hostname plus domain, nimbus.nimbus.com. Tanpa domain name, IOS nolak bikin kunci.'
		},
		{
			title: 'Satu akun satu orang',
			body: '<code>username budi secret Budi2026</code>. Dengan akun pribadi kamu tau siapa ngubah apa, beda sama satu password rame rame.'
		},
		{
			title: 'Cuma SSH, cuma akun',
			body: '<code>transport input ssh</code> nutup pintu Telnet. <code>login local</code> minta username dan password dari daftar lokal.'
		},
		{
			title: 'Tersegel',
			body: 'Login yang sama, kabel yang sama, tapi byte yang direkam udah acak. Cuma laptop Budi dan router yang bisa baca.'
		},
		{
			title: 'Hardening',
			body: 'Secret yang kuat, cuma SSH, akun pribadi, dan access list di vty lines. Langkah kecil yang lama lama jadi benteng.'
		},
		{
			title: 'Giliran kamu',
			tag: 'Coba',
			body: 'Ketik <code>wr</code> lalu tekan Enter. Itu nyalin running config ke startup config.'
		}
	],
	spyLabel: 'Orang asing',
	captureTitle: 'Yang dilihat orang asing',
	captureEmpty: 'Belum ada yang ketangkep',
	captureOpen: 'password kebaca',
	captureSafe: 'teracak',
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
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do wr',
	hintSub: '! perintah itu tempatnya di dalam interface, pool, atau line, masuk dulu ke sana',
	hintMask: '! Cisco mau masknya ditulis lengkap, kayak 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
