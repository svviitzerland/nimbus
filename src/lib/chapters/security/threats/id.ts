import type { ThreatsText } from './types';

export const id: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'Maling yang pintar nggak pernah melawan gembok besar di pintu depan. Dia ngecek jendela, pintu pagar belakang, dan kunci cadangan di bawah pot bunga.',
		'Penyerang juga mikir begitu. <b>Threat modeling</b> artinya keliling sistem milikmu sendiri pakai kacamata penyerang, sebelum penyerang beneran datang, lalu menambal pintu yang paling lemah duluan.',
		'Intinya empat pertanyaan sederhana. Kita bikin apa? Apa yang bisa salah? Kita mau ngapain soal itu? Udah cukup bagus belum? Penulis keamanan Adam Shostack yang bikin empat pertanyaan ini terkenal.',
		'Buat nimbus.com, rumahnya begini. Pintu depan itu halaman login. Jendela itu software server lama yang nggak pernah diupdate. Pagar belakang itu login yang dikasih ke perusahaan rekanan. Kunci di bawah pot itu backup, salinan lengkap semua data.',
		'Cerita nyata. Tahun 2013 jaringan toko Amerika bernama Target kehilangan sekitar 40 juta nomor kartu. Penyerangnya nggak mulai dari pintu depan. Mereka masuk duluan pakai login perusahaan kecil jasa AC dan pemanas yang bekerja untuk Target.',
		'Dari pagar belakang itu mereka menyusup lewat jaringan Target sampai ke mesin kasir di toko toko, lalu diam diam menyalin kartu tiap kali pelanggan bayar. Gembok pintu depannya bahkan nggak disentuh sama sekali.',
		'[ingat] <b>Rumah cuma seaman pintu terlemahnya.</b> Mikir kayak maling, ngunci kayak pemilik.',
		'[fyi] Tahun 1999 dua insinyur Microsoft, Loren Kohnfelder dan Praerit Garg, menulis daftar cek bernama <b>STRIDE</b>, enam jenis ancaman yang perlu dicari (menyamar jadi orang lain, mengubah data, menyangkal perbuatan, membocorkan, memblokir, dan merebut kuasa lebih). Tim di seluruh dunia masih memakainya.',
		'Mau keliling sendiri? Pencet bagian mana pun dari rumahnya buat lihat apa yang bisa salah di situ dan gimana nimbus.com menguncinya.'
	],
	reactions: {
		door: 'Pintu depan, halaman login. Semua orang menyerangnya duluan, jadi biasanya kuncinya paling bagus. Tapi bot yang nebak password seharian tetap bisa nemu yang lemah.',
		window:
			'Jendela, software lama. Celah di versi lama itu rahasia umum, dan bot memindai seluruh internet buat nyarinya tiap hari. Update itu gembok paling murah.',
		gate: 'Pagar belakang, persis cara Target jebol. Siapa pun yang bisa login ke sistemmu itu bagian dari keamananmu, termasuk tukang AC.',
		pot: 'Kunci di bawah pot. Banyak yang lupa sama backup, padahal backup itu salinan lengkap data, jadi mencurinya sama aja dengan mencuri yang asli.'
	},
	steps: [
		{
			tag: 'Si maling',
			title: 'Dia lewatin gembok besar',
			body: 'Penyerang datang ke bagian yang pertahanannya <b>paling lemah</b>, bukan yang paling kuat.'
		},
		{
			tag: 'Idenya',
			title: 'Threat modeling',
			body: 'Lihat sistem milikmu sendiri <b>pakai kacamata penyerang</b>, sengaja, sebelum orang lain melakukannya.'
		},
		{
			tag: 'Caranya',
			title: 'Empat pertanyaan',
			body: 'Kita bikin apa? Apa yang bisa salah? Kita mau ngapain? Udah cukup bagus belum?'
		},
		{
			tag: 'nimbus.com',
			title: 'Rumahnya itu sistemnya',
			body: 'Pintu itu <b>login</b>, jendela itu <b>software lama</b>, pagar itu <b>login rekanan</b>, kuncinya itu <b>backup</b>.'
		},
		{
			tag: 'Target, 2013',
			title: 'Masuk lewat pagar belakang',
			body: 'Penyerangnya pakai login <b>perusahaan jasa AC</b> kecil yang bekerja untuk Target.'
		},
		{
			tag: 'Target, 2013',
			title: 'Sampai ke kasir',
			body: 'Begitu di dalam, mereka sampai ke <b>mesin kasir</b> dan menyalin sekitar 40 juta kartu.'
		},
		{
			tag: 'Biar nempel',
			title: 'Pintu terlemah',
			body: 'Keamananmu cuma sebagus bagian yang <b>paling lemah</b>. Temukan duluan sebelum mereka.'
		},
		{
			tag: 'Info',
			title: 'STRIDE',
			body: 'Enam jenis ancaman buat dicek, satu per huruf. Berguna kalau empat pertanyaan tadi terasa terlalu luas.'
		},
		{
			tag: 'Opsional',
			title: 'Keliling',
			body: 'Pencet satu bagian rumah. Tiap bagian punya ancaman dan tambalannya.'
		}
	],
	spots: {
		door: {
			name: 'Pintu depan',
			place: 'halaman login',
			threat: 'Bot nebak ribuan password per menit.',
			fix: 'Batasi percobaan dan tambah langkah login kedua.'
		},
		window: {
			name: 'Jendela',
			place: 'software lama',
			threat: 'Celah terkenal di software yang nggak pernah diupdate.',
			fix: 'Rajin update dan matikan yang nggak dipakai.'
		},
		gate: {
			name: 'Pagar belakang',
			place: 'login rekanan',
			threat: 'Rekanan yang keamanannya lebih lemah tetap punya login.',
			fix: 'Kasih rekanan akun kecil terpisah dan awasi.'
		},
		pot: {
			name: 'Kunci di bawah pot',
			place: 'backup',
			threat: 'Salinan lengkap data, tapi dijaga lebih santai.',
			fix: 'Enkripsi backup dan simpan di tempat terkunci.'
		}
	},
	news: {
		tag: 'Target, 2013',
		head: 'Sekitar 40 juta nomor kartu dicuri, berawal dari login rekanan'
	},
	registerLabel: 'mesin kasir',
	cardsLabel: '40 juta kartu',
	threatLabel: 'Apa yang bisa salah',
	fixLabel: 'Tambalannya',
	tapHint: 'Pencet satu bagian rumah'
};
