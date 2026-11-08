import type { ExperimentText } from '../../types';
export const id: ExperimentText = {
	labLabel: 'Percobaanmu',
	hintLabel: 'Petunjuk',
	scope:
		'Skenario ringkas CSF 2.0. Tiap fungsi punya lebih banyak hasil dan kegiatan dalam penerapan sungguhan.',
	title: 'NIST CSF 2.0',
	intro: [
		'<b>NIST</b> adalah National Institute of Standards and Technology, lembaga pengukuran dan standar di Amerika Serikat. Salah satu rujukan keamanannya adalah <b>Cybersecurity Framework</b>, disingkat CSF.',
		'<b>CSF 2.0</b> membantu organisasi membicarakan hasil keamanan yang ingin dicapai. Enam fungsinya berjalan bersama dan berulang, bukan enam kotak yang sekali dicentang langsung menjamin aman.',
		'<b>Govern</b> menetapkan tanggung jawab dan arah. <b>Identify</b> mengenali aset serta risikonya. <b>Protect</b> menyiapkan perlindungan. Di tim kecil ini, tunjuk Ari, catat server, lalu uji salinan backup sebelum gangguan.',
		'Sekarang jalankan insiden latihan. <b>Detect</b> menemukan aktivitas mencurigakan. <b>Respond</b> menangani dan membatasi dampaknya. <b>Recover</b> mengembalikan layanan dengan keadaan yang dipercaya.',
		'Backup saja belum cukup. Di lab ini, isolasi server bermasalah sebelum memulihkan salinan bersih. Pada pekerjaan sungguhan, perbaiki penyebab, jaga bukti, koordinasikan pemulihan, dan uji layanan.',
		'[ingat] <b>Atur, kenali, lindungi, deteksi, tangani, pulihkan.</b> NIST adalah lembaganya, CSF adalah kerangka yang sedang kita pakai.'
	],
	reactions: {
		govern:
			'Sekarang jelas siapa yang mengambil keputusan. Keamanan juga soal tanggung jawab, bukan hanya perangkat.',
		identify:
			'Tiga server tercatat. Inventaris membantu tim tahu apa yang perlu dijaga dan siapa pemiliknya.',
		protect:
			'Salinan bersih sudah dibuat dan diuji. Kita menyiapkan kemampuan pulih sebelum membutuhkannya.',
		detect:
			'Alarm dan catatan menunjukkan aktivitas tidak wajar. Ini alasan untuk menyelidiki, bukan langsung menebak semua penyebabnya.',
		respond:
			'Server bermasalah diisolasi. Penyebaran dibatasi sementara tim menangani penyebab dan menjaga bukti.',
		recover:
			'Salinan bersih kembali melayani. Uji layanan dan perbaiki rencana dari pengalaman tadi.',
		incident:
			'Server latihan terganggu. Gunakan fungsi deteksi, respons, dan pemulihan untuk menanganinya.',
		tooLate:
			'Salinan bersih dalam skenario ini harus disiapkan sebelum insiden. Siapkan skenario baru, lalu buat backup sebelum memulai insiden.',
		noIncident:
			'Belum ada insiden latihan. Tindakan ini akan memberi hasil setelah kamu menjalankan gangguannya.',
		notReady:
			'Pemulihan membutuhkan salinan bersih yang sudah diuji dan server bermasalah yang sudah diisolasi.'
	},
	goal: 'Jalankan kerangka kerja dalam satu kejadian',
	tasks: ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
	hint: 'Tunjuk pemilik, catat aset, dan uji backup. Jalankan insiden. Tinjau alarm, isolasi server, lalu pulihkan.',
	labels: {
		newScenario: 'Siapkan skenario baru',
		incidentButton: 'Jalankan insiden latihan',
		governAction: 'Tunjuk penanggung jawab',
		identifyAction: 'Catat aset layanan',
		protectAction: 'Buat dan uji backup',
		detectAction: 'Tinjau alarm dan log',
		respondAction: 'Isolasi server bermasalah',
		recoverAction: 'Pulihkan salinan bersih',
		backup: 'Backup bersih',
		ready: 'Tim menyiapkan layanan',
		govern: 'Ari bertanggung jawab atas keputusan',
		identify: 'Tiga server masuk inventaris',
		protect: 'Backup siap dan sudah diuji',
		detect: 'Aktivitas mencurigakan terdeteksi',
		respond: 'Server bermasalah diisolasi',
		recover: 'Layanan pulih dan diuji',
		incident: 'Insiden sedang berlangsung',
		tooLate: 'Belum ada salinan bersih sebelum insiden',
		noIncident: 'Belum ada insiden latihan',
		notReady: 'Siapkan backup dan isolasi sebelum pemulihan',
		owner: 'Penanggung jawab',
		inventory: 'Server tercatat',
		service: 'Status layanan',
		unknown: 'belum diketahui',
		running: 'berjalan',
		affected: 'terganggu',
		isolated: 'diisolasi',
		restored: 'pulih'
	}
};
