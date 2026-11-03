import type { HardeningText } from './types';

export const id: HardeningText = {
	title: 'Server hardening',
	intro: [
		'Kamu baru saja menyewa server baru buat nimbus.com. Masih segar dari pabrik, dia mirip rumah baru yang semua jendelanya dibiarkan terbuka oleh tukangnya, plus kunci cadangan di bawah keset.',
		'Dan kamu nggak akan sendirian lama. Beberapa menit setelah online, bot otomatis mulai mengetuk, mencoba semua pintu yang mereka tahu, siang malam, dari seluruh penjuru internet.',
		'<b>Server hardening</b> artinya menutup semua pintu yang nggak kamu butuhkan, sampai satu satunya jalan masuk adalah pintu yang kamu jaga. Update software, tutup <b>port</b> (pintu bernomor tempat server mendengarkan) yang nggak dipakai, login pakai kunci bukan password, dan beri tiap program kuasa seperlunya saja.',
		'Melewatkan ini bisa fatal. Tahun 2017 lembaga kredit Equifax kebocoran data sekitar 147 juta orang. Lubangnya ada di Apache Struts, software di server web mereka, dan tambalannya sudah tersedia dua bulan sebelumnya. Nggak ada yang memasangnya.',
		'[fyi] Hardening nggak cuma buat server. HP yang terus minta update dan layar kunci laptopmu juga termasuk hardening. Di cloud, provider mengamankan gedung dan mesinnya, tapi server yang kamu sewa tetap tugasmu untuk dikunci, itulah [[shared responsibility|networking/shared-responsibility]].',
		'Ini server nimbus.com yang masih baru. Jalankan scanner untuk melihat berapa pintu yang terbuka, lalu tutup satu per satu, tapi jangan tutup pintu yang dipakai pengunjungmu.'
	],
	reactions: {
		scan: 'Aduh, skornya 10. Enam pintu terbuka lebar, dan bot sudah mulai mencobanya. Ketuk pintu yang merah untuk menutupnya, urutannya bebas.',
		update:
			'Sudah diupdate. Kebanyakan serangan memakai lubang yang sebenarnya sudah ada tambalannya, persis kasus Equifax. Menyalakan update keamanan otomatis itu perlindungan paling murah.',
		telnet:
			'Telnet ditutup. Ini cara login jarak jauh dari tahun 1969 yang mengirim semuanya, termasuk password, sebagai teks biasa yang bisa dibaca. SSH sudah lama menggantikannya, jadi pintu ini nggak perlu.',
		db: 'Pintu database ditutup dari internet. Sekarang cuma server web di sebelahnya yang boleh bicara dengannya. Satu aturan [[firewall|networking/firewall]] kecil seperti ini mencegah banyak sekali kebocoran.',
		sshkey:
			'Password dimatikan, kunci dinyalakan. Bot bisa menebak password seharian (itu namanya [[brute force|security/brute-force]]), tapi dia nggak bisa menebak file kunci yang cuma ada di laptopmu.',
		root: 'Aplikasi web sekarang jalan sebagai user kecilnya sendiri, bukan <b>root</b>, admin yang serba bisa. Kalau suatu hari dibobol, penyerang cuma masuk ke satu kamar kecil, bukan seluruh rumah. Namanya <b>least privilege</b>.',
		default:
			'Panel admin masih memakai password bawaan pabrik, admin dan admin. Bot selalu mencoba itu duluan. Password yang panjang dan unik menutup pintu paling gampang dari semuanya.',
		web: 'Waduh, nimbus.com langsung offline. Port 443 itu pintu yang dipakai pengunjungmu untuk HTTPS. Hardening artinya menutup pintu yang nggak dibutuhkan, bukan semua pintu. Buka lagi, yuk.',
		done: 'Skor 100. Semua pintu yang nggak perlu sudah tertutup, dan satu satunya jalan masuk adalah pintu depan yang kamu awasi. Tim sungguhan menjalankan scanner seperti ini secara rutin, karena lubang baru muncul tiap minggu.'
	},
	serverLabel: 'Server nimbus.com',
	scanBtn: 'Jalankan scanner',
	scoreLabel: 'Skor keamanan',
	doors: {
		update: {
			name: 'Software dua tahun lalu',
			risk: 'Ada lubang terkenal yang tambalannya sudah ada',
			fix: 'Update',
			done: 'Terbaru, update otomatis nyala'
		},
		telnet: {
			name: 'Port 23, Telnet',
			risk: 'Login lama yang mengirim password apa adanya',
			fix: 'Tutup',
			done: 'Ditutup selamanya'
		},
		db: {
			name: 'Port 3306, database',
			risk: 'Bisa dijangkau dari seluruh internet',
			fix: 'Tutup',
			done: 'Cuma server web yang bisa menjangkau'
		},
		sshkey: {
			name: 'Login SSH pakai password',
			risk: 'Bot bisa terus menebak tanpa henti',
			fix: 'Pakai kunci',
			done: 'Cuma bisa login pakai kunci'
		},
		root: {
			name: 'Aplikasi jalan sebagai root',
			risk: 'Sekali dibobol, semuanya ikut diserahkan',
			fix: 'Perkecil',
			done: 'Jalan sebagai user kecil'
		},
		default: {
			name: 'Panel admin, admin dan admin',
			risk: 'Password bawaan pabrik, yang pertama dicoba bot',
			fix: 'Ganti',
			done: 'Password panjang dan unik'
		}
	},
	web: {
		name: 'Port 443, HTTPS',
		note: 'Pintu masuk pengunjungmu',
		close: 'Tutup',
		reopen: 'Buka lagi',
		closedNote: 'Tertutup, nggak ada yang bisa membuka nimbus.com'
	},
	openTag: 'terbuka',
	closedTag: 'tertutup',
	neededTag: 'dibutuhkan',
	siteUp: 'online',
	siteDown: 'offline',
	hintIdle: 'Server baru, masih segar dari pabrik',
	hintScan: 'Ketuk pintu merah untuk menutupnya',
	hintDone: 'Semua pintu yang nggak perlu sudah tertutup'
};
