import type { ProcessesText } from './types';

export const id: ProcessesText = {
	title: 'Proses',
	intro: [
		'Tiap program yang kamu jalankan, web server, database, bahkan terminal tempat kamu ngetik, jadi sebuah <b>proses</b> selama dia jalan. Linux ngasih tiap proses nomor yang namanya <b>PID</b> (process ID), kayak nomor antrean di bank. Server nimbus.com kita lagi jalanin beberapa proses sekarang.',
		'Buat lihat siapa saja yang jalan, Nim ngetik <b>ps aux</b> (ps singkatan dari process status, aux artinya tampilkan semua dari semua user). Tiap baris itu satu proses, lengkap dengan pemiliknya, PIDnya, dan seberapa banyak <b>CPU</b> (otaknya) dan <b>RAM</b> (memori kerjanya) yang dia pakai.',
		'Daftar tadi cuma foto. Buat tampilan langsung, Nim ngetik <b>top</b>. Dia nyegerin dirinya tiap beberapa detik dan naruh proses paling rakus di paling atas. Lihat, report.py ngabisin hampir semua CPU! (htop, alat yang kamu pasang tadi, itu top versi lebih ramah dengan bar warna warni.)',
		'report.py nyangkut di loop dan seluruh situs jadi lemot. Buat ngehentiin, pakai <b>kill</b> dan PIDnya, <b>kill 4242</b>. kill ngirim pesan sopan, tolong beresin lalu tutup. Tapi yang ini nyangkutnya parah sampai nggak dengar.',
		'Buat proses yang bandel, ada <b>kill -9</b>. Ini bukan permintaan lagi, Linux langsung nyingkirin dia saat itu juga, dan CPUnya tenang lagi. Simpan buat jalan terakhir, soalnya programnya nggak sempat nyimpan kerjaannya.',
		'Satu trik lagi. Kerjaan yang lama biasanya nahan terminalmu sampai selesai, itu namanya <b>foreground</b>. Taruh <b>&</b> di belakang, <b>./backup.sh &</b>, dan dia pindah ke <b>background</b> jadi kamu bisa lanjut ngetik. <b>jobs</b> nunjukin apa yang jalan di belakang, dan <b>fg</b> manggil dia ke depan lagi.',
		'[ingat] Bayangin dapur restoran. Tiap masakan di kompor itu proses dengan nomor pesanannya sendiri (PID). ps itu baca papan pesanan, top itu ngawasin wajan mana yang ngebul, dan kill itu angkat wajan yang gosong dari api.',
		'[fyi] Idenya sama, dunianya beda. Di Windows namanya Task Manager (Ctrl+Shift+Esc), di Mac namanya Activity Monitor, dan di HP kamu juga ngelakuin hal yang sama waktu nge swipe app yang macet.',
		'Giliranmu. Ada script lain, thumbs.py, barusan ngamuk dan nyedot CPU. PIDnya 5150. Ketik <b>kill 5150</b> dan lihat meterannya tenang lagi.'
	],
	reactions: {
		killed: 'Beres. Prosesnya berhenti, barisnya hilang dari daftar, dan CPUnya bisa napas lagi.',
		killed9:
			'Disingkirin saat itu juga pakai kill -9. Tanpa pamit dan tanpa nyimpan. Berguna buat proses yang beku, bahaya buat yang lain.',
		ignored:
			'kill nggak nampilin apa apa, dan prosesnya masih ada. Dia terlalu nyangkut buat dengar permintaan sopan. Saatnya <b>kill -9</b>.',
		listed: 'Tiap baris itu satu proses. Cari kolom PID, angka itulah yang dibutuhin kill.',
		top: 'top ngurutin dari yang paling rakus, jadi proses tersibuk ada di atas. Di server beneran dia terus nyegerin diri sampai kamu tekan q.',
		background:
			'Sekarang dia jalan di background dan terminalmu bebas lagi. Angka di dalam kurung itu nomor job, angka satunya PIDnya.',
		jobs: 'jobs nunjukin apa yang jalan di background terminal ini. <b>fg</b> bakal manggil dia ke depan lagi.',
		pid1: 'PID 1 itu systemd, proses paling pertama yang nyalain semua proses lain. Linux ngelindungin dia, jadi nggak terjadi apa apa. Untung deh.',
		noProcess: 'Nggak ada proses dengan PID itu. Cek lagi daftarnya pakai <b>ps aux</b>.',
		needSudo:
			'Proses itu punya user lain, jadi cuma admin yang boleh ngehentiin. Taruh <b>sudo</b> di depan, kayak di [[Permission dan sudo|linux/permissions]].',
		missing: 'Nggak ada yang namanya itu di sini. Coba <b>kill 5150</b>.',
		denied: 'Dikunci, itu butuh admin. Taruh <b>sudo</b> di depan.',
		error: 'Servernya nggak ngerti. Coba <b>kill 5150</b>, persis kayak gitu.'
	},
	panels: [
		{
			tag: 'Proses',
			title: 'Program yang lagi kerja',
			body: 'Program di disk itu cuma file. Begitu dijalankan dia jadi <b>proses</b>, dan tiap proses dapat <b>PID</b> sendiri.'
		},
		{
			tag: 'ps',
			title: 'Siapa yang jalan',
			body: '<b>ps aux</b> nampilin semua proses sekali, dengan pemilik, PID, CPU, dan memorinya. Anggap aja foto.'
		},
		{
			tag: 'top',
			title: 'Tampilan langsung',
			body: '<b>top</b> (atau <b>htop</b> yang lebih cakep) nyegerin diri sendiri dan naruh proses paling rakus di atas.'
		},
		{
			tag: 'kill',
			title: 'Berhenti baik baik',
			body: '<b>kill 4242</b> minta proses 4242 beres beres lalu tutup. Kebanyakan program nurut, yang beku belum tentu.'
		},
		{
			tag: 'kill -9',
			title: 'Jalan terakhir',
			body: '<b>kill -9</b> langsung ngakhirin proses, tanpa sempat beres beres atau nyimpan. Coba kill yang sopan dulu.'
		},
		{
			tag: 'Background',
			title: 'Depan atau belakang',
			body: 'Kerjaan di <b>foreground</b> nahan terminal. Tambah <b>&</b> buat ngirim dia ke <b>background</b>, cek pakai <b>jobs</b>, panggil balik pakai <b>fg</b>.'
		},
		{
			tag: 'Cara ingat',
			title: 'Dapur yang sibuk',
			body: 'Masakan, proses. Nomor pesanan, PID. Papan pesanan, ps. Wajan ngebul, top. Angkat dari api, kill.'
		},
		{
			tag: 'Info',
			title: 'Task Manager juga',
			body: 'Windows, Mac, dan HP semuanya punya daftar program yang jalan dan bisa nutup yang macet. Linux cuma pakai kata kata.'
		},
		{
			tag: 'Giliranmu',
			title: 'Hentikan thumbs.py',
			body: 'Ketik <b>kill 5150</b> lalu tekan Enter. Baris merahnya hilang dan meteran CPU jadi hijau.'
		}
	],
	watchLabel: 'Nim lagi ngetik, lihat aja dulu',
	tryLabel: 'Giliranmu, ketik',
	tryTip: 'Tap biar Nim yang ngetik',
	inputLabel: 'perintah',
	termHint: '# Nim ngetik di sini dulu, lihat aja',
	hintUnknown: '# perintah itu nggak ada di sini',
	didYouMean: '# mungkin maksudnya {word}',
	hintMissing: '# nggak ada yang namanya itu di sini',
	hintDenied: '# dikunci, cuma admin yang boleh',
	serverLabel: 'Server nimbus.com',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	listTitle: 'Lagi jalan',
	bgLabel: 'background',
	stuckLabel: 'nyangkut',
	rule: 'ps itu daftar, top itu ngawasin, kill itu ngehentiin.',
	hintSudo: '# proses itu bukan punyamu, taruh sudo di depan',
	hintKill: '# coba kill 5150',
	hintTop: '# top beneran terus nyegerin diri, tekan q buat keluar'
};
