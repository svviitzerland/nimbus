import type { PermissionsText } from './types';

export const id: PermissionsText = {
	title: 'Permission dan sudo',
	intro: [
		'Server Linux itu kayak rumah bersama. Admin, kamu, dan program yang ngejalanin nimbus.com semuanya tinggal di situ, dan nggak semua orang boleh nyentuh semua barang. Makanya tiap file punya aturan kecil yang namanya <b>permission</b>.',
		'Ada tiga jenis izin. <b>r</b> (read) boleh buka dan lihat isinya, <b>w</b> (write) boleh ngubah, dan <b>x</b> (execute) boleh dijalankan kayak program.',
		'Terus ada tiga jenis orang. <b>Pemilik</b> file (owner), <b>grup</b>nya (sekumpulan user yang berbagi file itu), dan <b>orang lain</b> (others), alias semua sisanya. Tiga orang kali tiga izin jadi sembilan saklar, dan <b>ls -l</b> nampilinnya sebagai sembilan huruf.',
		'Di atas semua orang ada <b>root</b>, admin yang boleh ngapain aja. Kamu bukan root, tapi kamu boleh minjem kekuatannya buat satu perintah aja dengan naruh <b>sudo</b> di depannya (singkatan dari super user do). Kuat banget, jadi pakainya hati hati.',
		'[fyi] Di server beneran, sudo minta password kamu dulu dan nyatet tiap pemakaiannya di log, jadi tim selalu tau siapa ngapain. Windows juga punya ide yang sama, namanya Run as administrator.',
		'Giliran kamu. Mulai dengan jalanin script backup kamu pakai <b>./backup.sh</b> dan lihat apa yang terjadi. Habis itu benerin, baca pengaturan khusus admin pakai sudo, terus coba jalan pintas berbahaya yang sering bikin orang tergoda. Tap saklar di kartu biar chmodnya diketikin.'
	],
	reactions: {
		listed:
			'Baca hurufnya dari kiri ke kanan. Tiga pertama punya pemilik (kamu, nim), tiga berikutnya grup, tiga terakhir orang lain. Kelihatan kan? backup.sh punya <b>r</b> dan <b>w</b> buat kamu, tapi nggak ada <b>x</b>, jadi belum ada yang boleh jalanin.',
		runDenied:
			'Permission denied! Scriptnya punyamu, tapi Linux nggak mau jalanin karena saklar <b>x</b>nya belum nyala. Intip dulu pakai <b>ls -l</b>, terus tambahin pakai <b>chmod u+x backup.sh</b> (u artinya user, plus x).',
		chmodX:
			'Sekarang ada <b>x</b>, dan di kartu saklar run udah nyala. Coba <b>./backup.sh</b> lagi.',
		ran: 'Jalan! <b>chmod</b> (change mode) nyalain satu saklar dan filenya jadi program. Tanda ./ di depan cuma artinya "yang ada di folder ini".',
		bashTrick:
			'Licik juga, itu memang bisa. <b>bash backup.sh</b> cuma perlu baca filenya lalu jalanin barisnya sendiri. Tapi misinya minta filenya sendiri bisa dijalankan, jadi kasih x dan pakai ./backup.sh ya.',
		confDenied:
			'Ditolak. app.conf punya root dan isinya password database, jadi orang lain ngintip pun nggak boleh. Tapi kamu punya hak admin di server ini, coba pakai <b>sudo</b> di depannya.',
		sudo: 'Pakai sudo filenya kebuka. Buat satu perintah itu, kamu jadi root. Perhatiin, kamu sama sekali nggak ngubah aturan filenya, kamu cuma minjem kunci yang lebih besar sekali aja, jauh lebih aman daripada ngebuka file itu buat semua orang.',
		notOwner:
			'Nggak boleh. Cuma pemilik file (atau root) yang boleh ngubah permissionnya, dan file itu punya root. Taruh <b>sudo</b> di depan kalau kamu beneran yakin.',
		risky:
			'Awas! <b>777</b> nyalain sembilan saklar sekaligus, jadi tiap user dan tiap program di server ini sekarang boleh nulis ulang file itu. Kalau ada yang nyelipin kode jahat ke backup.sh, nanti malam kamu sendiri yang jalanin. Balikin pakai <b>chmod 755</b>.',
		othersWrite:
			'Hmm, orang lain sekarang boleh ngubah file itu. Di server, itu hampir nggak pernah yang kamu mau. Matiin lagi ya.',
		chmod:
			'Saklarnya berubah. Tiap huruf juga punya angka, r itu 4, w itu 2, x itu 1, jadi <b>755</b> artinya pemilik dapat 7 (4+2+1) dan sisanya dapat 5 (baca dan jalanin).',
		undo: 'Aman lagi. 755 bikin kamu boleh semuanya sementara yang lain cuma boleh baca dan jalanin. Ingat yang ini, kebanyakan script dan program di server pakai angka ini.',
		rmrf: 'Waduh, itu bakal ngehapus seluruh server! Linux punya pengaman khusus buat yang satu ini. Pengingat bagus kalau sudo ngelakuin apa yang kamu ketik, bukan apa yang kamu maksud.',
		missing:
			'Nggak ada yang namanya itu di sini. Jalanin <b>ls -l</b> buat lihat filenya, backup.sh ada di folder rumahmu.',
		denied: 'Dikunci. Cek hurufnya pakai <b>ls -l</b>, dan kalau punya root, kuncinya sudo.',
		error:
			'Server nggak kenal perintah itu. Cek lagi ejaannya, atau ketik <b>help</b> buat lihat perintah yang dia tau.',
		done: 'Beres semua! Kamu bisa baca huruf permission, ngasih saklar run ke script, minjem kuasa admin pakai sudo buat satu perintah, dan ngerti kenapa 777 itu jebakan. Begitulah cara jaga server bersama tetap aman. Habis ini, sudo itu bakal kamu pakai buat masang software beneran.'
	},
	missionsLabel: 'Misi',
	missions: [
		'Baca huruf permissionnya',
		'Bikin backup.sh bisa jalan, lalu jalankan',
		'Baca app.conf pakai sudo',
		'Coba 777 yang berbahaya, lalu balikin'
	],
	hintBtn: 'Bantu',
	doneNote: 'Semua misi beres, servernya aman',
	inputLabel: 'perintah',
	termHint: '# mulai dengan ./backup.sh lalu tekan Enter',
	hintUnknown: '# perintah itu nggak ada di sini, ketik help buat lihat daftarnya',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu, ls nampilin isi sekitar',
	hintDenied: '# permission denied, ls -l nunjukin siapa boleh ngapain',
	cardLabel: 'Saklar permission',
	permLabels: ['baca', 'tulis', 'jalan'],
	ownerLabel: 'pemilik',
	groupLabel: 'grup',
	othersLabel: 'orang lain',
	cardNote: 'Tap saklar biar chmodnya diketikin',
	dangerNote: 'Siapa pun di server ini boleh nulis ulang file ini'
};
