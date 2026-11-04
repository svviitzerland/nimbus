import type { HtmlText } from './types';

export const id: HtmlText = {
	title: 'Apa itu HTML',
	intro: [
		'Waktu kamu buka <b>nimbus.com</b>, server ngirim sebuah file namanya <b>index.html</b> ke browser kamu. Dan ini kejutannya, file itu cuma <b>teks biasa</b>. Huruf dan kata, sama kayak yang kamu ketik di chat.',
		'Teks biasa itu nggak punya bentuk. Browser nggak tahu baris mana yang judul besar, mana yang kalimat, atau di mana tombolnya. Jadi semuanya dia gabung jadi satu baris panjang. Lihat pratinjaunya.',
		'Di sinilah <b>HTML</b> masuk. Dia membungkus tiap potongan teks pakai label kecil yang namanya <b>tag</b>, jadi tiap potongan tahu dirinya itu apa. Lihat baris pertama dibungkus pakai <b>&lt;h1&gt;</b>, tag buat judul besar.',
		'Tag itu dibuka lalu ditutup, kayak sepasang kurung. <b>&lt;h1&gt;</b> membuka judul dan <b>&lt;/h1&gt;</b> menutupnya (perhatikan garis miringnya). Apa pun yang ada di antara keduanya jadi judul.',
		'Baris berikutnya, <b>&lt;p&gt;</b>, singkatan dari paragraph. Tag ini bilang ke browser bahwa isinya blok teks biasa, jadi dapat barisnya sendiri dengan sedikit jarak di sekitarnya.',
		'Lalu <b>&lt;button&gt;</b>. Satu tag dan browser langsung menggambar tombol beneran. Dipencet belum ngapa ngapain, soalnya HTML cuma bikin bentuknya.',
		'Lalu gambar pakai <b>&lt;img&gt;</b>. Dia nunjuk file gambarnya lewat <b>src</b> dan menjelaskannya lewat <b>alt</b>, buat yang nggak bisa melihat. Nggak ada teks di dalamnya, jadi nggak perlu tag penutup.',
		'Sekarang tag yang bikin web jadi web, <b>&lt;a&gt;</b>, alias link. Isi <b>href</b> adalah alamat tujuannya, di sini <b>/about</b>. Pencet, dan browser minta halaman itu ke server. Miliaran halaman saling bergandengan tangan begini.',
		'Terakhir, <b>&lt;form&gt;</b>, wadah buat hal yang kamu ketik. Di dalamnya ada <b>&lt;input&gt;</b>, kolom buat email kamu, dan sebuah tombol. Pencet tombolnya, dan browser membungkus ketikanmu lalu mengirimnya ke server sebagai <b>POST</b>, di sini ke <b>/join</b>.',
		'[ingat] <b>HTML itu kerangka, CSS itu baju, JavaScript itu otot.</b> Kerangka cuma bilang tiap bagian itu apa. Mendandaninya tugas [[CSS|web/css]], bikin dia bergerak tugas [[JavaScript|web/js]].',
		'Sekarang editornya punyamu, kalau mau. Ubah satu baris, misalnya kata kata di judulnya, dan lihat halamannya ikut berubah. Atau biarin aja, ini udah halaman web beneran kok.'
	],
	reactions: {
		edited:
			'Lihat kan? Kamu ngubah teksnya dan halamannya langsung ngikut. Di balik layar, semua website yang kamu kunjungi itu teks kayak gini.',
		unclosed:
			'Hmm, ada tag yang kehilangan pasangannya. Tiap tag pembuka kayak <b>&lt;p&gt;</b> butuh penutupnya, <b>&lt;/p&gt;</b>, kalau nggak browser harus nebak di mana dia berakhir.'
	},
	steps: [
		{
			tag: 'Filenya',
			title: 'Teks biasa',
			body: '<b>index.html</b> cuma kumpulan karakter. Nggak ada ukuran, tombol, atau gambar, cuma kata kata.'
		},
		{
			tag: 'Masalahnya',
			title: 'Nggak berbentuk',
			body: 'Browser nggak peduli pindah baris di teks biasa, jadi semua baris numpuk jadi satu.'
		},
		{
			tag: 'Solusinya',
			title: 'Tag',
			body: 'Tag itu nama di dalam kurung siku, kayak <b>&lt;h1&gt;</b>. <b>h1</b> artinya judul nomor satu, yang paling besar.'
		},
		{
			tag: 'Sepasang',
			title: 'Buka dan tutup',
			body: '<b>&lt;h1&gt;</b> memulai, <b>&lt;/h1&gt;</b> mengakhiri. Garis miring artinya tutup.'
		},
		{
			tag: 'Tag 2',
			title: '&lt;p&gt;',
			body: 'Paragraf. Teks biasa di barisnya sendiri.'
		},
		{
			tag: 'Tag 3',
			title: '&lt;button&gt;',
			body: 'Tombol yang bisa dipencet. HTML ngasih bentuknya, bukan tugasnya.'
		},
		{
			tag: 'Tag 4',
			title: '&lt;img&gt;',
			body: 'Gambar. <b>src</b> bilang file yang mana, <b>alt</b> bilang isinya apa. Nggak perlu tag penutup.'
		},
		{
			tag: 'Tag 5',
			title: '&lt;a href&gt;',
			body: 'Link. <b>href</b> bilang ke mana tujuannya. Halaman yang saling tersambung ke halaman lain di seluruh dunia, makanya disebut <b>web</b> (jaring).'
		},
		{
			tag: 'Tag 6',
			title: '&lt;form&gt;',
			body: '<b>&lt;input&gt;</b> itu kolom buat mengetik. Tombol di dalam form mengirim ketikanmu ke server sebagai request <b>POST</b>.'
		},
		{
			tag: 'Biar nempel',
			title: 'Kerangka, baju, otot',
			body: '<b>HTML</b> kerangkanya, <b>CSS</b> bajunya, <b>JavaScript</b> ototnya.'
		},
		{
			tag: 'Opsional',
			title: 'Ubah satu baris',
			body: 'Pencet editornya dan ubah kata apa aja. Pratinjaunya ikut berubah selagi kamu ngetik.'
		}
	],
	editorLabel: 'index.html',
	previewLabel: 'nimbus.com',
	lines: {
		heading: 'Selamat datang di Nimbus',
		paragraph: 'Website pertamamu di cloud.',
		button: 'Mulai sekarang',
		alt: 'Nim si awan',
		link: 'Tentang kami',
		email: 'email kamu',
		join: 'Gabung'
	},
	serverLabel: 'server nimbus.com',
	editHint: 'Boleh kamu ubah',
	unclosedHint: '{open} masih terbuka, tutup pakai {close}',
	reset: 'Ulang dari awal'
};
