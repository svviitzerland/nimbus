import type { CloudText } from '../../types';

export const id: CloudText = {
	title: 'Apa itu cloud?',
	intro: [
		'Untuk menjalankan nimbus.com, kamu bisa mengelola infrastruktur sendiri atau memakai layanan cloud. Infrastruktur di tempat sendiri disebut <b>on premises</b>.',
		'<b>Cloud</b> menyediakan sumber daya seperti komputasi, penyimpanan, dan jaringan melalui layanan yang bisa dipesan saat dibutuhkan. Perangkatnya berada di [[data center|cloud/data-center]]. Public cloud melayani banyak pelanggan, sedangkan private cloud digunakan oleh satu organisasi.',
		'Dua duanya sudah berdiri bersebelahan, server di rumahmu dan server di cloud. Tengok satu satu dan rasakan bedanya.',
		'[ingat] Cloud tetap memakai komputer sungguhan. Kamu memakai sumber dayanya melalui layanan.'
	],
	reactions: {
		home: 'Simpan sendiri di rumah atau kantor itu <b>on premise</b>. Lihat di atas, pas mati lampu, website kamu langsung ikut mati.',
		cloud:
			'Kamu memakai sumber daya milik penyedia cloud. Pada contoh ini, pusat datanya memiliki listrik cadangan. Bandingkan dengan server rumah.',
		both: 'Di contoh ini, server rumah tidak punya listrik cadangan. Pusat data penyedia punya perlindungan tambahan, tapi cloud juga bisa mengalami gangguan. Kita akan belajar menyiapkan cadangan, bukan berharap satu mesin selalu hidup.'
	},
	homeTitle: 'Server di rumahmu',
	homeSub: 'On premise (kelola sendiri)',
	cloudTitle: 'Server di cloud',
	cloudSub: 'Cloud (sewa sumber daya)',
	homePoints: [
		'Kalau mati lampu, server ikut mati dan website kamu hilang',
		'Internet rumah tidak sekencang data center',
		'Komputernya panas, berisik, dan mahal dibeli'
	],
	cloudPoints: [
		'Listrik dan internet punya cadangan 24 jam, jadi jarang mati',
		'Sewa per jam, bayar hanya yang kamu pakai',
		'Butuh lebih kuat? Tambah komputer dalam hitungan detik'
	],
	onpremTerm: 'On premise',
	cloudTerm: 'Cloud',
	offline: 'Mati lampu'
};
