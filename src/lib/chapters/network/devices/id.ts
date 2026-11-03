import type { DevicesText } from './types';

export const id: DevicesText = {
	title: 'Perangkat jaringan',
	intro: [
		'Internet nggak jatuh dari langit langsung ke laptopmu. Dia datang lewat kabel dari penyedia internet (<b>ISP</b>), lalu beberapa kotak mengopernya, masing masing dengan tugasnya sendiri.',
		'Yang pertama <b>modem</b>. Dia duduk di tempat kabel dari penyedia masuk ke gedung, dan menerjemahkan sinyal di kabel itu supaya bisa dipahami perangkat lain. Kalau kabelnya fiber, kotak ini namanya <b>ONT</b> (Optical Network Terminal).',
		'Berikutnya <b>router</b>, si penunjuk jalan. Dia membagikan alamat ke setiap perangkat dan memutuskan mana yang keluar ke internet dan mana yang tetap di dalam. Di belakangnya ada <b>switch</b>, kotak penuh lubang port tempat semua kabel di kantor dicolokkan.',
		'Terakhir, <b>access point</b> mengubah jaringan berkabel jadi gelombang radio, jadi HP dan laptop bisa ikut tersambung tanpa kabel. Radio itulah WiFi yang kamu kenal.',
		'[fyi] Di rumah, satu kotak yang dipasang penyedia internetmu biasanya mengerjakan keempat tugas itu sekaligus, modem, router, switch, dan access point dalam satu badan. Kantor memisahkannya supaya masing masing bisa lebih besar dan diganti sendiri sendiri. Di cloud, semuanya berubah jadi pengaturan, misalnya router virtual di dalam [[VPC|networking/vpc]].',
		'Ini kantor kosong yang menunggu kotak kotaknya. Pasang tiap kotak di tempat yang benar, lalu cabut satu dan lihat siapa yang kehilangan internet.'
	],
	reactions: {
		modem:
			'Modem dipasang paling depan, tepat di tempat kabel dari penyedia masuk. Tanpa dia, kabel itu cuma sinyal yang nggak bisa dibaca siapa pun di dalam.',
		router:
			'Router duduk di belakang modem. Dia memberi setiap perangkat [[alamat IP|network/ip-address]] dan memutuskan paket mana yang pergi ke internet dan mana yang tetap di rumah.',
		switch:
			'Switch itu colokan terminalnya jaringan. Semua kabel di kantor dicolokkan ke sini, dan dia mengantar data langsung ke perangkat yang tepat.',
		ap: 'Access point disambungkan ke switch dan berbicara lewat radio, jadi HP bisa tersambung tanpa kabel. Cara kerja radionya ada di [[Apa itu WiFi|network/wifi]].',
		wrong:
			'Kotak itu bukan di situ tempatnya. Ikuti jalurnya dari internet ke dalam, pertama yang membaca kabel dari penyedia, lalu si penunjuk jalan, lalu yang punya banyak port.',
		built:
			'Kantornya online. Data dari internet lewat modem, lalu router, lalu switch, dan dari sana turun lewat kabel ke PC atau terbang lewat udara dari access point ke HP. Sekarang coba cabut satu kotak.',
		noModem:
			'Tanpa modem, nggak ada yang bisa sampai ke penyedia internet. PC masih bisa saling berbagi file (LAN di dalam tetap jalan), tapi internetnya hilang buat semua orang.',
		noRouter:
			'Nggak ada router, nggak ada jalan keluar. Jalur dari penyedia masih sampai di pintu, tapi nggak ada yang membagikan alamat atau menunjukkan jalan, jadi nggak ada yang bisa online. Switch masih menyambungkan perangkat di dalam.',
		noSwitch:
			'Cabut switch, dan semua kabel di dalam nggak punya tempat colokan. PC, bahkan access point, ikut terputus, jadi seisi kantor gelap.',
		noAp: 'Cuma HP yang putus. PC yang pakai kabel bahkan nggak sadar, mereka memang nggak pernah pakai radio. Access point cuma melayani perangkat tanpa kabel.',
		fixed: 'Sudah terpasang lagi, semua online kembali. Coba cabut kotak yang lain.'
	},
	parts: {
		modem: { name: 'Modem (ONT)', job: 'membaca kabel dari penyedia' },
		router: { name: 'Router', job: 'menunjukkan jalan keluar' },
		switch: { name: 'Switch', job: 'menyambungkan kabel di dalam' },
		ap: { name: 'Access point', job: 'mengubahnya jadi WiFi' }
	},
	trayLabel: 'Kotak kotakmu',
	internetLabel: 'Internet dari ISP',
	pcLabel: 'PC {n}',
	phoneLabel: 'HP',
	status: { online: 'online', local: 'cuma di dalam', offline: 'putus' },
	pickHint: 'Pilih satu kotak dari rak di atas',
	placeHint: 'Sekarang ketuk tempat kosong buat {name}',
	builtNote: 'Semua jalan. Ketuk kotak mana saja di kantor buat mencabutnya',
	brokenNote: '{name} dicabut. Pasang lagi dari rak'
};
