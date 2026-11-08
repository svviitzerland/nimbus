import type { CiscoIntroText } from './types';

export const id: CiscoIntroText = {
	title: 'Apa itu Cisco',
	intro: [
		'Coba intip ruang server di bank, kampus, atau kantor gede. Router dan switch di sana sering banget mereknya sama, <b>Cisco</b>. Tiap kotak Cisco jalan pakai sistem bernama <b>IOS</b> (nggak ada hubungannya sama iPhone ya).',
		'Lihat bagian depan router ini. Lubang lubangnya itu <b>port fisik</b>, tempat kabel beneran dicolok. Cisco namainnya <b>GigabitEthernet0/0</b>, <b>GigabitEthernet0/1</b>, dan seterusnya. Di sini 0/0 nyambung ke ISP, 0/1 ke kantor.',
		'[fyi] Port fisik adalah konektor kabel, misalnya GigabitEthernet0/1. [[Port jaringan|foundations/port]] seperti 443 adalah nomor untuk membedakan layanan dalam komunikasi jaringan.',
		'Ngobrol sama IOS itu pakai ngetik. Prompt pertamanya <b>Router&gt;</b>, dan tanda panah kecil itu artinya kamu cuma boleh lihat lihat. Perhatiin dia nampilin daftar portnya.',
		'Biar bisa lebih, naik satu tangga pakai <b>enable</b>. Promptnya berubah jadi <b>Router#</b>, tanda pagar itu artinya sekarang kamu bosnya.',
		'Buat ngubah sesuatu, naik satu tangga lagi pakai <b>configure terminal</b>. Promptnya jadi <b>(config)#</b>, terus kita kasih nama routernya, nimbus. Lihat promptnya langsung ikut berubah.',
		'[ingat] Prompt &gt; menunjukkan user EXEC, # menunjukkan privileged EXEC, dan (config)# menunjukkan konfigurasi global. Perintah end kembali ke privileged EXEC.',
		'Ada satu jebakan. Perubahan tadi cuma tinggal di <b>running config</b>, di memori, jadi kalau listrik mati ya ilang. <b>copy running-config startup-config</b> nyimpen semuanya buat nyala berikutnya. Admin biasanya ngetik versi pendeknya, <b>wr</b>.',
		'[fyi] Konsepnya sama, cuma beda istilah. Di [[MikroTik|netlab/router-intro]] portnya ether1 dan ether2, namanya diatur lewat /system identity. Di Cisco jadinya GigabitEthernet0/0 dan hostname. Paham satu, yang lain jadi kerasa akrab. Cisco juga yang jadi bahan sertifikat terkenal <b>CCNA</b>.',
		'Giliran kamu. Ketik <b>show running-config</b> (atau cukup <b>sh run</b>) lalu cari nama yang tadi kamu kasih ke router.'
	],
	reactions: {
		task: 'Nah itu dia, seluruh konfigurasinya baris per baris. <b>hostname nimbus</b> ada di bagian atas, dan tiap perintah yang kamu ketik di mode config bakal masuk ke daftar ini.',
		reloaded:
			'Routernya restart! Karena tadi udah disimpan, namanya tetap nimbus. Kalau belum disimpan, namanya balik jadi Router lagi, makanya nyimpen itu penting.',
		needEnable:
			'Perintah ini memerlukan mode privileged EXEC. Jalankan <b>enable</b>, lalu coba kembali.',
		needConfig:
			'Yang itu ngubah router, jadi cuma jalan di mode config. Ketik <b>conf t</b> dulu ya.',
		needDo:
			'Kamu lagi di mode config, perintah show nggak tinggal di situ. Kasih <b>do</b> di depannya, misalnya <b>do sh run</b>, atau ketik <b>end</b> dulu.',
		error:
			'Yang itu IOS nggak ngerti. Tanda ^ kecil nunjuk kata yang bikin dia bingung. Ketik <b>?</b> buat lihat yang cocok.'
	},
	steps: [
		{
			title: 'Cisco dan IOS',
			body: 'Cisco udah bikin perangkat jaringan sejak 1984. <b>IOS</b> itu software di dalam tiap kotaknya, dan kamu ngendaliinnya dengan ngetik perintah di console.'
		},
		{
			title: 'Port fisik',
			body: '<b>G0/0</b> itu singkatan GigabitEthernet0/0. Angka 0 pertama itu slot, yang kedua nomor portnya. Lubang biru muda di kanan itu console, buat kabel setting.'
		},
		{
			title: 'Port jaringan dan port fisik',
			body: 'GigabitEthernet0/1 adalah interface fisik. Port TCP 443 adalah nomor yang umum dipakai layanan HTTPS.'
		},
		{
			title: 'User mode, Router&gt;',
			body: '<code>show ip interface brief</code> nampilin semua port. <b>up</b> artinya ada kabel dan jalan. <b>administratively down</b> artinya sengaja dimatiin, router Cisco memang dikirim dengan port mati.'
		},
		{
			title: 'Privileged mode, Router#',
			body: '<code>enable</code> ngebuka perintah yang bisa lihat semuanya, termasuk seluruh konfigurasi. Nanti di lesson lain tangga ini kita kasih password.'
		},
		{
			title: 'Config mode, (config)#',
			body: '<code>configure terminal</code> artinya ngatur dari keyboard ini. <code>hostname nimbus</code> ganti nama router, dan promptnya langsung ngikut.'
		},
		{
			title: 'Mengenali mode dari prompt',
			tag: 'Cara ingat',
			body: '<b>&gt;</b> adalah user EXEC, <b>#</b> adalah privileged EXEC, dan <b>(config)#</b> adalah konfigurasi global. Perintah yang tersedia berbeda pada tiap mode.'
		},
		{
			title: 'Konfigurasi aktif dan tersimpan',
			body: '<b>Running config</b> adalah konfigurasi aktif di RAM. Simpan ke <b>startup config</b> agar konfigurasi digunakan lagi setelah perangkat menyala.'
		},
		{
			title: 'Singkatan perintah',
			body: 'IOS nerima kata yang dipendekin selama nggak ketuker sama perintah lain, jadi <code>conf t</code>, <code>sh ip int br</code>, dan <code>wr</code> semuanya jalan. Ketik <code>?</code> kapan aja buat lihat yang cocok.'
		},
		{
			title: 'Coba perintah IOS',
			tag: 'Coba',
			body: 'Tap console, ketik <code>sh run</code>, lalu tekan Enter. Cari baris <code>hostname nimbus</code> di bagian atas.'
		}
	],
	modes: { look: 'lihat', boss: 'privileged EXEC', change: 'ubah', port: 'satu port' },
	portsCaption: 'Gi0/0 ke ISP, Gi0/1 ke kantor, lubang beneran buat kabel beneran',
	logicalCaption: 'Port 443 nggak ada di kotak ini, dia cuma nomor di dalam software',
	ramTitle: 'running config',
	ramSub: 'RAM, si meja',
	nvramTitle: 'startup config',
	nvramSub: 'NVRAM, si laci',
	unsaved: 'belum disimpan',
	saved: 'tersimpan',
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
	hintNeedConfig: '! itu ngubah router, ketik conf t dulu',
	hintDo: '! kamu lagi di mode config, kasih do di depan, contohnya do sh run',
	hintSub: '! perintah itu tempatnya di dalam interface, pool, atau line, masuk dulu ke sana',
	hintMask: '! tulis subnet mask lengkap, misalnya 255.255.255.0',
	hintWild: '! hati hati, wildcard itu kebalikan mask, 255.255.255.0 jadi 0.0.0.255'
};
