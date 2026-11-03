import type { LinuxFilesText } from './types';

export const id: LinuxFilesText = {
	title: 'File system Linux',
	intro: [
		'Server nimbus.com kamu itu komputer di data center, dan kayak kebanyakan server di internet, dia jalan pakai <b>Linux</b>. Yang ini pakai <b>Ubuntu</b>, salah satu jenis Linux yang paling populer. Nggak ada desktop buat diklik, adanya cuma terminal, jadi hari ini kamu belajar jalan jalan di dalamnya pakai ngetik.',
		'Semua file di Linux tinggal di satu pohon besar. Puncaknya namanya <b>root</b> dan ditulis cuma pakai satu garis miring, <b>/</b>. Semua folder lain tumbuh dari situ, jadi path kayak /var/log/nimbus itu artinya jalan dari puncak, masuk satu folder demi satu folder.',
		'Ada beberapa folder yang bakal sering banget kamu datangi. <b>home</b> isinya file milik tiap user (punyamu di /home/nim), <b>etc</b> nyimpen pengaturan, dan <b>var</b> nyimpen hal yang berubah terus sepanjang hari, contohnya log.',
		'[fyi] Windows beda caranya, tiap drive punya pohonnya sendiri, kayak drive C dan drive D. Di Linux, disk kedua atau flashdisk cuma muncul sebagai satu folder lagi di dalam pohon yang sama.',
		'Kamu masuk ke server ini lewat SSH, pintu jarak jauh dari [[remote access|cloud/remote-access]], dan jalannya pakai perintah yang sama kayak di [[CLI vs GUI|foundations/cli-gui]]. <b>pwd</b> ngasih tau kamu lagi di mana, <b>ls</b> nampilin isi sekitar, <b>cd</b> masuk ke folder, dan <b>cat</b> nampilin isi file.',
		'Kabar buruk, nimbus.com mati semalam. Server punya buku harian namanya <b>log</b>, jadi alasannya pasti tercatat di suatu tempat. Cari log errornya dan baca apa yang terjadi. Tap folder di pohon, atau tekan Bantu kalau bingung.'
	],
	reactions: {
		pwd: '/home/nim, itu folder rumahmu. Tiap user dapat satu di dalam /home, dan tanda <b>~</b> di prompt itu cuma cara singkat nulisnya.',
		root: 'Nah, itu puncak pohonnya sekaligus. Program di bin dan usr, pengaturan di etc, user di home, log di var. Hampir semua server Linux di dunia susunannya sama kayak gini.',
		varlog:
			'Kamu udah sampai di ruang buku harian. Tiap aplikasi nulis catatannya di sini, dan nimbus.com punya dua. Coba tampilin yang error.',
		found:
			'Ketemu. Disknya penuh jam 03.07 dan nimbus.com berhenti. Selesaikan misi lainnya biar tur kita beres.',
		etc: 'Selamat datang di /etc, rumahnya pengaturan. Coba <b>cat hostname</b>, file kecil itu nyimpen nama server ini.',
		hostname:
			'nimbus, nama mesin ini. Pengaturan di /etc itu file teks biasa kayak gini, makanya admin suka, bisa dibaca dan diubah pakai editor apa aja.',
		access:
			'Itu access log, satu baris buat tiap kunjungan ke nimbus.com. Berguna, tapi cerita mogoknya ada di <b>error.log</b>.',
		notes: 'Catatanmu sendiri dari kemarin. Petunjuk bagus, log tinggalnya di /var/log.',
		rootHome:
			'Dikunci. <b>/root</b> itu folder rumah milik user bernama root, admin yang paling berkuasa, dan yang lain nggak boleh masuk. Namanya sama kayak puncak pohon, tapi tempatnya beda banget.',
		missing:
			'Nggak ada yang namanya itu di sana. Jalankan <b>ls</b> buat lihat isinya. Oh iya, Linux peduli huruf besar kecil, jadi Log sama log itu dua nama yang beda.',
		denied:
			'Dikunci. Ada file yang cuma boleh dibuka admin, nanti kamu belajar cara bukanya di [[Permission dan sudo|linux/permissions]].',
		error:
			'Server nggak kenal perintah itu. Cek lagi ejaannya, atau ketik <b>help</b> buat lihat perintah yang dia tau.',
		done: 'Misteri terpecahkan! Jam 03.07 disknya penuh total, upload nggak bisa disimpan, dan nimbus.com berhenti. Kamu barusan jalan dari / sampai ke /var/log/nimbus dan baca lognya, dan itu hal pertama yang dilakuin admin tiap kali server bermasalah.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Cari tau kamu lagi di mana',
		'Lihat sekeliling dari puncak, /',
		'Masuk ke /var/log/nimbus',
		'Baca error.log'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, kamu nemu kenapa situsnya mati',
	inputLabel: 'perintah',
	termHint: '# ketik perintah kayak pwd atau ls, lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada di sini, ketik help buat lihat daftarnya',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# dikunci, cuma pemiliknya atau admin yang boleh buka',
	treeLabel: 'Pohon folder',
	hereLabel: 'kamu di sini',
	dirNotes: {
		bin: 'program dasar',
		etc: 'pengaturan',
		home: 'file milik user',
		root: 'rumah si admin',
		tmp: 'tempat sementara',
		usr: 'aplikasi terpasang',
		var: 'log dan website'
	}
};
