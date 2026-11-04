import type { PermissionsText } from './types';

export const id: PermissionsText = {
	title: 'Permission dan sudo',
	intro: [
		'Server Linux itu kayak rumah bareng. Admin, kamu, dan program program di balik nimbus.com tinggal di situ, dan nggak semua orang boleh pegang semuanya. Makanya tiap file punya aturan kecil yang namanya <b>permission</b>. Lihat kartunya, itu file backup.sh punyamu.',
		'Nim ngetik <b>ls -l</b> (list, versi panjang) buat lihat aturannya. Deretan huruf aneh di depannya itu cara file bilang siapa boleh ngapain. Lihat hurufnya pindah ke saklar.',
		'Baca saklarnya kayak tabel kecil. Kolomnya <b>r</b> read (buka dan lihat), <b>w</b> write (ubah), dan <b>x</b> run (jalanin kayak program). Barisnya <b>owner</b> (kamu), <b>group</b> (tim yang berbagi file), dan <b>others</b>, semua orang lain.',
		'Sekarang Nim coba jalanin scriptnya pakai <b>./backup.sh</b> (./ artinya yang ada di sini). Permission denied! Saklar run mati buat semua orang, jadi Linux nolak.',
		'Obatnya <b>chmod</b> (change mode). <b>chmod u+x</b> artinya buat user, tambahin run. Satu saklar nyala, dan kali ini ./backup.sh jalan.',
		'Admin biasanya nulis permission pakai tiga angka, satu per baris. Read nilainya 4, write 2, run 1, terus dijumlah. Jadi <b>chmod 755</b> ngasih owner semuanya (4+2+1), dan yang lain read plus run (4+1).',
		'[ingat] Bayangin tiga koin, read 4, write 2, run 1. Kantong isi <b>7 berarti pegang semua koin</b>, 5 berarti read dan run, 0 berarti kantongnya kosong.',
		'Ada file yang punya <b>root</b>, admin yang boleh ngapain aja. nimbus.conf nyimpen password, jadi baca aja ditolak. Taruh <b>sudo</b> di depan, dan kamu minjem kekuatan root buat satu perintah itu.',
		'[ingat] <b>sudo</b> artinya "tolong, atas nama bos". Kuat banget, jadi pakai cuma kalau perintahnya memang butuh. Di server beneran, sudo nanya password dan nyatet tiap pemakaian di log.',
		'Giliranmu. backup.sh itu punyamu sendiri, jadi kunci rapat. Ketik <b>chmod 700 backup.sh</b>. Tujuh buat kamu (semuanya), nol buat group, nol buat yang lain.'
	],
	reactions: {
		locked:
			'Terkunci rapat. Cuma baris paling atas yang nyala, jadi kamu boleh baca, ubah, dan jalanin, yang lain ngintip pun nggak bisa. Itu artinya 7, 0, 0.',
		chmod:
			'Saklarnya berubah. Tiap angka itu satu baris, 4 buat read, 2 buat write, 1 buat run. Buat giliranmu, coba <b>chmod 700 backup.sh</b>.',
		risky:
			'Hati hati! Sekarang orang lain boleh nulis ke file itu, jadi siapa aja di server ini bisa nyelipin kode jahat, dan nanti malam kamu sendiri yang jalanin. Kunci pakai <b>chmod 700 backup.sh</b>.',
		ran: 'Jalan, soalnya saklar run punyamu nyala. ./ cuma artinya file yang ada di folder ini.',
		sudo: 'Pakai sudo, filenya kebuka. Buat satu perintah itu kamu jadi root. Aturan filenya nggak berubah, kamu cuma minjem kunci yang lebih besar sekali aja.',
		missing:
			'Nggak ada file dengan nama itu di sini. backup.sh ada di folder rumahmu, jadi ketik <b>chmod 700 backup.sh</b>.',
		denied:
			'Ditolak. Cuma pemiliknya (atau root, pakai sudo) yang boleh buka atau ubah file itu. Tapi backup.sh punyamu kok.',
		error: 'Servernya nggak ngerti. Coba <b>chmod 700 backup.sh</b>, persis kayak gitu.'
	},
	panels: [
		{
			tag: 'Permission',
			title: 'Aturan di tiap file',
			body: 'Tiap file punya <b>owner</b> dan sembilan saklar kecil yang bilang siapa boleh baca, ubah, atau jalanin.'
		},
		{
			tag: 'ls -l',
			title: 'Sembilan huruf',
			body: 'Hurufnya datang dalam tiga kelompok isi tiga. Ada huruf berarti saklarnya nyala, garis pendek di tempatnya berarti mati.'
		},
		{
			tag: 'Tabelnya',
			title: 'Tiga orang, tiga aksi',
			body: 'Tiga jenis orang (owner, group, others) kali tiga jenis aksi (read, write, run), jadinya sembilan saklar.'
		},
		{
			tag: 'Ditolak',
			title: 'Nggak ada saklar run, nggak jalan',
			body: 'File punyamu sendiri pun nggak bisa jalan sebagai program sebelum saklar <b>x</b> dinyalakan. Linux ngecek dulu sebelum ngapa ngapain.'
		},
		{
			tag: 'chmod',
			title: 'Nyalain saklar',
			body: '<b>u</b> itu user (owner), <b>g</b> group, <b>o</b> others. <b>+x</b> nambah run, dan tanda minus gantinya plus bakal nyabut.'
		},
		{
			tag: 'Angka',
			title: 'Tiga angka, tiga baris',
			body: 'Tiap baris jumlahin saklarnya, 4 buat read, 2 buat write, 1 buat run. 755 itu setelan paling umum buat script.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tujuh itu lengkap',
			body: '4 tambah 2 tambah 1 jadi 7. 6 itu baca dan tulis, 5 baca dan jalan, 4 cuma baca, 0 nggak boleh apa apa.'
		},
		{
			tag: 'sudo',
			title: 'Pinjam kunci bos',
			body: '<b>root</b> boleh ngapain aja. <b>sudo</b> di depan satu perintah bikin perintah itu aja jalan sebagai root.'
		},
		{
			tag: 'Biar nempel',
			title: 'Tolong, atas nama bos',
			body: 'Pakai sudo cuma kalau perintahnya butuh. Ngebuka file buat semua orang nggak pernah jadi solusi yang lebih aman.'
		},
		{
			tag: 'Giliranmu',
			title: 'Cuma buat kamu',
			body: 'Ketik <b>chmod 700 backup.sh</b> dan lihat baris group dan others mati.'
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
	hintDenied: '# dikunci, cuma pemiliknya atau admin yang boleh',
	ownedBy: 'punya {owner}',
	permLabels: ['read', 'write', 'run'],
	rowLabels: ['owner', 'group', 'others'],
	sumLabel: 'jumlah',
	deniedChip: 'Permission denied',
	ranChip: 'Jalan',
	bossChip: 'sudo, jadi root',
	rule: 'Read 4, write 2, run 1. Tujuh artinya lengkap.',
	sudoRule: 'sudo artinya tolong, atas nama bos.'
};
