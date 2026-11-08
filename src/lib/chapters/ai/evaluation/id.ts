import type { EvaluationText } from './types';

export const id: EvaluationText = {
	title: 'Evaluasi model',
	intro: [
		'Sebuah klinik dapat AI baru yang membaca hasil tes darah dan memberi setiap pasien <b>skor risiko</b> dari 0 sampai 100. Makin tinggi skornya, makin mungkin orang itu sakit. Sekarang harus ada yang memutuskan di mana garisnya ditarik.',
		'Garis itu namanya <b>threshold</b> (ambang batas). Semua yang skornya di atas garis ditandai sakit dan dipanggil lagi untuk diperiksa lebih teliti. Yang di bawah garis boleh pulang.',
		'Cara paling gampang menilai model adalah <b>akurasi</b>, berapa persen jawabannya yang benar. Tapi ada jebakannya. Dari 20 pasien cuma 3 yang sakit, jadi model malas yang bilang semua orang sehat bakal benar 17 dari 20 kali (itu 85%) tanpa menemukan satu pun yang sakit.',
		'Makanya dua jenis kesalahan dihitung terpisah. <b>Alarm palsu</b> (false positive) menandai orang sehat sebagai sakit. <b>Kasus terlewat</b> (false negative) memulangkan orang yang sebenarnya sakit. Tekan yang satu, biasanya yang lain naik.',
		'[fyi] Filter spam juga menghadapi pilihan yang sama. Alarm palsu menyembunyikan email penting dari bosmu di folder spam, kasus terlewat membiarkan satu penipuan lagi masuk inbox. Aplikasi email lebih rela kelewatan sedikit spam, sedangkan klinik lebih rela ada sedikit alarm palsu.',
		'[ingat] Threshold mengubah jumlah prediksi positif. Periksa false positive dan false negative untuk memilih batas yang sesuai kebutuhan.',
		'Ini 20 pasien, diletakkan sesuai skornya, yang benar benar sakit berwarna merah. Coba model malasnya dulu, lalu geser thresholdnya dan lihat siapa yang tertangkap, siapa yang terlewat, dan siapa yang kaget gara gara alarm palsu.'
	],
	reactions: {
		lazy: 'Akurasinya 85% tapi sama sekali nggak berguna. Ketiga orang yang sakit disuruh pulang. Kalau satu kelompok jarang muncul, akurasi saja bisa menipu banget.',
		low: 'Semua yang sakit tertangkap, tapi lihat alarm palsunya sebanyak itu. Separuh klinik dapat telepon yang bikin cemas padahal nggak apa apa.',
		catch_all:
			'Ketiga orang sakit tertangkap, dengan harga beberapa alarm palsu. Untuk pemeriksaan awal itu biasanya pilihan yang tepat, tes kedua nanti membebaskan yang sehat.',
		miss: 'Ada orang sakit yang lolos di bawah garis dan pulang. Alarm palsunya memang berkurang, tapi di klinik kasus yang terlewat bisa serius.',
		best_acc:
			'Lihat, akurasinya baru saja mencapai 90%, angka terbaik sejauh ini, padahal dua dari tiga orang sakit terlewat. Skor tertinggi belum tentu model terbaik.',
		done: 'Kamu sudah melihat gambaran utuhnya. Akurasi cuma satu angka, tapi kesalahan ada dua jenis, dan threshold dipilih dengan bertanya kesalahan mana yang lebih menyakitkan. Semua model serius dinilai begini, dari kedokteran sampai deteksi penipuan.'
	},
	modeReal: 'Tes sungguhan',
	modeLazy: 'Bilang semua sehat',
	threshold: 'Tandai sakit mulai skor {n}',
	thresholdAria: 'Threshold',
	lazyNote: 'Model ini mengabaikan skor dan memulangkan semua orang',
	accuracy: 'akurasi',
	caught: 'Tertangkap',
	missed: 'Terlewat',
	falseAlarm: 'Alarm palsu',
	cleared: 'Pulang dengan benar',
	axis: 'Skor risiko dari tes',
	flagged: 'ditandai sakit',
	sick: 'benar benar sakit',
	healthy: 'benar benar sehat',
	patient: 'Pasien dengan skor {score}, {truth}',
	chartLabel: 'Dua puluh pasien diletakkan sesuai skor risiko'
};
