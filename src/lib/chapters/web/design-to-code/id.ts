import type { DesignToCodeText } from './types';

export const id: DesignToCodeText = {
	title: 'Desain ke kode',
	intro: [
		'Sebelum sebuah halaman dibangun, biasanya ada yang menggambarnya dulu. Seorang <b>desainer</b> merancang tiap layar di aplikasi desain, dan yang paling populer sekarang namanya <b>Figma</b>, jalannya langsung di browser.',
		'Desain itu bukan sekadar gambar cantik. Tiap bentuk di dalamnya punya angka pasti, warna dalam bentuk kode kayak <b>#2E6FE0</b>, seberapa bulat sudutnya dalam piksel, ruang di dalam tombol, dan ukuran tulisannya.',
		'Developer membuka desainnya, ngetap satu elemen, lalu membaca angka angka itu di panel <b>inspect</b>. Terus angka yang sama ditulis ke [[CSS|web/css]], bahasa yang mendandani kerangka [[HTML|web/html]].',
		'[fyi] Tim biasanya kasih nama ke nilai yang sering dipakai, kayak "biru brand" atau "jarak 16", lalu disimpan di satu daftar bersama yang namanya <b>design system</b>. Jadi desain dan kode selalu pakai bahasa yang sama.',
		'[ingat] Jangan kira kira, baca angkanya. Warna, sudut, padding, ukuran huruf, empat angka jadi satu tombol.',
		'Ini tombol "Mulai sekarang" nimbus.com versi gambar desainer, dan versi kodenya punyamu yang masih agak meleset. Inspect desainnya, lalu atur CSS kamu sampai keduanya sama persis.'
	],
	reactions: {
		inspect:
			'Nah, itu angka aslinya. Desainer mengukur pakai piksel (titik kecil di layar) dan menulis warna pakai kode hex. Sekarang salin ke CSS kamu.',
		color:
			'Warnanya pas. Di CSS itu namanya <b>background</b>. Kode hex kayak #2E6FE0 itu campuran merah, hijau, dan biru, dua karakter buat masing masing.',
		radius:
			'Sudutnya pas. <b>border-radius</b> bikin sudut jadi bulat, 0 itu kotak tajam dan makin besar angkanya makin lembut.',
		padding: 'Jaraknya pas. <b>padding</b> itu ruang napas antara tulisan dan pinggir tombol.',
		font: 'Ukuran hurufnya pas. <b>font-size</b> mengatur seberapa besar hurufnya, dan itu ngaruh banget ke seberapa penting sesuatu terasa.',
		done: 'Sama persis! Tombolmu sekarang identik dengan desainnya. Inilah pekerjaan sehari hari developer frontend, mengubah desain jadi kode beneran yang bisa digambar browser.'
	},
	designLabel: 'Desain (Figma)',
	pageLabel: 'Halamanmu',
	button: 'Mulai sekarang',
	inspect: 'Inspect desainnya',
	specLabel: 'Inspect',
	props: {
		color: 'Warna isi',
		radius: 'Radius sudut',
		padding: 'Padding samping',
		font: 'Ukuran huruf'
	},
	inspectHint: 'Pencet inspect buat lihat angkanya',
	codeLabel: 'style.css',
	matched: 'Halamanmu sudah sama dengan desainnya',
	score: '{n} dari {total} cocok'
};
