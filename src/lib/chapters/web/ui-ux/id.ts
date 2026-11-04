import type { UiUxText } from './types';

export const id: UiUxText = {
	title: 'UI dan UX',
	intro: [
		'Coba ingat aplikasi favoritmu. Sebagian alasan kamu suka adalah <b>tampilannya</b>, dan sebagian lagi karena <b>gampang</b> dipakai. Dua hal itu pekerjaan yang beda, dan masing masing punya nama sendiri.',
		'<b>UI</b> singkatan dari user interface (antarmuka pengguna). Isinya semua yang kamu lihat dan sentuh di layar, warna, huruf, tombol, dan jarak antar elemen.',
		'<b>UX</b> singkatan dari user experience (pengalaman pengguna). Ini soal gimana rasanya waktu benar benar dipakai. Lihat orang beli mug. Cari tombolnya, tap, beres, nggak perlu mikir. Rasa lancar itu namanya UX yang bagus.',
		'Sekarang toko yang sama, tapi dibuat asal asalan. Dua tombol yang kembar, tulisan yang nggak jelas (Proceed ke mana?), dan biaya tambahan yang baru muncul di akhir. Tampilannya oke, tapi memakainya nyebelin.',
		'Ini versi yang dibuat dengan peduli. Satu tombol utama yang bilang persis apa yang terjadi, dan harga lengkap kelihatan dari awal. Warnanya sama, hurufnya sama, tapi rasanya beda jauh.',
		'[fyi] UX bukan cuma soal layar. Pernah narik pintu yang ternyata harus didorong? Orang menyebutnya pintu Norman, dari nama Don Norman, desainer yang mempopulerkan istilah user experience di tahun 1990an.',
		'[ingat] UI itu bajunya, UX itu nyamannya dipakai. Baju bisa keren tapi gatal seharian. Produk yang bagus butuh dua duanya, dan habis ini kamu bakal lihat gimana desain berubah jadi [[CSS|web/css]] beneran di [[desain ke kode|web/design-to-code]].',
		'Kalau mau, giliran kamu. Bolak balik antara toko yang asal asalan dan yang rapi, lalu cari apa saja yang berubah.'
	],
	reactions: {
		messy:
			'Tampilannya sama, tapi coba perhatikan. Tombol mana yang buat beli? Terus biaya tambahan itu datang dari mana? Kebingungan kayak gini masalah UX, bukan UI.',
		clear:
			'Balik ke toko yang rapi. Satu tombol, satu harga yang jujur, nggak ada yang perlu ditebak. Jempolmu langsung tahu harus ke mana.'
	},
	steps: [
		{
			title: 'Dua pekerjaan',
			body: 'Tiap aplikasi punya <b>tampilan</b> dan <b>rasa</b>. Dua hal ini dibentuk oleh keputusan yang beda, jadi namanya juga beda.'
		},
		{
			title: 'UI, tampilannya',
			body: '<b>User interface</b> artinya yang kamu lihat dan sentuh. Warna, huruf, tombol, dan jarak semuanya termasuk UI.'
		},
		{
			title: 'UX, rasanya',
			body: '<b>User experience</b> artinya rasanya waktu dipakai. Gampang ketemu nggak, hasilnya sesuai harapan nggak, selesai tanpa cemberut nggak?'
		},
		{
			title: 'UX yang asal',
			body: 'Tombol kembar, kata yang nggak jelas, dan <b>biaya kejutan</b> bikin orang ragu, salah tap, atau malah batal beli.'
		},
		{
			title: 'UX yang peduli',
			body: 'Satu <b>aksi utama yang jelas</b>, kata yang bilang apa yang terjadi, dan tanpa kejutan. Orang selesai cepat dan senang.'
		},
		{
			title: 'Bukan cuma layar',
			tag: 'Info',
			body: 'Pintu yang gagangnya ngajak narik padahal tulisannya dorong itu juga UX yang buruk. Desain yang baik memberi tahu caranya tanpa perlu tulisan.'
		},
		{
			title: 'Baju dan nyamannya',
			tag: 'Biar nempel',
			body: 'UI itu <b>bajunya</b>, UX itu <b>nyamannya</b> dipakai. Dua duanya perlu.'
		}
	],
	site: 'nimbus.com',
	product: 'Mug Nim',
	price: '$12',
	buy: 'Beli sekarang',
	paid: 'Mug lagi dikirim',
	uiColor: 'Warna',
	uiFont: 'Huruf',
	uiButton: 'Tombol',
	messy: {
		cancel: 'Cancel',
		next: 'Proceed',
		fee: '+ $4 biaya layanan',
		total: 'Total $16',
		flags: ['Yang mana buat beli?', 'Proceed ke mana?', 'Biaya kejutan']
	},
	clear: {
		pay: 'Bayar $12',
		free: 'Gratis ongkir',
		total: 'Total $12',
		flags: ['Satu aksi utama', 'Jelas artinya', 'Harga dari awal']
	},
	door: { sign: 'DORONG', caption: 'Gagangnya bilang tarik, tulisannya bilang dorong' },
	lookTag: 'UI, tampilannya',
	feelTag: 'UX, rasanya',
	showMessy: 'Lihat toko yang asal',
	showClear: 'Lihat toko yang rapi'
};
