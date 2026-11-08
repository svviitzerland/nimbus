import type { RegionText } from '../../types';

export const id: RegionText = {
	title: 'Apa itu Region?',
	intro: [
		'<b>Region</b> adalah kawasan geografis tempat penyedia mengoperasikan infrastruktur cloud di beberapa [[pusat data|cloud/data-center]]. Di lab ini, pengguna nimbus.com berada di Argentina. Pilih lokasi server yang cocok untuk mereka.',
		'Pilihan di peta ini adalah contoh region untuk percobaan. Kita membandingkan lokasi di benua yang sama dan yang jauh di seberang laut, bukan memetakan semua pusat data yang ada.',
		'Tapi kenapa jarak bisa ngaruh ke kecepatan? Kuncinya ada di <b>latensi</b>. Coba inget waktu main game online, kamu biasanya disuruh pilih server dulu, Asia, Amerika, atau Eropa. Makin jauh servernya, makin lama data bolak balik, dan game (atau website) jadi terasa lemot.',
		'Di lab ini, <b>latensi</b> menunjukkan perkiraan waktu bolak balik dalam milidetik. Angkanya simulasi, bukan hasil ping langsung. Di jaringan nyata, rute dan kepadatan lalu lintas juga berpengaruh.',
		'Pilih penyedia di atas dulu, lalu taruh server kamu di beberapa kotanya dan bandingkan <b>latensinya</b>. Makin dekat ke Argentina, harusnya makin kecil angkanya.',
		'[ingat] Region adalah kawasan geografis. Dekat ke pengguna sering memperpendek perjalanan data.'
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
