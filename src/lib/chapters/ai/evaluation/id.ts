import type { EvaluationText } from './types';

export const id: EvaluationText = {
	title: 'Evaluasi model',
	intro: [
		'Sebuah klinik dapat asisten AI baru. Dia membaca hasil tes darah tiap pasien dan memberi <b>skor risiko</b> dari 0 sampai 100. Makin tinggi skornya, makin mungkin orang itu sakit. Ini dua puluh pasien, dijejer sesuai skornya.',
		'Harus ada yang menarik garis, namanya <b>threshold</b> (ambang batas). Semua yang ada di kanan garis ditandai dan dipanggil lagi untuk diperiksa lebih teliti. Yang di kiri garis boleh pulang.',
		'Sekarang kenyataannya, yang nggak diketahui AI. Dari semua pasien ini cuma tiga yang benar benar sakit (yang merah). Skornya petunjuk yang bagus, tapi nggak sempurna, ada juga orang sehat yang skornya tinggi.',
		'Jadi AI bisa salah dengan dua cara. <b>Alarm palsu</b> menandai orang sehat, yang lalu dapat telepon menakutkan padahal nggak apa apa. <b>Kasus terlewat</b> memulangkan orang yang sebenarnya sakit. Lihat garisnya bergeser sendiri.',
		'Geser ke kiri, semua yang sakit tertangkap, tapi alarm palsunya menumpuk. Geser ke kanan, alarm palsunya hilang, tapi ada orang sakit yang lolos. Dua duanya nggak bisa dihapus, jadi kamu memilih kesalahan mana yang lebih menyakitkan. Klinik biasanya menaruh garisnya rendah, karena tes kedua bisa membebaskan yang sehat.',
		'Ada jebakan nih. Menilai model cuma dari <b>akurasi</b> (berapa jawaban yang benar) bisa menipu. AI malas yang memulangkan semua orang benar 17 dari 20 kali, itu 85%, padahal nggak ada satu pun yang sakit tertangkap.',
		'[ingat] Bayangkan jaring ikan. Jaring lebar dapat semua ikan, tapi sandal jepit ikut nyangkut (alarm palsu). Jaring sempit bersih, tapi ada ikan yang lolos (kasus terlewat). Milih threshold itu sama dengan milih jaring.',
		'[fyi] Filter spam juga menghadapi pilihan yang sama. Alarm palsu menyembunyikan email penting dari bosmu di folder spam, kasus terlewat membiarkan satu penipuan lagi masuk inbox. Aplikasi email memakai jaring yang lebih sempit daripada klinik.',
		'Mau milih jaringmu sendiri? Geser garisnya dan lihat siapa yang tertangkap, siapa yang terlewat, dan siapa yang kaget gara gara alarm palsu. Ini opsional kok.'
	],
	reactions: {
		catch:
			'Semua yang sakit tertangkap, alarm palsunya cuma sedikit. Untuk pemeriksaan awal di klinik, itu jaring yang bagus.',
		noisy:
			'Semua yang sakit tertangkap, tapi lihat alarm palsunya sebanyak itu. Separuh klinik dapat telepon yang bikin cemas padahal nggak apa apa.',
		miss: 'Ada orang sakit yang lolos di bawah garis dan pulang. Alarm palsunya memang berkurang, tapi di klinik kasus yang terlewat bisa serius.'
	},
	panels: [
		{
			tag: 'Skor risiko',
			title: 'Satu angka untuk tiap pasien',
			body: 'AI itu nggak bilang ya atau tidak. Dia memberi tiap orang skor dari 0 sampai 100, lalu mereka diletakkan di garis sesuai skor itu.'
		},
		{
			tag: 'Threshold',
			title: 'Di mana garisnya ditarik',
			body: 'Siapa pun yang ada di garis atau di kanannya <b>ditandai</b> dan dipanggil lagi. Model memberi skor, manusia yang memilih garisnya.'
		},
		{
			tag: 'Kenyataannya',
			title: 'Siapa yang benar benar sakit',
			body: 'Merah artinya benar benar sakit. Kebanyakan yang sakit skornya tinggi, tapi ada orang sehat yang skornya 80 dan orang sakit yang cuma 52.'
		},
		{
			tag: 'Dua kesalahan',
			title: 'Alarm palsu dan kasus terlewat',
			body: 'Cincin kuning itu <b>alarm palsu</b> (sehat, tapi ditandai). Cincin merah itu <b>kasus terlewat</b> (sakit, tapi dipulangkan). Cincin hijau itu orang sakit yang tertangkap dengan benar.'
		},
		{
			tag: 'Pilihannya',
			title: 'Kesalahan mana yang lebih sakit',
			body: 'Untuk penyakit, melewatkan orang lebih parah daripada bikin kaget, jadi garisnya rendah. Garis yang tepat tergantung tugasnya, bukan angka ajaib.'
		},
		{
			tag: 'Akurasi',
			title: 'Jebakan 85%',
			body: 'Kalau satu kelompok jarang, model bisa dapat nilai tinggi dengan mengabaikannya. Selalu tanya berapa kasus penting yang tertangkap.'
		},
		{
			tag: 'Cara ingat',
			title: 'Pilih jaringmu',
			body: 'Jaring lebar (garis rendah) dapat semuanya, sampah pun ikut. Jaring sempit (garis tinggi) bersih, tapi ada yang lolos.'
		},
		{
			tag: 'Coba',
			title: 'Garismu sendiri',
			body: 'Geser garisnya ke kiri dan kanan. Lihat tiga hitungannya berubah bareng, kesalahannya nggak pernah bisa nol semua.'
		}
	],
	axis: 'Skor risiko dari tes',
	flagged: 'dipanggil lagi',
	home: 'dipulangkan',
	caught: 'Tertangkap',
	missed: 'Terlewat',
	falseAlarm: 'Alarm palsu',
	ofSick: '{n} dari {total}',
	accuracy: '{n}% jawaban benar',
	wide: 'Jaring lebar',
	tight: 'Jaring sempit',
	rule: 'Jaring lebar, dapat semua plus sampah. Jaring sempit, bersih tapi ada yang lolos',
	thresholdAria: 'Threshold',
	thresholdValue: 'Tandai mulai skor {n}',
	patient: 'Pasien dengan skor {score}, {truth}',
	sick: 'benar benar sakit',
	healthy: 'benar benar sehat',
	chartLabel: 'Dua puluh pasien diletakkan sesuai skor risiko'
};
