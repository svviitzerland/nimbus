import type { RegionText } from '../../types';

export const id: RegionText = {
	title: 'Apa itu Region?',
	intro: [
		'Anggap penggunamu paling banyak ada di <b>Argentina</b>. Server cloud kamu harus ditaruh di salah satu lokasi data center milik penyedia, dan lokasi seperti itu namanya <b>region</b>. Tiap penyedia cloud besar punya daftar regionnya sendiri.',
		'Masalahnya, Argentina belum punya data center sendiri. Tapi tetap ada satu di benua yang sama, dan pilihan lokasi inilah yang menentukan secepat apa website terasa di sisi pengguna.',
		'Tapi kenapa jarak bisa ngaruh ke kecepatan? Kuncinya ada di <b>latensi</b>. Coba inget waktu main game online, kamu biasanya disuruh pilih server dulu, Asia, Amerika, atau Eropa. Makin jauh servernya, makin lama data bolak balik, dan game (atau website) jadi terasa lemot.',
		'Nah, waktu bolak balik data antara penggunamu dan server itulah yang disebut <b>latensi</b>. Satuannya milidetik (ms), dan makin kecil angkanya makin cepat.',
		'Pilih penyedia di atas dulu, lalu taruh server kamu di beberapa kotanya dan bandingkan <b>latensinya</b>. Makin dekat ke Argentina, harusnya makin kecil angkanya.'
	],
	reactions: {
		near: 'Nah, region ini memang bukan di Argentina, tapi masih <b>satu benua</b>, jadi latensinya paling kecil di antara pilihan.',
		mid: 'Lumayan jauh, latensinya naik. Masih ada region yang lebih dekat ke penggunamu.',
		far: 'Jauh banget. Datanya harus menyeberang <b>separuh dunia</b>, jadi lemot. Itulah kenapa memilih region terdekat itu penting.'
	},
	users: 'Penggunamu',
	readoutPrompt: 'Pilih sebuah kota untuk mengukur kecepatannya',
	pickProvider: 'Pilih penyedia cloud untuk lihat regionnya',
	drag: 'Tarik untuk memutar bumi',
	flatLabel: 'Peta',
	globeLabel: 'Globe',
	ms: 'ms',
	verdicts: {
		instant: 'Instan',
		fast: 'Cepat',
		ok: 'Lumayan',
		slow: 'Agak lambat',
		laggy: 'Lemot'
	},
	compare: {
		near: 'Dekat',
		far: 'Jauh',
		hint: 'Tes satu kota dekat dan satu kota jauh biar kerasa bedanya'
	}
};
