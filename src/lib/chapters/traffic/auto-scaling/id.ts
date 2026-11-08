import type { AutoScalingText } from '../types';

export const id: AutoScalingText = {
	title: 'Auto scaling',
	intro: [
		'Di pelajaran tadi kamu sendiri yang menekan Tambah pas server kewalahan. Masalahnya, trafik bisa melonjak jam 2 pagi pas kamu tidur. Masa harus begadang buat jagain server.',
		'<b>Auto scaling</b> itu robot yang begadang untukmu. Dia mantau satu angka, biasanya <b>CPU</b>, seberapa keras mesinmu lagi mikir. Bisa juga RAM atau jumlah request.',
		'Kamu tinggal kasih dia aturan. Misal kalau CPU lewat 70 persen, tambah satu mesin. Kalau turun di bawah 30 persen, kurangi satu. Mesin baru otomatis kebagian beban dari load balancer yang kemarin.',
		'Robotnya sudah mulai jaga. Trafiknya hidup, naik turun sendiri persis pengunjung asli, dan kamu boleh ikut campur pakai plus dan minus. Tinggal perhatikan siapa yang kerja.',
		'[ingat] Autoscaling mengikuti sinyal beban. Menambah kapasitas butuh waktu, jadi ukur dan atur batasnya.'
	],
	reactions: {
		'scaled-up':
			'Pengunjung lagi ramai dan CPU tembus 70 persen. Aturannya menyala, dan mesin nambah sendiri sampai bebannya normal lagi.',
		'scaled-down':
			'Sepi lagi, CPU melorot di bawah 30 persen, dan mesin dipulangkan satu satu. Biayanya ikut turun. Kamu cuma bayar yang benar benar jalan.'
	},
	trafficLabel: 'pengunjung',
	plusLabel: 'Tambah pengunjung',
	minusLabel: 'Kurangi pengunjung',
	balancerLabel: 'Load balancer',
	ruleTitle: 'Aturan autoscaling',
	cpuLabel: 'CPU',
	condUp: 'Di atas 70%',
	actUp: 'Tambah mesin',
	condDown: 'Di bawah 30%',
	actDown: 'Kurangi mesin',
	addEvent: '+1 mesin',
	removeEvent: '-1 mesin',
	costLabel: 'Biaya ${n} per jam',
	promptRaise: 'Jumlah pengunjung berubah otomatis. Kamu juga bisa menambah atau menguranginya.',
	promptWatch: 'CPU melewati batas. Sistem sedang menambah server.',
	promptDrop:
		'Beban sudah normal lagi. Pas trafiknya turun nanti, mesinnya juga dikurangi sendiri.',
	promptDone: 'Naik sendiri pas ramai, turun sendiri pas sepi. Kamu bayar sesuai pemakaian.'
};
