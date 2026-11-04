import type { LinuxFilesText } from './types';

export const id: LinuxFilesText = {
	title: 'File system Linux',
	intro: [
		'Website nimbus.com kamu tinggal di sebuah <b>server</b>, komputer di data center. Kayak kebanyakan server di internet, dia jalan pakai <b>Linux</b> (yang ini Ubuntu). Nggak ada desktop, nggak ada mouse, adanya cuma <b>terminal</b>, jendela tempat kamu ngetik perintah. Kamu masuk lewat SSH, pintu jarak jauh dari [[remote access|cloud/remote-access]].',
		'Semua file di Linux tinggal di satu pohon folder yang besar. Puncaknya namanya <b>root</b> dan ditulis cuma pakai satu garis miring, <b>/</b>. Semua folder lain tumbuh dari situ, kayak cabang dari batang pohon.',
		'Pertanyaan pertama di tempat baru, aku lagi di mana? Perintah <b>pwd</b> yang jawab (print working directory). Lihat Nim ngetik. Kamu ada di /home/nim, folder rumahmu sendiri.',
		'Terus, lihat sekeliling. <b>ls</b> nampilin isi sebuah folder, idenya sama kayak di [[CLI vs GUI|foundations/cli-gui]]. Nim minta lihat puncaknya pakai <b>ls /</b>, dan cabang cabang pertama langsung nyala. home isinya user, etc isinya pengaturan, dan var isinya hal yang berubah terus, contohnya log.',
		'Sekarang jalan. <b>cd</b> (change directory) mindahin kamu ke sebuah folder. Path kayak /var/log/nimbus artinya turun dari puncak, satu folder demi satu folder. Ikutin pinnya.',
		'Terakhir, baca. <b>cat</b> nampilin isi file ke layar. Nim lihat isi foldernya, lalu baca error.log, dan ketemu deh alasan nimbus.com mati semalam. Disknya penuh.',
		'[ingat] Empat perintah, empat pertanyaan kecil. <b>pwd</b> nanya aku di mana, <b>ls</b> nanya ada apa di sini, <b>cd</b> bilang ayo ke sana, <b>cat</b> bilang coba lihat isinya.',
		'[fyi] Windows caranya beda, tiap drive punya pohonnya sendiri (C, D, dan seterusnya). Di Linux, disk kedua atau flashdisk cuma muncul sebagai satu folder lagi di pohon yang sama.',
		'Giliranmu, dan ini kecil banget. Kamu lagi jauh di dalam /var/log/nimbus. Ketik <b>cd ~</b> buat langsung pulang. Tanda bergelombang <b>~</b> itu selalu berarti folder rumahmu.'
	],
	reactions: {
		home: 'Wuss, udah pulang ke /home/nim. Lihat promptnya, ada <b>~</b> lagi. Mau nyasar sejauh apa pun di server, cd ~ selalu bawa kamu pulang.',
		moved:
			'Kamu pindah, dan pinnya ikut pindah. Prompt selalu nunjukin kamu lagi di mana, jadi nggak perlu nebak. Ketik <b>cd ~</b> kapan aja kamu mau pulang.',
		looked:
			'Itu ls nampilin isi folder ini. Folder warnanya biru, file biasa putih. Mau masuk ke salah satunya? Pakai cd.',
		read: 'cat nampilin seluruh isi file. Log, pengaturan, catatan, di Linux hampir semuanya teks biasa yang bisa dibaca kayak gini.',
		pwd: 'pwd ngasih tau persis kamu lagi di mana, path yang sama kayak yang ditunjuk pinnya.',
		rootHome:
			'Dikunci. <b>/root</b> itu folder rumah milik admin yang namanya root, yang lain nggak boleh masuk. Namanya sama kayak puncak pohon, tapi tempatnya beda banget. Soal kunci ada di [[Permission dan sudo|linux/permissions]].',
		missing:
			'Nggak ada yang namanya itu di sana. Coba <b>ls</b> buat lihat isinya. Oh iya, Linux peduli huruf besar kecil, jadi Log sama log itu dua nama yang beda.',
		denied:
			'Dikunci, yang itu cuma buat admin. Kuncinya nanti kamu pelajari di [[Permission dan sudo|linux/permissions]].',
		error: 'Server nggak kenal perintah itu. Cek lagi ejaannya, atau coba <b>cd ~</b>.'
	},
	panels: [
		{
			tag: 'Server',
			title: 'Komputer tanpa layar',
			body: '<b>Server</b> nyala siang malam di data center. Kamu ngobrol sama dia lewat ngetik di <b>terminal</b>, dan dia jawab pakai teks.'
		},
		{
			tag: 'Root',
			title: 'Puncak pohonnya',
			body: 'Semuanya mulai dari <b>/</b>. Path itu daftar folder yang kamu lewati dari puncak, dipisah pakai garis miring.'
		},
		{
			tag: 'pwd',
			title: 'Aku di mana',
			body: '<b>pwd</b> nampilin folder tempat kamu berdiri. Pin di pohon nandain tempat yang sama.'
		},
		{
			tag: 'ls',
			title: 'Ada apa di sini',
			body: '<b>ls</b> nampilin isi folder. Di terminal, folder warnanya biru dan file biasa warnanya putih.'
		},
		{
			tag: 'cd',
			title: 'Ayo ke sana',
			body: '<b>cd</b> ditambah path bikin kamu pindah. Promptnya ikut berubah, selalu nunjukin kamu di mana.'
		},
		{
			tag: 'cat',
			title: 'Lihat isinya',
			body: '<b>cat</b> nampilin seluruh isi file. Log kayak gini itu teks biasa, memang dibuat buat dibaca manusia.'
		},
		{
			tag: 'Cara ingat',
			title: 'Empat pertanyaan',
			body: 'pwd, aku di mana. ls, ada apa di sini. cd, ayo ke sana. cat, lihat isinya.'
		},
		{
			tag: 'Info',
			title: 'Satu pohon, bukan drive',
			body: 'Disk tambahan gabung ke pohon sebagai folder, biasanya di <b>/mnt</b> atau <b>/media</b>. Nggak pernah ada drive C.'
		},
		{
			tag: 'Giliranmu',
			title: 'Pulang ke rumah',
			body: 'Ketik <b>cd ~</b> lalu tekan Enter, terus lihat pinnya terbang balik ke /home/nim.'
		}
	],
	watchLabel: 'Nim lagi ngetik, lihat aja dulu',
	tryLabel: 'Giliranmu, ketik',
	tryTip: 'Tap biar Nim yang ngetik',
	inputLabel: 'perintah',
	termHint: '# Nim ngetik di sini dulu, lihat aja',
	hintUnknown: '# perintah itu nggak ada di sini',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# dikunci, cuma pemiliknya atau admin yang boleh buka',
	hereLabel: 'Kamu di',
	cheats: [
		{ cmd: 'pwd', means: 'aku di mana' },
		{ cmd: 'ls', means: 'ada apa di sini' },
		{ cmd: 'cd', means: 'ayo ke sana' },
		{ cmd: 'cat', means: 'lihat isinya' }
	]
};
