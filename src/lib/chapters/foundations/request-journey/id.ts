import type { RequestJourneyText } from '../../types';

export const id: RequestJourneyText = {
	title: 'Dari HP sampai ke server',
	intro: [
		'Tadi kamu lihat client minta dan server menjawab. Tapi di antara HP-mu dan server itu ada perjalanan yang panjang banget, dan semuanya kelar dalam sekejap mata.',
		'Begitu kamu menekan buka, permintaanmu keluar dari HP lewat WiFi ke <b>router</b> di rumahmu. Router itu gerbang rumah, semua perangkat di rumahmu keluar masuk internet lewat dia.',
		'Kalau memakai data seluler, HP mengirim lewat radio ke <b>BTS</b>. Kalau memakai WiFi, radio menghubungkannya ke access point di rumah. Setelah itu, perjalanan berlanjut melalui jaringan kabel atau sambungan lain. Radio menyambung bagian yang tidak bisa ikut ditarik kabel.',
		'Dan gelombangnya cuma sampai situ. Router maupun tiang BTS dua duanya disambung kabel serat optik, terus permintaanmu diteruskan ke <b>ISP</b> (Internet Service Provider), penyedia internet langgananmu, lewat kabel di pinggir jalan, antar kota, bahkan nanti dasar laut.',
		'Sampai di tujuannya, server membaca permintaanmu dan mengirim jawaban, lewat jalan yang sama, balik sampai jadi halaman di layar HP-mu. Bolak balik ini biasanya cuma puluhan milidetik.',
		'Sekarang lihat sendiri perjalanannya. Kamu bakal ikut dari matamu sendiri, dan aku bakal jelasin tiap kali kita berhenti. Coba juga tombol WiFi dan data seluler biar kelihatan lompatan pertamanya doang yang beda.',
		'[ingat] Request membawa permintaan dari client. Response membawa balasan dari server.'
	],
	/** Satu baris untuk tiap perhentian animasinya. */
	reactions: {
		atPhone:
			'Ini permintaanmu, baru lahir di HP. Isinya sederhana, tolong kirimkan halaman nimbus.com.',
		atHopWifi:
			'Lompatan pertamanya gelombang WiFi, cuma beberapa meter sampai router di ruanganmu. Habis ini semuanya kabel.',
		atHopCell:
			'Lompatan pertamanya gelombang seluler, beberapa kilometer sampai tiang BTS. Sampai di tiang, datamu turun ke kabel juga.',
		inCable:
			'Sekarang kamu ada di dalam kabelnya, di bawah trotoar yang tadi kamu pijak. Isinya kaca setipis rambut, dan permintaanmu lewat situ sebagai kilatan cahaya.',
		underSea:
			'Dan kabelnya nggak berhenti di darat. Yang kamu lewati sekarang kabel di dasar laut, terhampar ribuan kilometer, dan hampir semua trafik antar benua lewat kabel seperti ini.',
		atServer:
			'Ini servernya, satu dari sekian mesin di ruangan ini. Dia yang membaca permintaanmu dan menyiapkan halamannya.',
		back: 'Jawabannya pulang lewat jalan yang sama sampai jadi halaman di layarmu. Bolak balik sejauh itu biasanya cuma puluhan milidetik.'
	},
	watch: 'Lihat perjalanannya',
	again: 'Putar lagi',
	screen: {
		site: 'nimbus.com',
		button: 'Buka',
		sending: 'Mengirim',
		page: {
			title: 'Belajar cloud dari nol',
			body: 'Main dulu, paham belakangan. Nim yang nemenin kamu tiap babnya.',
			cta: 'Mulai belajar',
			cardA: 'Bab 1, Client & Server',
			cardB: 'Bab 2, Cloud'
		}
	},
	modes: { wifi: 'WiFi rumah', cell: 'Data seluler' },
	stations: {
		phone: 'HP kamu',
		router: 'Router WiFi',
		tower: 'Tiang BTS',
		isp: 'ISP',
		net: 'Jaringan dunia',
		server: 'Server'
	}
};
