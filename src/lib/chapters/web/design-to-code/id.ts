import type { DesignToCodeText } from './types';

export const id: DesignToCodeText = {
	title: 'Desain ke kode',
	intro: [
		'Sebelum sebuah halaman dibangun, biasanya ada yang menggambarnya dulu. Seorang <b>desainer</b> merancang tiap layar di aplikasi desain, dan yang paling populer sekarang namanya <b>Figma</b>, jalannya langsung di browser. Lihat, sebuah tombol muncul di kanvas.',
		'Desain itu bukan sekadar gambar cantik. Tiap bentuk punya angka pasti. Ini empat angka yang membentuk tombol ini, warnanya dalam bentuk kode kayak <b>#2E6FE0</b>, seberapa bulat sudutnya, ruang di dalamnya, dan ukuran hurufnya.',
		'Developer ngetap tombol itu di desain, lalu membaca angka angkanya di panel <b>inspect</b>. Terus angka yang persis sama diketik ke [[CSS|web/css]], bahasa yang mendandani kerangka [[HTML|web/html]].',
		'Sekarang browser membaca CSS itu dan menggambar tombolnya. Lihat dia berubah baris demi baris, awalnya kotak abu abu polos, lalu warnanya, sudut bulatnya, ruang napasnya, terakhir ukuran hurufnya.',
		'Taruh dua duanya berdampingan. Desain dan halaman aslinya sekarang kelihatan sama persis. Mengubah gambar jadi kode yang sama persis begini adalah kerjaan sehari hari seorang frontend developer.',
		'[fyi] Tim biasanya kasih nama ke nilai yang sering dipakai, kayak biru brand atau jarak 24, lalu disimpan di satu daftar bersama yang namanya <b>design system</b>. Jadi desainer dan developer pakai kata yang sama, dan nggak ada yang melenceng.',
		'[ingat] Kerja kayak penjahit, bukan pelukis. Penjahit nggak nebak ukuran, dia baca meterannya. Warna, sudut, padding, ukuran huruf, empat angka jadi satu tombol.',
		'Kalau mau, giliran kamu. Hapus baris padding dan lihat seberapa cepat tombolnya jadi nggak mirip desain lagi.'
	],
	reactions: {
		nopad:
			'Tanpa padding hurufnya nempel ke pinggir dan tombolnya menciut jadi kotak sempit. Satu angka hilang, dan langsung nggak sama dengan desainnya.',
		pad: 'Padding balik lagi, tombolnya bisa napas. Desain dan halamannya sama lagi.'
	},
	steps: [
		{
			title: 'Desainnya',
			body: 'Seorang <b>desainer</b> menggambar layarnya dulu, sering pakai <b>Figma</b>. Belum ada kode, ini rencana yang bisa dilihat semua orang.'
		},
		{
			title: 'Angka pasti',
			body: 'Tiap bentuk punya ukuran. Ukuran pakai <b>piksel</b> (titik kecil di layar), dan warna ditulis sebagai <b>kode hex</b>.'
		},
		{
			title: 'Inspect, lalu ketik',
			body: 'Developer membaca tiap angka di <b>inspect</b> lalu menulisnya ke file CSS. Satu angka jadi satu baris.'
		},
		{
			title: 'Browser menggambar',
			body: '<b>background</b> mengatur warna, <b>border-radius</b> membulatkan sudut, <b>padding</b> menambah ruang di dalam, dan <b>font-size</b> mengatur besar huruf.'
		},
		{
			title: 'Sudah sama',
			body: 'Kalau semua angka disalin, halamannya kelihatan <b>persis</b> seperti desain. Desainer menyebutnya pixel perfect.'
		},
		{
			title: 'Design system',
			tag: 'Info',
			body: 'Nama bersama untuk nilai bersama, kayak <b>biru brand</b>. Ubah sekali di daftarnya, desain dan kode ikut berubah.'
		},
		{
			title: 'Penjahit, bukan pelukis',
			tag: 'Biar nempel',
			body: 'Jangan kira kira, <b>baca angkanya</b>. Warna, sudut, padding, ukuran huruf.'
		}
	],
	designLabel: 'Desain (Figma)',
	pageLabel: 'nimbus.com',
	button: 'Ayo mulai',
	specLabel: 'Inspect',
	props: { color: 'Warna', radius: 'Sudut', padding: 'Padding samping', font: 'Ukuran huruf' },
	tokens: { color: 'biru brand', radius: 'bulat', padding: 'jarak 24', font: 'teks 16' },
	codeLabel: 'style.css',
	matched: 'Sama dengan desain',
	mismatch: 'Belum sama',
	skipPadding: 'Hapus padding',
	restorePadding: 'Kembalikan padding'
};
