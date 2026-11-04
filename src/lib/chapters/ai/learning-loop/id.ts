import type { LearningLoopText } from './types';

export const id: LearningLoopText = {
	title: 'Gradient descent',
	intro: [
		'<b>Model</b> AI itu mesin penebak yang di dalamnya ada banyak kenop kecil (namanya <b>bobot</b> atau weight, sama kayak di [[neural network|ai/neural-net]]). Awalnya kenopnya diputar asal, jadi tebakannya sering salah.',
		'Kita ambil satu kenop aja. Tiap posisi kenop bikin modelnya salah sekian banyak. Kalau semuanya digambar, jadinya sebuah bukit. Makin tinggi berarti makin salah, dan dasar lembahnya adalah posisi terbaik.',
		'Masalahnya, model nggak bisa melihat bukitnya. Rasanya kayak berdiri di tengah kabut tebal. Yang bisa dia rasakan cuma tanah tepat di bawahnya dan ke arah mana miringnya. Kemiringan itu disebut <b>gradient</b>, istilah keren buat lereng.',
		'Jadi dia melakukan hal paling sederhana. Rasakan lerengnya, melangkah sedikit ke bawah, rasakan lagi, melangkah lagi. Putaran ini namanya <b>gradient descent</b> (descent artinya turun), dan hampir semua AI modern belajar dengan cara ini.',
		'[ingat] Gradient descent itu kayak turun bukit pas kabut tebal. Lembahnya nggak kelihatan, jadi kakimu yang meraba. Miring ke mana, ke situ melangkah. Raba, langkah, ulangi.',
		'Panjang tiap langkah juga punya nama, <b>learning rate</b>. Lihat langkah mini dulu. Aman sih, tapi bolanya merayap pelan banget, dan latihannya bisa makan waktu selamanya.',
		'Sekarang lompatan raksasa. Tiap lompatan kelewatan lembahnya dan mendarat makin tinggi di sisi seberang, sampai bolanya terlempar keluar dari bukit. Orang bilang modelnya <b>diverged</b> (meledak), dan latihannya gagal.',
		'Langkah yang pas ada di tengah tengah. Bolanya turun dengan cepat lalu diam di dasar. Memilih ukuran langkah ini salah satu hal pertama yang diatur engineer sebelum melatih model.',
		'[fyi] Model sungguhan punya jutaan bahkan miliaran kenop, jadi bukitnya punya arah sebanyak itu sekaligus. Nggak ada yang bisa membayangkannya, tapi idenya persis sama, melangkah sedikit ke bawah di semua arah bersamaan.',
		'Kalau mau, coba ganti ganti tiga ukuran langkahnya dan lihat masing masing menggelinding. Opsional kok, bukitnya nggak bakal kabur.'
	],
	reactions: {
		small:
			'Langkah mini. Aman, tapi lihat tuh merayapnya. Melatih model sungguhan begini bisa makan waktu berhari hari dan listrik yang banyak.',
		good: 'Pas banget. Beberapa langkah mantap, lalu bolanya diam di dasar lembah. Ukuran langkah kayak gini yang dicari para engineer.',
		big: 'Lompatan raksasa! Tiap mendarat makin tinggi, terus terlempar deh. Learning rate yang kebesaran bikin model makin buruk, bukan makin bagus.'
	},
	panels: [
		{
			tag: 'Bukit',
			title: 'Kesalahan jadi bukit',
			body: 'Kiri kanan adalah posisi kenop. Atas bawah adalah <b>seberapa salah</b> modelnya. Benderanya menandai titik paling sedikit salahnya.'
		},
		{
			tag: 'Kabut',
			title: 'Cuma lereng yang terasa',
			body: 'Model nggak bisa melihat seluruh bukit. Panah kecil itu adalah <b>gradient</b>, kemiringan tepat di bawah bola, menunjuk ke arah turun.'
		},
		{
			tag: 'Putaran',
			title: 'Rasakan, melangkah, ulangi',
			body: 'Tiap langkah memutar kenop sedikit ke arah turun, dan bar <b>seberapa salah</b> ikut menyusut. Melatih model itu ya putaran ini, ribuan kali.'
		},
		{
			tag: 'Cara ingat',
			title: 'Turun bukit dalam kabut',
			body: 'Nggak perlu peta. Raba lerengnya pakai kaki, melangkah ke arah turun, ulangi sampai tanahnya datar.'
		},
		{
			tag: 'Kekecilan',
			title: 'Merayap',
			body: 'Dengan <b>learning rate</b> mini, tiap langkah nyaris nggak bergerak. Nggak ada yang rusak, cuma lambat banget dan mahal.'
		},
		{
			tag: 'Kebesaran',
			title: 'Terlempar',
			body: 'Lompatan yang kebesaran melewati lembahnya. Tiap mendarat makin tinggi dari sebelumnya, jadi modelnya makin buruk.'
		},
		{
			tag: 'Pas',
			title: 'Titik manis',
			body: 'Cukup besar buat bergerak cepat, cukup kecil biar nggak kelewatan. Beberapa langkah saja, bolanya sudah diam di dasar.'
		},
		{
			tag: 'Coba',
			title: 'Tiga ukuran langkah',
			body: 'Ganti ukuran langkahnya dan lihat bola yang sama merayap, berhenti di dasar, atau terlempar. Bukitnya sama, titik awalnya sama, cuma langkahnya yang beda.'
		}
	],
	axisKnob: 'posisi kenop',
	axisError: 'seberapa salah',
	lowest: 'paling sedikit salah',
	errorLabel: 'Seberapa salah',
	stepN: 'Langkah {n}',
	bottom: 'Sampai di dasar dalam {n} langkah',
	far: 'Masih jauh dari dasar setelah {n} langkah',
	flew: 'Terlempar dari bukit',
	rule: 'Raba lerengnya, melangkah turun, ulangi.',
	sizes: ['langkah mini', 'pas', 'lompatan raksasa'],
	sizeLabel: 'Ukuran langkah, {x}',
	another: 'Coba ukuran langkah lain'
};
