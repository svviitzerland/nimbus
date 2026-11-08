import type { AZText } from '../../types';

export const id: AZText = {
	title: 'Apa itu Availability Zone?',
	intro: [
		'Baru di 2026, drone Iran benar-benar menghantam data center AWS di Timur Tengah, dan banyak layanan di sana mati.',
		'Dan bukan cuma serangan. Kebakaran, banjir, gempa, petir, sampai salah konfigurasi, semuanya pernah menjatuhkan data center.',
		'Hardware juga sering rusak, satu disk atau server bisa mati kapan saja, tapi itu biasanya sudah ditangani redundansi di dalam data center.',
		'Yang lebih bahaya kalau satu gedung data center utuh tumbang. Pertanyaannya, gimana caranya website tetap jalan kalau itu terjadi?',
		'Jawabannya, satu <b>region</b> itu bukan satu gedung. Di dalamnya ada beberapa <b>Availability Zone</b> (AZ), yaitu data center terpisah yang letaknya berjauhan dan punya listrik serta jaringan sendiri. Jadi kalau satu AZ kena masalah, yang lain tetap jalan.',
		'Petanya sudah terbuka dengan dua region. Masuk ke salah satunya, sebar server-mu ke beberapa AZ, lalu picu gangguannya sendiri.',
		'[ingat] Region memilih kawasan, zone memisahkan lokasi kegagalan di dalam kawasan itu.'
	],
	reactions: {
		virginia:
			'Ini region Virginia. Titik-titik itu Availability Zone-nya, masing-masing satu data center yang terpisah.',
		'virginia-name':
			'Lihat namanya, <b>us-east-1a</b>, <b>us-east-1b</b>, dan seterusnya. Huruf di belakangnya diacak beda untuk tiap akun dan dirahasiakan, biar beban tersebar rata, bukan numpuk di "a". Sekarang sebar server-mu ke beberapa AZ, lalu picu gangguan.',
		singapore:
			'Ini region Singapura. Titik-titik itu Availability Zone-nya, masing-masing satu data center yang terpisah.',
		'singapore-name':
			'Lihat namanya, <b>ap-southeast-1a</b>, <b>ap-southeast-1b</b>, dan seterusnya. Huruf di belakangnya diacak beda untuk tiap akun dan dirahasiakan, biar beban tersebar rata, bukan numpuk di "a". Sekarang sebar server-mu ke beberapa AZ, lalu picu gangguan.',
		down: 'Nah kan. Server-mu cuma ada di satu AZ, jadi pas AZ itu kena, website-mu langsung ikut mati. Sebar ke AZ lain, lalu picu lagi.',
		survived:
			'Lihat bedanya. Satu AZ tumbang, tapi AZ lain tetap melayani, jadi website-mu selamat. Itulah gunanya sebar ke beberapa AZ.'
	},
	worldHint: 'Klik sebuah region untuk melihat Availability Zone-nya',
	back: 'Kembali ke peta',
	serverLabel: 'Server',
	place: 'Klik AZ untuk menaruh atau mengangkat server',
	trigger: 'Picu gangguan',
	statusUp: 'Online',
	statusDown: 'Mati',
	activeZones: 'AZ aktif',
	regions: { virginia: 'Virginia', singapore: 'Singapura' },
	strikeLabel: 'Timur Tengah',
	news: [
		{
			src: 'CNBC, 2026',
			head: 'Drone Iran menghantam data center AWS di Timur Tengah',
			url: 'https://www.cnbc.com/2026/04/07/aws-iran-threats-us-tech-data-centers.html'
		},
		{
			src: 'Data Center Dynamics, 2021',
			head: 'Kebakaran menghancurkan data center OVHcloud di Strasbourg',
			url: 'https://www.datacenterdynamics.com/en/news/fire-destroys-ovhclouds-sbg2-data-center-strasbourg/'
		},
		{
			src: 'Amazon Web Services, 2021',
			head: 'Gangguan besar melumpuhkan region us-east-1 (Virginia)',
			url: 'https://aws.amazon.com/message/12721/'
		},
		{
			src: 'Data Center Dynamics, 2022',
			head: 'Gelombang panas London, pendingin gagal, layanan cloud tumbang',
			url: 'https://www.datacenterdynamics.com/en/news/googles-london-data-center-outage-during-heatwave-caused-by-simultaneous-failure-of-multiple-redundant-cooling-systems/'
		},
		{
			src: 'Data Center Dynamics, 2012',
			head: 'Banjir Badai Sandy melumpuhkan data center di New York',
			url: 'https://www.datacenterdynamics.com/en/news/hurricane-sandy-data-center-stories-from-manhattan/'
		},
		{
			src: 'Data Center Dynamics, 2015',
			head: 'Petir menyambar data center Google di Belgia, sebagian data hilang',
			url: 'https://www.datacenterdynamics.com/en/news/lightning-strikes-and-old-disks-cause-google-data-loss/'
		},
		{
			src: 'Engineering at Meta, 2021',
			head: 'Salah perintah membuat Facebook hilang dari internet 6 jam',
			url: 'https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/'
		},
		{
			src: 'Fastly, 2021',
			head: 'Satu bug konfigurasi menumbangkan banyak situs besar',
			url: 'https://www.fastly.com/blog/summary-of-june-8-outage'
		},
		{
			src: 'Data Center Dynamics, 2011',
			head: 'Gempa besar Jepang, pemadaman dan krisis bahan bakar tekan data center',
			url: 'https://www.datacenterdynamics.com/en/news/the-after-effect-of-the-japanese-earthquake/'
		}
	]
};
