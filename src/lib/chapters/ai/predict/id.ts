import type { PredictText } from './types';

export const id: PredictText = {
	title: 'Regresi dan klasifikasi',
	intro: [
		'Di pelajaran sebelumnya, model menyortir buah ke keranjang. Itu baru salah satu dari dua tugas besar model machine learning. Yuk kenalan dengan keduanya, mulai dari rumah. Ini beberapa rumah yang sudah laku, ditaruh sesuai luas dan harganya.',
		'Tugas pertama itu <b>regresi</b> (regression), menebak sebuah <b>angka</b>. Lihat garisnya miring ke sana ke mari sampai lewat sedekat mungkin dengan semua rumah. Celah kecil antara rumah dan garis makin pendek waktu garisnya tenang. Garis itulah modelnya.',
		'Sekarang ada rumah baru yang mau dijual. Naik dari luasnya ke garis, lalu ke samping sampai skala harga, dan itulah prediksinya. Jawabannya bisa angka berapa saja di sepanjang skala.',
		'Tugas kedua itu <b>klasifikasi</b> (classification), memilih sebuah <b>kelompok</b> (disebut juga kelas). Email ini spam atau bukan? Model membagi gambarnya jadi dua zona, dan tiap email baru tinggal jatuh di salah satunya.',
		'[ingat] Dengar bunyi pertanyaannya. "Berapa" berarti regresi. "Yang mana" berarti klasifikasi. Harga rumah itu berapa, spam atau bukan itu yang mana.',
		'[fyi] Kata sama, dunia beda. Programmer juga bilang <i>regresi</i> kalau bug lama muncul lagi setelah update. Itu nggak ada hubungannya dengan yang ini, cuma kebetulan namanya sama.',
		'Kalau mau, geser luas rumahnya dan lihat harganya ikut garis. Ini opsional kok.'
	],
	reactions: {
		ask: 'Kelihatan kan? Luas berapa pun langsung dapat harga dari garisnya, sebuah angka dan bukan kelompok. Dua model di pelajaran ini belajar dari contoh yang sudah ada jawabannya, dan itu namanya [[supervised learning|ai/supervised]].'
	},
	panels: [
		{
			tag: 'Contoh',
			title: 'Rumah yang sudah laku',
			body: 'Tiap titik satu rumah. Kiri ke kanan itu luasnya, bawah ke atas itu harga jualnya. Rumah yang lebih luas biasanya lebih mahal.'
		},
		{
			tag: 'Regresi',
			title: 'Garis yang pas',
			body: 'Model mencari garis lurus dengan celah paling kecil ke semua rumah. Garis itu adalah semua yang dia pelajari.'
		},
		{
			tag: 'Prediksi',
			title: 'Membaca garisnya',
			body: 'Untuk luas yang baru, naik ke garis lalu ke samping. Jawabannya sebuah <b>angka</b>, dan bisa jatuh di mana saja pada skala.'
		},
		{
			tag: 'Klasifikasi',
			title: 'Dua zona',
			body: 'Tiap email ditaruh sesuai jumlah link dan tanda serunya. Model menggambar garis batas, dan sisi tempatnya jatuh menentukan <b>kelompok</b>nya.'
		},
		{
			tag: 'Biar nempel',
			title: 'Berapa atau yang mana',
			body: 'Berapa itu regresi, yang mana itu klasifikasi.'
		},
		{
			tag: 'Omong omong',
			title: 'Regresi yang satunya',
			body: 'Dalam pengujian software, <b>regresi</b> artinya bug lama yang muncul lagi. Katanya sama, artinya beda total.'
		},
		{
			tag: 'Coba',
			title: 'Geser luasnya',
			body: 'Gerakkan slider, rumah barunya ikut bergeser. Harganya dibaca langsung dari garis.'
		}
	],
	regX: 'luas',
	regY: 'harga',
	clsX: 'jumlah link',
	clsY: 'tanda seru',
	price: 'Rp{p} juta',
	size: '{n} m²',
	spam: 'spam',
	ham: 'bukan spam',
	answerNumber: 'jawabannya angka',
	answerGroup: 'jawabannya kelompok',
	rule: 'Berapa itu regresi, yang mana itu klasifikasi.',
	slider: 'Luas rumah'
};
